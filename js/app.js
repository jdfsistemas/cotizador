let cotizacionActualId = null;

const form = document.querySelector("#quoteForm");
const quoteRows = document.querySelector("#quoteRows");
const itemsList = document.querySelector("#itemsList");
const saveStatus = document.querySelector("#saveStatus");
const companyHeader = document.querySelector("#companyHeader");

const colombiaHeader = `
  <img
    src="img/Logo Color 1.png"
    alt="Huella Global Colombia"
    class="company-logo"
  >

  <div class="company-info">
    <h1>HUELLA GLOBAL COLOMBIA S.A.S</h1>
    <p>NIT. 901754865-8</p>
    <p>Guarne - Antioquia</p>
    <p>troqueles@huellaglobal.com</p>
    <p>comercial@huellaglobal.com</p>
    <p>301 386 8493 · 302 351 8101</p>
  </div>
`;

const corporationHeader = `
  <img
    src="img/logos huella global Corporation.png"
    alt="Huella Global Corporation"
    class="company-logo"
  >

  <div class="company-info">
    <h1>HUELLA GLOBAL CORPORATION</h1>
    <p>17765 SW 20th Street - Miramar, FL.</p>
    <p>comercial@huellaglobal.com</p>
    <p>troqueles@huellaglobal.com</p>
    <p>+57 301 386 8493 · 302 351 8101</p>
  </div>
`;

let itemCounter = 3;

const planDefaults = {
  standard: {
    label: "Troquel universal",
    sectionTitle: "TROQUEL UNIVERSAL",
  },
  extended: {
    label: "Troquel 3L vida extendida",
    sectionTitle: "TROQUEL 3L VIDA EXTENDIDA",
  },
  chrome: {
    label: "Troquel cromo",
    sectionTitle: "TROQUEL CROMO",
  },
};

const freightConfig = {
  COLOMBIA: {
    iva: 19,
    base: 72,
    rango: 4,
    manejo: true
  },
  ECUADOR: {
    iva: 0,
    base: 145,
    rango: 5,
    manejo: false
  },
  REPUBLICA_DOMINICANA: {
    iva: 0,
    base: 90,
    rango: 5,
    manejo: false
  }
};

const fedexTrmBase = 3600;
const fedexFuelUsd = 11.944444444444445;

const fedexHandlingRanges = [
  { min: 0, max: 10, cop: 0 },
  { min: 10.01, max: 50, cop: 48000 },
  { min: 50.01, max: 100, cop: 62600 },
  { min: 100.01, max: 300, cop: 75500 },
  { min: 300.01, max: 500, cop: 90500 },
  { min: 500.01, max: 1000, cop: 101500 },
  { min: 1000.01, max: 1500, cop: 121500 },
  { min: 1500.01, max: 2000, cop: 143000 },
];

const dhlHandlingRanges = [
  { minExclusive: 0, max: 100, usd: 5 },
  { min: 100.01, max: 500, usd: 29 },
  { min: 500.01, max: Infinity, usd: 53 },
];

const usd = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberValue = (name) => {
  const element = form.elements[name];
  if (!element) return 0;
  const value = Number(element.value);
  return Number.isFinite(value) ? value : 0;
};

const textValue = (name) => {
  const element = form.elements[name];
  return element ? element.value.trim() : "";
};

const hgcPriceUsd = (kocherUsd) => {
  return Math.round((kocherUsd / 0.8) * 100) / 100;
};

const freightUsd = (quantity) => {
  const pais = form.elements.country ? form.elements.country.value : "COLOMBIA";
  const config = freightConfig[pais];
  if (!config || quantity <= 0) return 0;
  const bloques = Math.ceil(quantity / config.rango);
  return bloques * config.base;
};

const poHuellaCode = () => {
  const poInput = form.elements.poHuella;
  if (!poInput) return "";
  return poInput.value.trim();
};

const dhlHandlingUsd = (kocherUnitTotal) => {
  const range = dhlHandlingRanges.find((item) => {
    const minOk =
      item.minExclusive !== undefined
        ? kocherUnitTotal > item.minExclusive
        : kocherUnitTotal >= item.min;
    return minOk && kocherUnitTotal <= item.max;
  });
  return range ? range.usd : 0;
};

const fedexHandlingUsd = (kocherUnitTotal) => {
  const range = fedexHandlingRanges.find(
    (item) => kocherUnitTotal >= item.min && kocherUnitTotal <= item.max
  );
  return range
    ? range.cop / fedexTrmBase
    : fedexHandlingRanges.at(-1).cop / fedexTrmBase;
};

const handlingUsd = (agent, kocherUnitTotal, fuelKocherTotal) => {
  const pais = form.elements.country ? form.elements.country.value : "COLOMBIA";
  const config = freightConfig[pais];
  if (!config?.manejo) return 0;

  const base =
    agent === "DHL"
      ? dhlHandlingUsd(kocherUnitTotal)
      : fedexHandlingUsd(kocherUnitTotal);

  const fuel = fuelKocherTotal >= 200 ? fedexFuelUsd : 0;
  return base + fuel;
};  

const setText = (id, value) => {
  const element = document.querySelector(`#${id}`);
  if (element) {
    element.textContent = value;
  }
};

const fieldValue = (row, field) => {
  const element = row.querySelector(`[data-field="${field}"]`);
  return element ? element.value : "";
};

const fieldNumberValue = (row, field) => {
  const value = Number(fieldValue(row, field));
  return Number.isFinite(value) ? value : 0;
};

const itemRows = () => {
  return [...itemsList.querySelectorAll(".quote-item")];
};

const itemData = () => {
  return itemRows().map((row) => {
    const kocherUsd = fieldNumberValue(row, "usd");
    const hgcUsd = hgcPriceUsd(kocherUsd);
    const qty = fieldNumberValue(row, "qty");

    return {
      type: fieldValue(row, "type"),
      typeLabel:
        row.querySelector('[data-field="type"]').options[
          row.querySelector('[data-field="type"]').selectedIndex
        ].text,
      qty,
      product: fieldValue(row, "product").trim(),
      kocherUsd,
      hgcUsd,
      totalUsd: hgcUsd * qty,
    };
  });
};

const itemRowTemplate = (index) => `
  <div class="item-row quote-item">
    <select name="type${index}" data-field="type" aria-label="Tipo de troquel ${index}">
      <option value="">Seleccione...</option>
      <option value="standard">Universal</option>
      <option value="extended">3L vida extendida</option>
      <option value="chrome">Cromo</option>
    </select>
    <input name="qty${index}" data-field="qty" type="number" min="0" step="1" value="1" aria-label="Cantidad item ${index}">
    <input name="product${index}" data-field="product" aria-label="Producto item ${index}">
    <input name="usd${index}" data-field="usd" type="number" min="0" step="0.01" aria-label="USD Kocher item ${index}">
    <output data-field="hgc">USD 0.00</output>
    <output data-field="total">USD 0.00</output>
  </div>
`;

const addItemRow = () => {
  itemCounter += 1;
  itemsList.insertAdjacentHTML("beforeend", itemRowTemplate(itemCounter));
};

const getQuoteTrm = () => {
  return numberValue("trm");
};

const sectionTotals = (items, fuelKocherTotal) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);
  const productsTotal = items.reduce((sum, item) => sum + item.totalUsd, 0);
  const kocherUnitTotal = items.reduce((sum, item) => sum + item.kocherUsd, 0);
  const freightTotal = items.length ? freightUsd(totalQuantity) : 0;
  const agentValue = form.elements.agent ? form.elements.agent.value : "FEDEX";
  const handlingTotal = items.length ? handlingUsd(agentValue, kocherUnitTotal, fuelKocherTotal) : 0;
  const subtotal = productsTotal + freightTotal + handlingTotal;
  const taxTotal = productsTotal * (numberValue("taxRate") / 100);
  const total = subtotal + taxTotal;

  return { productsTotal, freightTotal, handlingTotal, subtotal, taxTotal, total };
};

const buildQuoteData = () => {
  const allItems = itemData();
  const validItems = allItems.filter((item) => item.type && item.qty > 0 && item.hgcUsd > 0);

  const sectionItems = Object.keys(planDefaults).map((key) => ({
    key,
    label: planDefaults[key].label,
    sectionTitle: planDefaults[key].sectionTitle,
    items: validItems.filter((item) => item.type === key),
  }));

  const kocherTotals = Object.fromEntries(
    sectionItems.map((section) => [
      section.key,
      section.items.reduce((sum, item) => sum + item.kocherUsd * item.qty, 0),
    ])
  );

  const sections = sectionItems.map((section) => {
    const fuelKocherTotal =
      section.key === "chrome"
        ? kocherTotals.extended || 0
        : kocherTotals[section.key] || 0;

    return {
      ...section,
      totals: sectionTotals(section.items, fuelKocherTotal),
    };
  });

  const totals = {
    productsTotal: sections.reduce((sum, s) => sum + s.totals.productsTotal, 0),
    freightTotal: sections.reduce((sum, s) => sum + s.totals.freightTotal, 0),
    handlingTotal: sections.reduce((sum, s) => sum + s.totals.handlingTotal, 0),
    subtotal: sections.reduce((sum, s) => sum + s.totals.subtotal, 0),
    taxTotal: sections.reduce((sum, s) => sum + s.totals.taxTotal, 0),
    total: sections.reduce((sum, s) => sum + s.totals.total, 0),
  };

  return {
    id: cotizacionActualId || null,
    country: form.elements.country ? form.elements.country.value : "",
    billTo: textValue("billTo"),
    deliverTo: textValue("deliverTo"),
    po: textValue("po"),
    poHuella: textValue("poHuella"),
    inicialesCliente: form.dataset.inicialesCliente || "",
    consecutivoCliente: form.dataset.consecutivoCliente || "",
    date: form.elements.date ? form.elements.date.value : "",
    deliveryTime: textValue("deliveryTime"),
    agent: form.elements.agent ? form.elements.agent.value : "FEDEX",
    trmToday: numberValue("trmToday"),
    trmAdjustment: numberValue("trmAdjustment"),
    quoteTrm: getQuoteTrm(),
    taxRate: numberValue("taxRate"),
    items: validItems,
    sections,
    totals,
  };
};

const calculate = () => {
  if (form.elements.poHuella) {
    form.elements.poHuella.value = poHuellaCode();
  }

  const quoteTrm = getQuoteTrm();
  const quoteData = buildQuoteData();
  const { sections: sectionData, totals } = quoteData;

  const selectedLabels = sectionData
    .filter((section) => section.items.length)
    .map((section) => planDefaults[section.key].label);

  setText("grandTotal", usd.format(totals.total));
  setText("selectedPlan", selectedLabels.length ? selectedLabels.join(" + ") : "Seleccione tipo de troquel");
  setText("quoteTrm", quoteTrm.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  setText("productsTotal", usd.format(totals.productsTotal));
  setText("freightTotal", usd.format(totals.freightTotal));
  setText("handlingTotal", usd.format(totals.handlingTotal));
  setText("subtotal", usd.format(totals.subtotal));
  setText("taxTotal", usd.format(totals.taxTotal));
  setText("total", usd.format(totals.total));

  setText("previewBillTo", textValue("billTo"));
  setText("previewDeliverTo", textValue("deliverTo"));
  setText("previewPo", textValue("po"));
  setText("previewPoHuella", textValue("poHuella"));
  setText("previewDate", form.elements.date ? form.elements.date.value : "");
  setText("previewDelivery", textValue("deliveryTime"));

  itemRows().forEach((row) => {
    const kocherUsd = fieldNumberValue(row, "usd");
    const qty = fieldNumberValue(row, "qty");
    const hgcUsd = hgcPriceUsd(kocherUsd);

    const hgcEl = row.querySelector('[data-field="hgc"]');
    const totalEl = row.querySelector('[data-field="total"]');

    if (hgcEl) {
      hgcEl.textContent = kocherUsd > 0 ? `USD ${usd.format(hgcUsd)}` : "USD 0.00";
    }

    if (totalEl) {
      totalEl.textContent = kocherUsd > 0 && qty > 0 ? usd.format(hgcUsd * qty) : "USD 0.00";
    }
  });

  renderRows(sectionData);
};

// =====================================================
// GUARDAR / ACTUALIZAR COTIZACIÓN
// =====================================================
const saveQuote = async (isUpdate = false) => {
  if (form.elements.billTo) {
    form.elements.billTo.style.borderColor = "";
    form.elements.billTo.style.borderWidth = "";
  }

  if (form.elements.date) {
    form.elements.date.style.borderColor = "";
    form.elements.date.style.borderWidth = "";
  }

  if (form.elements.poHuella) {
    form.elements.poHuella.value = poHuellaCode();
  }

  const payload = buildQuoteData();

  if (!payload.billTo || !payload.date) {
    if (saveStatus) {
      saveStatus.style.color = "#e53e3e";
      saveStatus.textContent = "Ingrese cliente y fecha para generar el PO Huella.";
    }
    if (!payload.billTo && form.elements.billTo) {
      form.elements.billTo.style.borderColor = "#e53e3e";
      form.elements.billTo.style.borderWidth = "2px";
    }
    if (!payload.date && form.elements.date) {
      form.elements.date.style.borderColor = "#e53e3e";
      form.elements.date.style.borderWidth = "2px";
    }
    return;
  }

  if (!payload.items.length) {
    if (saveStatus) {
      saveStatus.style.color = "#e53e3e";
      saveStatus.textContent = "Agregue al menos un tipo de troquel con su cantidad y precio";
    }
    return;
  }

  if (saveStatus) {
    saveStatus.style.color = "#004597";
    saveStatus.textContent = isUpdate ? "Actualizando..." : "Guardando...";
  }

  try {
    const response = await fetch("api/guardar_cotizacion.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo guardar la cotización.");
    }

    cotizacionActualId = data.id;

    const inicialesCliente = String(payload.inicialesCliente || "").toUpperCase();
    const consecutivoCliente = String(payload.consecutivoCliente || "").padStart(3, "0");
    const numCotizacion = String(data.id).padStart(3, "0");
    const poFinal = inicialesCliente + consecutivoCliente + numCotizacion;

    if (poHuellaInput) {
      poHuellaInput.value = poFinal;
    }

    setText("previewPoHuella", poFinal);

    if (saveStatus) {
      saveStatus.style.color = "#004597";
      const accionText = isUpdate ? "Cotización actualizada" : "Cotización guardada";
      saveStatus.textContent = `${accionText} #${data.id}. PO: ${poFinal}`;
    }

    const quoteActions = document.querySelector("#quoteActions");
    if (quoteActions) {
      quoteActions.style.display = "flex";
    }

  } catch (error) {
    console.error("ERROR AL GUARDAR:", error);
    if (saveStatus) {
      saveStatus.style.color = "#e53e3e";
      saveStatus.textContent = "Error al procesar la cotización: " + error.message;
    }
  }
};

// =====================================================
// SECCIONES DE COTIZACIÓN
// =====================================================
const quoteSection = (key, items, totals) => {
  const plan = planDefaults[key];
  const freightAndHandling = totals.freightTotal + totals.handlingTotal;

  const mensajeCromo =
    key === "chrome"
      ? `
        <tr class="cromo-nota">
          <td colspan="4">
            De ser aprobada la calidad cromo son 6 días para fabricación; después de ingresado pedido puede tardar máximo 12 días en la entrega.
          </td>
        </tr>
      `
      : "";

  if (!items.length) {
    return `
      <tr class="section-row" style="display: none;"><td colspan="4"></td></tr>
      <tr style="display: none;"><td colspan="4"></td></tr>
      <tr style="display: none;"><td colspan="4"></td></tr>
      <tr style="display: none;"><td colspan="4"></td></tr>
      <tr style="display: none;"><td colspan="4"></td></tr>
    `;
  }

  const productRows = items
    .map(
      (item) => `
        <tr>
          <td>${item.qty}</td>
          <td>${item.product}</td>
          <td>USD ${usd.format(item.hgcUsd)}</td>
          <td>USD ${usd.format(item.totalUsd)}</td>
        </tr>
      `
    )
    .join("");

  const pais = form.elements.country ? form.elements.country.value : "COLOMBIA";
  const esColombia = pais === "COLOMBIA";

  const totalsRows = `
    <tr>
      <td></td>
      <td>Flete y Manejo</td>
      <td></td>
      <td>USD ${usd.format(freightAndHandling)}</td>
    </tr>
    <tr>
      <td></td>
      <td><strong>Subtotal</strong></td>
      <td></td>
      <td><strong>USD ${usd.format(totals.subtotal)}</strong></td>
    </tr>
   ${
     esColombia
       ? `
      <tr>
        <td></td>
        <td><strong>IVA</strong></td>
        <td></td>
        <td><strong>USD ${usd.format(totals.taxTotal)}</strong></td>
      </tr>
    `
       : ""
   }
    <tr>
      <td></td>
      <td><strong>Total aprox.</strong></td>
      <td></td>
      <td><strong>USD ${usd.format(totals.total)}</strong></td>
    </tr>
  `;

  return `
    <tr class="section-row">
      <td colspan="4" style="text-align: left; padding-left: 10px; font-weight: bold; background-color: #f4f6f9;">
        ${plan.sectionTitle}
      </td>
    </tr>
    ${productRows}
    ${totalsRows}
    ${mensajeCromo}
  `;
};

const renderRows = (sectionData) => {
  const sectionByKey = Object.fromEntries(
    sectionData.map((section) => [section.key, section])
  );

  quoteRows.innerHTML = `
    ${quoteSection("standard", sectionByKey.standard.items, sectionByKey.standard.totals)}
    ${quoteSection("extended", sectionByKey.extended.items, sectionByKey.extended.totals)}
    ${quoteSection("chrome", sectionByKey.chrome.items, sectionByKey.chrome.totals)}
  `;
};

// =====================================================
// FECHA
// =====================================================
const setInitialDate = () => {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");

  if (form.elements.date) {
    form.elements.date.value = `${yyyy}-${mm}-${dd}`;
  }
};

// =====================================================
// BÚSQUEDA DE CLIENTES
// =====================================================
const billToInput = document.getElementById("billTo");
const clientResults = document.getElementById("clientResults");
const poHuellaInput = document.getElementById("poHuella");

let clientSearchTimeout = null;

if (billToInput && clientResults) {
  billToInput.addEventListener("input", () => {
    if (form.elements.deliverTo) {
      form.elements.deliverTo.value = billToInput.value;
    }

    clearTimeout(clientSearchTimeout);

    const texto = billToInput.value.trim();

    if (texto.length < 2) {
      clientResults.innerHTML = "";
      clientResults.style.display = "none";

      if (poHuellaInput) poHuellaInput.value = "";

      delete form.dataset.inicialesCliente;
      delete form.dataset.consecutivoCliente;

      calculate();
      return;
    }

    clientSearchTimeout = setTimeout(() => {
      buscarClientes(texto);
    }, 250);
  });
}

async function buscarClientes(texto) {
  try {
    const response = await fetch("api/clientes.php?q=" + encodeURIComponent(texto));
    if (!response.ok) throw new Error("Error consultando clientes");
    const clientes = await response.json();
    mostrarResultadosClientes(clientes);
  } catch (error) {
    console.error("Error buscando clientes:", error);
    clientResults.innerHTML = "";
    clientResults.style.display = "none";
  }
}

function mostrarResultadosClientes(clientes) {
  clientResults.innerHTML = "";

  if (!clientes.length) {
    clientResults.innerHTML = `<div class="client-no-results">No se encontraron clientes</div>`;
    clientResults.style.display = "block";
    return;
  }

  clientes.forEach((cliente) => {
    const opcion = document.createElement("div");
    opcion.className = "client-result";
    opcion.innerHTML = `<strong>${escapeHtml(cliente.cliente)}</strong>`;

    opcion.addEventListener("click", () => {
      seleccionarCliente(cliente);
    });

    clientResults.appendChild(opcion);
  });

  clientResults.style.display = "block";
}

function seleccionarCliente(cliente) {
  billToInput.value = cliente.cliente;

  if (form.elements.deliverTo) {
    form.elements.deliverTo.value = cliente.cliente;
  }

  const consecutivo = String(cliente.consecutivo).padStart(3, "0");

  form.dataset.inicialesCliente = String(cliente.iniciales).toUpperCase();
  form.dataset.consecutivoCliente = consecutivo;

  const po = form.dataset.inicialesCliente + form.dataset.consecutivoCliente;

  if (poHuellaInput) {
    poHuellaInput.value = po;
  }

  clientResults.innerHTML = "";
  clientResults.style.display = "none";

  setText("previewBillTo", cliente.cliente);
  setText("previewPoHuella", po);

  calculate();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const actualizarConfiguracionPais = () => {
  const pais = form.elements.country ? form.elements.country.value : "COLOMBIA";
  const config = freightConfig[pais];

  if (config && form.elements.taxRate) {
    form.elements.taxRate.value = config.iva;
  }

  if (companyHeader) {
    companyHeader.innerHTML = pais === "COLOMBIA" ? colombiaHeader : corporationHeader;
  }

  calculate();
};

// =====================================================
// EVENTOS Y LISTENERS
// =====================================================
form.addEventListener("input", calculate);

const addItemButton = document.querySelector("#addItemButton");
if (addItemButton) {
  addItemButton.addEventListener("click", () => {
    addItemRow();
    calculate();
  });
}

// =====================================================
// LIMPIAR FORMULARIO PARA NUEVA COTIZACIÓN
// =====================================================

const limpiarFormularioNuevaCotizacion = () => {

  // Eliminar filas adicionales
  itemsList
    .querySelectorAll(".quote-item:not([data-initial])")
    .forEach((row) => row.remove());

  // Reiniciar contador de ítems
  itemCounter = 3;

  // Limpiar formulario
  form.reset();

  // Limpiar datos del cliente
  delete form.dataset.inicialesCliente;
  delete form.dataset.consecutivoCliente;

  // MUY IMPORTANTE:
  // Ya no estamos trabajando con la cotización anterior
  cotizacionActualId = null;

  // Restaurar fecha
  setInitialDate();

  // Recalcular
  calculate();

  console.log(
    "Formulario limpiado. Listo para una nueva cotización."
  );
};

// =====================================================
// OCULTAR BOTONES DE COTIZACIÓN GUARDADA
// =====================================================

function ocultarBotonesCotizacion() {

  const printButton = document.querySelector("#printQuoteButton");
  const updateButton = document.querySelector("#updateQuoteButton");

  if (printButton) {
    printButton.style.display = "none";
  }

  if (updateButton) {
    updateButton.style.display = "none";
  }

}

const resetButton = document.querySelector("#resetButton");

if (resetButton) {

  resetButton.addEventListener("click", () => {

    limpiarFormularioNuevaCotizacion();

  });

}

if (form.elements.country) {
  form.elements.country.addEventListener("change", actualizarConfiguracionPais);
}

const saveQuoteButton = document.querySelector("#saveQuoteButton");
if (saveQuoteButton) {
  saveQuoteButton.addEventListener("click", () => saveQuote(false));
}

/*const printQuoteButton = document.querySelector("#printQuoteButton");
if (printQuoteButton) {
  printQuoteButton.addEventListener("click", () => {
    if (!cotizacionActualId) {
      alert("Primero debes guardar la cotización.");
      return;
    }
    window.open(`api/imprimir_cotizacion.php?id=${cotizacionActualId}`, "_blank");
  });
}*/

const printQuoteButton = document.querySelector("#printQuoteButton");

if (printQuoteButton) {

  printQuoteButton.addEventListener("click", () => {

    if (!cotizacionActualId) {
      alert("Primero debes guardar la cotización.");
      return;
    }

    // ==========================================
    // IMPRIMIR COTIZACIÓN
    // ==========================================

    window.open(
      `api/imprimir_cotizacion.php?id=${cotizacionActualId}`,
      "_blank"
    );

    // ==========================================
    // LIMPIAR FORMULARIO
    // ==========================================

    limpiarFormularioNuevaCotizacion();
    ocultarBotonesCotizacion();

  });

}
// =====================================================
// MODAL DE ACTUALIZACIÓN DE COTIZACIÓN (Manejo Seguro)
// =====================================================

// Helper seguro para asignar valores sin romper el script si el ID no existe
const setValIfExist = (selector, val) => {
  const el = document.querySelector(selector);
  if (el) el.value = val ?? "";
};

// Carga todos los campos (Encabezado e Ítems) dentro del modal
const cargarFormularioCompletoEnModal = () => {
  const getVal = (selector) => document.querySelector(selector)?.value || "";
  
// 1. Mapear cabecera al modal
setValIfExist(
  "#modal_pais",
  form.elements.country?.value || ""
);

setValIfExist(
  "#modal_cliente",
  form.elements.billTo?.value || ""
);

setValIfExist(
  "#modal_entregar",
  form.elements.deliverTo?.value || ""
);

setValIfExist(
  "#modal_po",
  form.elements.poHuella?.value || ""
);

setValIfExist(
  "#modal_att",
  form.elements.att?.value || ""
);

setValIfExist(
  "#modal_fecha",
  form.elements.date?.value || ""
);

setValIfExist(
  "#modal_tiempo_entrega",
  form.elements.deliveryTime?.value || ""
);

setValIfExist(
  "#modal_agente",
  form.elements.agent?.value || "FEDEX"
);

setValIfExist(
  "#modal_trm",
  form.elements.trm?.value || ""
);

setValIfExist(
  "#modal_iva",
  form.elements.taxRate?.value || ""
);

  // 2. Cargar Ítems
  const container = document.querySelector("#modalItemsContainer");
  if (!container) return;
  container.innerHTML = "";

  const rows = document.querySelectorAll("#itemsList .quote-item");

  const headerRow = document.createElement("div");
  headerRow.style.cssText = "display: grid; grid-template-columns: 2fr 1fr 3fr 1.5fr; gap: 10px; margin-bottom: 8px; font-weight: bold; font-size: 11px; color: #044597; text-transform: uppercase;";
  headerRow.innerHTML = `
    <div>Tipo</div>
    <div>Cantidad</div>
    <div>Producto</div>
    <div>USD Kocher</div>
  `;
  container.appendChild(headerRow);

  const inputStyle = "width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box; outline: none; color: #333;";

  rows.forEach((row) => {
    const typeSelect = row.querySelector('[data-field="type"]');
    const qtyInput = row.querySelector('[data-field="qty"]');
    const productInput = row.querySelector('[data-field="product"]');
    const usdInput = row.querySelector('[data-field="usd"]');

    const type = typeSelect ? typeSelect.value : "";
    const qty = qtyInput ? qtyInput.value : 1;
    const product = productInput ? productInput.value : "";
    const usdVal = usdInput ? usdInput.value : "";

    const itemRow = document.createElement("div");
    itemRow.className = "modal-item-row";
    itemRow.style.cssText = "display: grid; grid-template-columns: 2fr 1fr 3fr 1.5fr; gap: 10px; margin-bottom: 10px; align-items: center;";
    itemRow.innerHTML = `
      <div>
        <select class="modal-type" style="${inputStyle}">
          <option value="" ${type === '' ? 'selected' : ''}>Seleccione...</option>
          <option value="standard" ${type === 'standard' ? 'selected' : ''}>Universal</option>
          <option value="extended" ${type === 'extended' ? 'selected' : ''}>3L vida extendida</option>
          <option value="chrome" ${type === 'chrome' ? 'selected' : ''}>Cromo</option>
        </select>
      </div>
      <div>
        <input type="number" class="modal-qty" value="${qty}" min="0" style="${inputStyle}">
      </div>
      <div>
        <input type="text" class="modal-product" value="${product}" placeholder="Descripción" style="${inputStyle}">
      </div>
      <div>
        <input type="number" class="modal-usd" value="${usdVal}" min="0" step="0.01" placeholder="0.00" style="${inputStyle}">
      </div>
    `;
    container.appendChild(itemRow);
  });
};

// Pasa la información editada en el modal de vuelta al formulario principal
const sincronizarModalAFormulario = () => {
  const getModalVal = (selector) => document.querySelector(selector)?.value || "";

  setValIfExist("#pais", getModalVal("#modal_pais"));
  setValIfExist("#cliente", getModalVal("#modal_cliente"));
  setValIfExist("#entregar_en", getModalVal("#modal_entregar"));
  setValIfExist("#po", getModalVal("#modal_po"));
  setValIfExist("#att", getModalVal("#modal_att"));
  setValIfExist("#fecha", getModalVal("#modal_fecha"));
  setValIfExist("#tiempo_entrega", getModalVal("#modal_tiempo_entrega"));
  setValIfExist("#agente", getModalVal("#modal_agente"));
  setValIfExist("#trm", getModalVal("#modal_trm"));
  setValIfExist("#iva", getModalVal("#modal_iva"));

  // Sincronizar ítems
  const rows = document.querySelectorAll("#itemsList .quote-item");
  const modalRows = document.querySelectorAll("#modalItemsContainer .modal-item-row");

  modalRows.forEach((itemRow, index) => {
    if (rows[index]) {
      const typeVal = itemRow.querySelector(".modal-type")?.value || "";
      const qtyVal = itemRow.querySelector(".modal-qty")?.value || 0;
      const prodVal = itemRow.querySelector(".modal-product")?.value || "";
      const usdVal = itemRow.querySelector(".modal-usd")?.value || 0;

      const mainType = rows[index].querySelector('[data-field="type"]');
      const mainQty = rows[index].querySelector('[data-field="qty"]');
      const mainProd = rows[index].querySelector('[data-field="product"]');
      const mainUsd = rows[index].querySelector('[data-field="usd"]');

      if (mainType) mainType.value = typeVal;
      if (mainQty) mainQty.value = qtyVal;
      if (mainProd) mainProd.value = prodVal;
      if (mainUsd) mainUsd.value = usdVal;
    }
  });

  if (typeof calculate === "function") calculate();
};

// =====================================================
// ABRIR MODAL DE ACTUALIZACIÓN
// =====================================================

const updateQuoteBtn =
  document.querySelector("#updateQuoteButton");

const updateModal =
  document.querySelector("#updateModal");

if (updateQuoteBtn && updateModal) {

  updateQuoteBtn.addEventListener("click", () => {

    try {

      cargarFormularioCompletoEnModal();

      updateModal.style.display = "flex";

    } catch (error) {

      console.error(
        "Error al cargar el modal de actualización:",
        error
      );

    }

  });

}

// =====================================================
// ACTUALIZAR COTIZACIÓN EXISTENTE
// =====================================================

const updateQuote = async () => {

  // Verificar que exista una cotización seleccionada
  if (!cotizacionActualId) {

    alert(
      "No hay una cotización seleccionada para actualizar."
    );

    return;
  }

  try {

    // =====================================================
    // SINCRONIZAR DATOS DEL MODAL CON EL FORMULARIO
    // =====================================================

    sincronizarModalAFormulario();

    // =====================================================
    // CONSTRUIR DATOS
    // =====================================================

    const payload = buildQuoteData();

    // Asegurarnos de enviar el ID existente
    payload.id = cotizacionActualId;

    console.log(
      "Actualizando cotización:",
      payload
    );

    // =====================================================
    // ESTADO
    // =====================================================

    if (saveStatus) {

      saveStatus.style.color =
        "#044597";

      saveStatus.textContent =
        "Actualizando cotización...";
    }

    // =====================================================
    // ENVIAR AL PHP
    // =====================================================

    const response =
      await fetch(
        "api/guardar_cotizacion.php",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );

    // =====================================================
    // LEER RESPUESTA
    // =====================================================

    const data =
      await response.json();

    console.log(
      "Respuesta actualización:",
      data
    );

    // =====================================================
    // VALIDAR RESPUESTA
    // =====================================================

    if (!response.ok || !data.ok) {

      throw new Error(
        data.error ||
        "No se pudo actualizar la cotización."
      );
    }

    // =====================================================
    // MANTENER EL ID ACTUAL
    // =====================================================

    cotizacionActualId =
      Number(data.id);

    // =====================================================
    // CERRAR MODAL
    // =====================================================

    if (updateModal) {

      updateModal.style.display =
        "none";
    }

// =====================================================
// MENSAJE
// =====================================================

if (saveStatus) {

  saveStatus.style.color =
    "#198754";

  saveStatus.textContent =
    `Cotización #${data.id} actualizada correctamente.`;
}

// ==========================================
// IMPRIMIR COTIZACIÓN ACTUALIZADA
// ==========================================

window.open(
  `api/imprimir_cotizacion.php?id=${data.id}`,
  "_blank"
);

// =====================================================
// LIMPIAR FORMULARIO DESPUÉS DE ACTUALIZAR
// =====================================================

form.reset();

itemsList
  .querySelectorAll(".quote-item:not([data-initial])")
  .forEach((row) => row.remove());

itemCounter = 3;

delete form.dataset.inicialesCliente;
delete form.dataset.consecutivoCliente;

cotizacionActualId = null;

setInitialDate();
calculate();



// =====================================================
// CONFIRMACIÓN EN CONSOLA
// =====================================================

console.log(
  "Cotización actualizada correctamente:",
  data.id
);

} catch (error) {

  console.error(
    "ERROR AL ACTUALIZAR:",
    error
  );

  if (saveStatus) {

    saveStatus.style.color =
      "#e53e3e";

    saveStatus.textContent =
      "Error al actualizar la cotización: " +
      error.message;
  }

} 
};



// =====================================================
// CONFIRMAR ACTUALIZACIÓN
// =====================================================

const btnConfirmUpdate =
  document.querySelector("#btnConfirmUpdate");

if (btnConfirmUpdate) {

  btnConfirmUpdate.addEventListener(
    "click",
    updateQuote
  );

}

// =====================================================
// CERRAR MODAL
// =====================================================

const btnCloseModal =
  document.querySelector("#btnCloseModal");

if (btnCloseModal) {

  btnCloseModal.addEventListener(
    "click",
    () => {

      updateModal.style.display = "none";

    }
  );

}

// =====================================================
// INICIALIZACIÓN
// =====================================================
setInitialDate();
calculate();