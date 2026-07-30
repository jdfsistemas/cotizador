const quotesRows = document.querySelector("#quotesRows");
const quotesCount = document.querySelector("#quotesCount");
const quotesStatus = document.querySelector("#quotesStatus");
const detailPanel = document.querySelector("#detailPanel");
const quoteDetail = document.querySelector("#quoteDetail");

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const loadQuotes = async () => {
  quotesStatus.textContent = "Cargando...";
  const response = await fetch("/api/quotes");
  const data = await response.json();

  if (!response.ok) {
    quotesStatus.textContent = data.error || "No se pudieron cargar las cotizaciones.";
    return;
  }

  quotesCount.textContent = data.quotes.length;
  quotesRows.innerHTML = data.quotes.map((quote) => `
    <tr>
      <td>${quote.id}</td>
      <td>${escapeHtml(quote.quote_date)}</td>
      <td>${escapeHtml(quote.client)}</td>
      <td>${escapeHtml(quote.po_huella)}</td>
      <td>${usd.format(quote.total_usd)}</td>
      <td>${escapeHtml(quote.created_at)}</td>
      <td><button class="ghost-button small-button" type="button" data-id="${quote.id}">Ver</button></td>
    </tr>
  `).join("");
  quotesStatus.textContent = data.quotes.length ? "" : "No hay cotizaciones guardadas.";
};

const renderDetail = (quote) => {
  const payload = quote.payload;
  const sections = payload.sections
    .filter((section) => section.items.length)
    .map((section) => `
      <h3>${escapeHtml(section.sectionTitle)}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cant.</th>
              <th>Producto</th>
              <th>Valor unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${section.items.map((item) => `
              <tr>
                <td>${item.qty}</td>
                <td>${escapeHtml(item.product)}</td>
                <td>${usd.format(item.hgcUsd)}</td>
                <td>${usd.format(item.totalUsd)}</td>
              </tr>
            `).join("")}
            <tr><td></td><td>Flete</td><td></td><td>${usd.format(section.totals.freightTotal + section.totals.handlingTotal)}</td></tr>
            <tr><td></td><td><strong>Subtotal</strong></td><td></td><td><strong>${usd.format(section.totals.subtotal)}</strong></td></tr>
            <tr><td></td><td><strong>IVA</strong></td><td></td><td><strong>${usd.format(section.totals.taxTotal)}</strong></td></tr>
            <tr><td></td><td><strong>Total aprox.</strong></td><td></td><td><strong>${usd.format(section.totals.total)}</strong></td></tr>
          </tbody>
        </table>
      </div>
    `).join("");

  quoteDetail.innerHTML = `
    <div class="detail-summary">
      <p><strong>Cliente:</strong> ${escapeHtml(payload.billTo)}</p>
      <p><strong>PO Huella:</strong> ${escapeHtml(payload.poHuella)}</p>
      <p><strong>Fecha:</strong> ${escapeHtml(payload.date)}</p>
      <p><strong>Agente:</strong> ${escapeHtml(payload.agent)}</p>
      <p><strong>Total:</strong> ${usd.format(payload.totals.total)}</p>
    </div>
    ${sections}
  `;
  detailPanel.hidden = false;
  detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
};

const loadQuoteDetail = async (id) => {
  quotesStatus.textContent = "Cargando detalle...";
  const response = await fetch(`/api/quotes/${id}`);
  const data = await response.json();

  if (!response.ok) {
    quotesStatus.textContent = data.error || "No se pudo cargar el detalle.";
    return;
  }

  quotesStatus.textContent = "";
  renderDetail(data.quote);
};

quotesRows.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  loadQuoteDetail(button.dataset.id);
});

document.querySelector("#refreshButton").addEventListener("click", loadQuotes);
document.querySelector("#closeDetailButton").addEventListener("click", () => {
  detailPanel.hidden = true;
});

loadQuotes();
