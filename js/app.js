const form = document.querySelector("#quoteForm");
const quoteRows = document.querySelector("#quoteRows");
const itemsList = document.querySelector("#itemsList");
const saveStatus = document.querySelector("#saveStatus");
const companyHeader =
  document.querySelector("#companyHeader");

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

  const pais =
    form.elements.country
      ? form.elements.country.value
      : "COLOMBIA";

  const config =
    freightConfig[pais];

  if (!config || quantity <= 0) {
    return 0;
  }

  const bloques =
    Math.ceil(quantity / config.rango);

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

    return (
      minOk &&
      kocherUnitTotal <= item.max
    );
  });

  return range ? range.usd : 0;
};

const fedexHandlingUsd = (kocherUnitTotal) => {

  const range = fedexHandlingRanges.find(
    (item) =>
      kocherUnitTotal >= item.min &&
      kocherUnitTotal <= item.max
  );

  return range
    ? range.cop / fedexTrmBase
    : fedexHandlingRanges.at(-1).cop / fedexTrmBase;
};

const handlingUsd = (
  agent,
  kocherUnitTotal,
  fuelKocherTotal
) => {

  const pais =
    form.elements.country
      ? form.elements.country.value
      : "COLOMBIA";

  const config =
    freightConfig[pais];

  if (!config?.manejo) {
    return 0;
  }

  const base =
    agent === "DHL"
      ? dhlHandlingUsd(kocherUnitTotal)
      : fedexHandlingUsd(kocherUnitTotal);

  const fuel =
    fuelKocherTotal >= 200
      ? fedexFuelUsd
      : 0;

  return base + fuel;

};  

const setText = (id, value) => {

  const element =
    document.querySelector(`#${id}`);

  if (element) {
    element.textContent = value;
  }
};

const fieldValue = (row, field) => {

  const element =
    row.querySelector(
      `[data-field="${field}"]`
    );

  return element
    ? element.value
    : "";
};

const fieldNumberValue = (row, field) => {

  const value =
    Number(fieldValue(row, field));

  return Number.isFinite(value)
    ? value
    : 0;
};

const itemRows = () => {

  return [
    ...itemsList.querySelectorAll(
      ".quote-item"
    )
  ];
};

const itemData = () => {

  return itemRows().map((row) => {

    const kocherUsd =
      fieldNumberValue(row, "usd");

    const hgcUsd =
      hgcPriceUsd(kocherUsd);

    const qty =
      fieldNumberValue(row, "qty");

    return {
  type: fieldValue(row, "type"),

  typeLabel:
    row.querySelector('[data-field="type"]')
      .options[
        row.querySelector('[data-field="type"]')
          .selectedIndex
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

    <select
      name="type${index}"
      data-field="type"
      aria-label="Tipo de troquel ${index}"
    >
      <option value="">Seleccione...</option>
      <option value="standard">Universal</option>
      <option value="extended">3L vida extendida</option>
      <option value="chrome">Cromo</option>
    </select>

    <input
      name="qty${index}"
      data-field="qty"
      type="number"
      min="0"
      step="1"
      value="1"
      aria-label="Cantidad item ${index}"
    >

    <input
      name="product${index}"
      data-field="product"
      aria-label="Producto item ${index}"
    >

    <input
      name="usd${index}"
      data-field="usd"
      type="number"
      min="0"
      step="0.01"
      aria-label="USD Kocher item ${index}"
    >

    <output data-field="hgc">
      USD 0.00
    </output>

    <output data-field="total">
      USD 0.00
    </output>

  </div>
`;

const addItemRow = () => {

  itemCounter += 1;

  itemsList.insertAdjacentHTML(
    "beforeend",
    itemRowTemplate(itemCounter)
  );
};

const getQuoteTrm = () => {

  return numberValue("trm");
};

const sectionTotals = (
  items,
  fuelKocherTotal
) => {

  const totalQuantity =
    items.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );

  const productsTotal =
    items.reduce(
      (sum, item) =>
        sum + item.totalUsd,
      0
    );

  const kocherUnitTotal =
    items.reduce(
      (sum, item) =>
        sum + item.kocherUsd,
      0
    );

  const freightTotal =
    items.length
      ? freightUsd(totalQuantity)
      : 0;

  const agentValue =
    form.elements.agent
      ? form.elements.agent.value
      : "FEDEX";

  const handlingTotal =
    items.length
      ? handlingUsd(
          agentValue,
          kocherUnitTotal,
          fuelKocherTotal
        )
      : 0;

  const subtotal =
    productsTotal +
    freightTotal +
    handlingTotal;

  const taxTotal =
    productsTotal *
    (numberValue("taxRate") / 100);

  const total =
    subtotal + taxTotal;

  return {
    productsTotal,
    freightTotal,
    handlingTotal,
    subtotal,
    taxTotal,
    total,
  };
};

const buildQuoteData = () => {

  const allItems =
    itemData();

  const validItems =
    allItems.filter(
      (item) =>
        item.type &&
        item.qty > 0 &&
        item.hgcUsd > 0
    );

  const sectionItems =
    Object.keys(planDefaults).map(
      (key) => ({
        key,
        label:
          planDefaults[key].label,
        sectionTitle:
          planDefaults[key].sectionTitle,
        items:
          validItems.filter(
            (item) =>
              item.type === key
          ),
      })
    );

  const kocherTotals =
    Object.fromEntries(
      sectionItems.map(
        (section) => [
          section.key,
          section.items.reduce(
            (sum, item) =>
              sum +
              item.kocherUsd *
              item.qty,
            0
          ),
        ]
      )
    );

  const sections =
    sectionItems.map(
      (section) => {

        const fuelKocherTotal =
          section.key === "chrome"
            ? (
                kocherTotals.extended ||
                0
              )
            : (
                kocherTotals[
                  section.key
                ] || 0
              );

        return {
          ...section,

          totals:
            sectionTotals(
              section.items,
              fuelKocherTotal
            ),
        };
      }
    );

  const totals = {

    productsTotal:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.productsTotal,
        0
      ),

    freightTotal:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.freightTotal,
        0
      ),

    handlingTotal:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.handlingTotal,
        0
      ),

    subtotal:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.subtotal,
        0
      ),

    taxTotal:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.taxTotal,
        0
      ),

    total:
      sections.reduce(
        (sum, section) =>
          sum +
          section.totals.total,
        0
      ),
  };

  return {

    country:
      form.elements.country
        ? form.elements.country.value
        : "",

    billTo:
      textValue("billTo"),

    deliverTo:
      textValue("deliverTo"),

    po:
      textValue("po"),

    poHuella:
      textValue("poHuella"),

    // ========================================
    // DATOS DEL CLIENTE PARA EL PO
    // ========================================

    inicialesCliente:
      form.dataset.inicialesCliente || "",

    consecutivoCliente:
      form.dataset.consecutivoCliente || "",

    date:
      form.elements.date
        ? form.elements.date.value
        : "",

    deliveryTime:
      textValue("deliveryTime"),

    agent:
      form.elements.agent
        ? form.elements.agent.value
        : "FEDEX",

    trmToday:
      numberValue("trmToday"),

    trmAdjustment:
      numberValue("trmAdjustment"),

    quoteTrm:
      getQuoteTrm(),

    taxRate:
      numberValue("taxRate"),

    items:
      validItems,

    sections,

    totals,
  };
};

const calculate = () => {

  if (form.elements.poHuella) {

    form.elements.poHuella.value =
      poHuellaCode();
  }

  const quoteTrm =
    getQuoteTrm();

  const quoteData =
    buildQuoteData();

  const {
    sections: sectionData,
    totals
  } = quoteData;

  const selectedLabels =
    sectionData
      .filter(
        (section) =>
          section.items.length
      )
      .map(
        (section) =>
          planDefaults[
            section.key
          ].label
      );

  setText(
    "grandTotal",
    usd.format(totals.total)
  );

  setText(
    "selectedPlan",
    selectedLabels.length
      ? selectedLabels.join(" + ")
      : "Seleccione tipo de troquel"
  );

  setText(
    "quoteTrm",
    quoteTrm.toLocaleString(
      "es-CO",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  );

  setText(
    "productsTotal",
    usd.format(
      totals.productsTotal
    )
  );

  setText(
    "freightTotal",
    usd.format(
      totals.freightTotal
    )
  );

  setText(
    "handlingTotal",
    usd.format(
      totals.handlingTotal
    )
  );

  setText(
    "subtotal",
    usd.format(
      totals.subtotal
    )
  );

  setText(
    "taxTotal",
    usd.format(
      totals.taxTotal
    )
  );

  setText(
    "total",
    usd.format(
      totals.total
    )
  );

  setText(
    "previewBillTo",
    textValue("billTo")
  );

  setText(
    "previewDeliverTo",
    textValue("deliverTo")
  );

  setText(
    "previewPo",
    textValue("po")
  );

  setText(
    "previewPoHuella",
    textValue("poHuella")
  );

  setText(
    "previewDate",
    form.elements.date
      ? form.elements.date.value
      : ""
  );

  setText(
    "previewDelivery",
    textValue("deliveryTime")
  );

  itemRows().forEach(
    (row) => {

      const kocherUsd =
        fieldNumberValue(
          row,
          "usd"
        );

      const qty =
        fieldNumberValue(
          row,
          "qty"
        );

      const hgcUsd =
        hgcPriceUsd(
          kocherUsd
        );

      const hgcEl =
        row.querySelector(
          '[data-field="hgc"]'
        );

      const totalEl =
        row.querySelector(
          '[data-field="total"]'
        );

      if (hgcEl) {

        hgcEl.textContent =
          kocherUsd > 0
            ? `USD ${usd.format(hgcUsd)}`
            : "USD 0.00";
      }

      if (totalEl) {

        totalEl.textContent =
          kocherUsd > 0 &&
          qty > 0
            ? usd.format(
                hgcUsd * qty
              )
            : "USD 0.00";
      }
    }
  );

  renderRows(
    sectionData
  );
};


// =====================================================
// GUARDAR COTIZACIÓN
// =====================================================

const saveQuote = async () => {

  // Limpiar validaciones anteriores

  if (form.elements.billTo) {

    form.elements.billTo.style.borderColor = "";
    form.elements.billTo.style.borderWidth = "";
  }

  if (form.elements.date) {

    form.elements.date.style.borderColor = "";
    form.elements.date.style.borderWidth = "";
  }

  if (form.elements.poHuella) {

    form.elements.poHuella.value =
      poHuellaCode();
  }

  const payload =
    buildQuoteData();


  // =====================================================
  // VALIDAR CLIENTE Y FECHA
  // =====================================================

  if (
    !payload.billTo ||
    !payload.date
  ) {

    if (saveStatus) {

      saveStatus.style.color =
        "#e53e3e";

      saveStatus.textContent =
        "Ingrese cliente y fecha para generar el PO Huella.";
    }

    if (
      !payload.billTo &&
      form.elements.billTo
    ) {

      form.elements.billTo.style.borderColor =
        "#e53e3e";

      form.elements.billTo.style.borderWidth =
        "2px";
    }

    if (
      !payload.date &&
      form.elements.date
    ) {

      form.elements.date.style.borderColor =
        "#e53e3e";

      form.elements.date.style.borderWidth =
        "2px";
    }

    return;
  }


  // =====================================================
  // VALIDAR ITEMS
  // =====================================================

  if (!payload.items.length) {

    if (saveStatus) {

      saveStatus.style.color =
        "#e53e3e";

      saveStatus.textContent =
        "Agregue al menos un tipo de troquel con su cantidad y precio";
    }

    return;
  }


  // =====================================================
  // ESTADO GUARDANDO
  // =====================================================

  if (saveStatus) {

    saveStatus.style.color =
      "#004597";

    saveStatus.textContent =
      "Guardando...";
  }


  try {

    // =====================================================
    // GUARDAR EN PHP
    // =====================================================

    const response =
      await fetch(
    "api/guardar_cotizacion.php",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }
);


    // =====================================================
    // LEER RESPUESTA
    // =====================================================

    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "No se pudo guardar la cotizacion."
      );
    }


    // =====================================================
    // CONSTRUIR PO FINAL
    // =====================================================

    const inicialesCliente =
      String(
        payload.inicialesCliente ||
        ""
      ).toUpperCase();

    const consecutivoCliente =
      String(
        payload.consecutivoCliente ||
        ""
      ).padStart(3, "0");

    const numCotizacion =
      String(
        data.id
      ).padStart(3, "0");


    const poFinal =
      inicialesCliente +
      consecutivoCliente +
      numCotizacion;


    // =====================================================
    // COLOCAR PO COMPLETO
    // =====================================================

    if (poHuellaInput) {

      poHuellaInput.value =
        poFinal;
    }


    // =====================================================
    // ACTUALIZAR PREVISUALIZACIÓN
    // =====================================================

    setText(
      "previewPoHuella",
      poFinal
    );


    // =====================================================
    // MENSAJE DE GUARDADO
    // =====================================================

    if (saveStatus) {

      saveStatus.style.color =
        "#004597";

      saveStatus.textContent =
        `Cotizacion guardada #${data.id}. PO: ${poFinal}`;
    }


    // =====================================================
    // IMPRIMIR
    // =====================================================

    console.log(data);
    console.log(data.id);

    window.open(
    `api/imprimir_cotizacion.php?id=${data.id}`,
    "_blank"
);


    // =====================================================
    // LIMPIAR FORMULARIO
    // =====================================================

    setTimeout(
      () => {

        if (
          typeof itemsList !==
          "undefined" &&
          itemsList
        ) {

          itemsList
            .querySelectorAll(
              ".quote-item:not([data-initial])"
            )
            .forEach(
              (row) =>
                row.remove()
            );
        }


        itemCounter = 3;


        form.reset();


        // Fecha actual

        setInitialDate();


        // Limpiar datos internos
        // del cliente seleccionado

        delete form.dataset.inicialesCliente;
        delete form.dataset.consecutivoCliente;


        if (form.elements.poHuella) {

          form.elements.poHuella.value =
            "";
        }


        calculate();


        console.log(
          "Formulario impreso, limpiado y fecha reestablecida automáticamente."
        );

      },
      400
    );

  } catch (error) {

    console.error(
      "ERROR AL GUARDAR:",
      error
    );

    if (saveStatus) {

      saveStatus.style.color =
        "#e53e3e";

      saveStatus.textContent =
        "Error al guardar la cotización: " +
        error.message;
    }
  }
};


// =====================================================
// SECCIONES DE COTIZACIÓN
// =====================================================

const quoteSection = (
  key,
  items,
  totals
) => {

  const plan =
    planDefaults[key];

  const freightAndHandling =
    totals.freightTotal +
    totals.handlingTotal;

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
      <tr
        class="section-row"
        style="display: none;"
      >
        <td colspan="4"></td>
      </tr>

      <tr style="display: none;">
        <td colspan="4"></td>
      </tr>

      <tr style="display: none;">
        <td colspan="4"></td>
      </tr>

      <tr style="display: none;">
        <td colspan="4"></td>
      </tr>

      <tr style="display: none;">
        <td colspan="4"></td>
      </tr>
    `;
  }


  const productRows =
    items
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

const pais =
  form.elements.country
    ? form.elements.country.value
    : "COLOMBIA";

const esColombia =
  pais === "COLOMBIA";


  const totalsRows = `
    <tr>
      <td></td>
      <td>Flete y Manejo</td>
      <td></td>
      <td>
        USD ${usd.format(
          freightAndHandling
        )}
      </td>
    </tr>

    <tr>
      <td></td>
      <td>
        <strong>Subtotal</strong>
      </td>
      <td></td>
      <td>
        <strong>
         USD ${usd.format(
            totals.subtotal
          )}
        </strong>
      </td>
    </tr>

   ${
  esColombia
    ? `
      <tr>
        <td></td>
        <td>
          <strong>IVA</strong>
        </td>
        <td></td>
        <td>
          <strong>
            USD ${usd.format(
              totals.taxTotal
            )}
          </strong>
        </td>
      </tr>
    `
    : ""
  }

    <tr>
      <td></td>
      <td>
        <strong>Total aprox.</strong>
      </td>
      <td></td>
      <td>
        <strong>
          USD ${usd.format(
            totals.total
          )}
        </strong>
      </td>
    </tr>
  `;


  return `
    <tr class="section-row">

      <td
        colspan="4"
        style="
          text-align: left;
          padding-left: 10px;
          font-weight: bold;
          background-color: #f4f6f9;
        "
      >
        ${plan.sectionTitle}
      </td>

    </tr>

    ${productRows}

    ${totalsRows}

    ${mensajeCromo}
  `;
};


const renderRows = (
  sectionData
) => {

  const sectionByKey =
    Object.fromEntries(
      sectionData.map(
        (section) => [
          section.key,
          section
        ]
      )
    );


  quoteRows.innerHTML = `

    ${quoteSection(
      "standard",
      sectionByKey.standard.items,
      sectionByKey.standard.totals
    )}

    ${quoteSection(
      "extended",
      sectionByKey.extended.items,
      sectionByKey.extended.totals
    )}

    ${quoteSection(
      "chrome",
      sectionByKey.chrome.items,
      sectionByKey.chrome.totals
    )}

  `;
};


// =====================================================
// FECHA
// =====================================================

const setInitialDate = () => {

  const ahora =
    new Date();

  const yyyy =
    ahora.getFullYear();

  const mm =
    String(
      ahora.getMonth() + 1
    ).padStart(2, "0");

  const dd =
    String(
      ahora.getDate()
    ).padStart(2, "0");

  if (form.elements.date) {

    form.elements.date.value =
      `${yyyy}-${mm}-${dd}`;
  }
};


// =====================================================
// EVENTOS
// =====================================================

form.addEventListener(
  "input",
  calculate
);


if (form.elements.billTo) {

  form.elements.billTo.addEventListener(
    "input",
    () => {

      if (form.elements.deliverTo) {

        form.elements.deliverTo.value =
          form.elements.billTo.value;
      }
    }
  );
}


document
  .querySelector("#addItemButton")
  .addEventListener(
    "click",
    () => {

      addItemRow();

      calculate();
    }
  );


document
  .querySelector("#saveQuoteButton")
  .addEventListener(
    "click",
    saveQuote
  );


document
  .querySelector("#resetButton")
  .addEventListener(
    "click",
    () => {

      itemsList
        .querySelectorAll(
          ".quote-item:not([data-initial])"
        )
        .forEach(
          (row) =>
            row.remove()
        );

      itemCounter = 3;

      form.reset();

      delete form.dataset.inicialesCliente;
      delete form.dataset.consecutivoCliente;

      setInitialDate();

      calculate();
    }
  );


const printButton =
  document.querySelector("#printButton");

if (printButton) {

  printButton.addEventListener(
    "click",
    () => window.print()
  );

}


// =====================================================
// BÚSQUEDA DE CLIENTES
// =====================================================

const billToInput =
  document.getElementById(
    "billTo"
  );

const clientResults =
  document.getElementById(
    "clientResults"
  );

const poHuellaInput =
  document.getElementById(
    "poHuella"
  );

let clientSearchTimeout =
  null;
let selectedClientIndex = -1;


if (
  billToInput &&
  clientResults
) {

  billToInput.addEventListener(
    "input",
    () => {

      const texto =
        billToInput.value.trim();


      // Entregar en = Cliente

      if (
        form.elements.deliverTo
      ) {

        form.elements.deliverTo.value =
          billToInput.value;
      }


      clearTimeout(
        clientSearchTimeout
      );


      // Si hay menos de 2 caracteres
      // no buscamos

      if (
        texto.length < 2
      ) {

        clientResults.innerHTML =
          "";

        clientResults.style.display =
          "none";


        if (poHuellaInput) {

          poHuellaInput.value =
            "";
        }


        // También limpiamos
        // los datos internos

        delete form.dataset.inicialesCliente;
        delete form.dataset.consecutivoCliente;


        calculate();

        return;
      }


      clientSearchTimeout =
        setTimeout(
          () => {

            buscarClientes(
              texto
            );

          },
          250
        );

    }
  );
}


// =====================================================
// BUSCAR CLIENTES
// =====================================================

async function buscarClientes(
  texto
) {

  try {

    const response =
      await fetch(
        "api/clientes.php?q=" +
        encodeURIComponent(
          texto
        )
      );


    if (!response.ok) {

      throw new Error(
        "Error consultando clientes"
      );
    }


    const clientes =
      await response.json();


    mostrarResultadosClientes(
      clientes
    );

  } catch (error) {

    console.error(
      "Error buscando clientes:",
      error
    );


    clientResults.innerHTML =
      "";

    clientResults.style.display =
      "none";
  }
  
}


// =====================================================
// MOSTRAR RESULTADOS
// =====================================================

function mostrarResultadosClientes(
  clientes
) {

  clientResults.innerHTML =
    "";


  if (!clientes.length) {

    clientResults.innerHTML = `
      <div class="client-no-results">
        No se encontraron clientes
      </div>
    `;

    clientResults.style.display =
      "block";

    return;
  }


  clientes.forEach(
    (cliente) => {

      const opcion =
        document.createElement(
          "div"
        );


      opcion.className =
        "client-result";


      opcion.innerHTML = `
        <strong>
          ${escapeHtml(
            cliente.cliente
          )}
        </strong>
      `;


      opcion.addEventListener(
        "click",
        () => {

          seleccionarCliente(
            cliente
          );

        }
      );


      clientResults.appendChild(
        opcion
      );
    }
  );


  clientResults.style.display =
    "block";
}


// =====================================================
// SELECCIONAR CLIENTE
// =====================================================

function seleccionarCliente(
  cliente
) {

  // Nombre

  billToInput.value =
    cliente.cliente;


  // Entregar en = Cliente

  if (
    form.elements.deliverTo
  ) {

    form.elements.deliverTo.value =
      cliente.cliente;
  }


  // Consecutivo a 3 dígitos

  const consecutivo =
    String(
      cliente.consecutivo
    ).padStart(
      3,
      "0"
    );


  // =====================================================
  // GUARDAR DATOS DEL CLIENTE
  // =====================================================

  form.dataset.inicialesCliente =
    String(
      cliente.iniciales
    ).toUpperCase();


  form.dataset.consecutivoCliente =
    consecutivo;


  // =====================================================
  // PO PRELIMINAR
  // =====================================================

  const po =
    form.dataset.inicialesCliente +
    form.dataset.consecutivoCliente;


  if (poHuellaInput) {

    poHuellaInput.value =
      po;
  }


  // Ocultar resultados

  clientResults.innerHTML =
    "";

  clientResults.style.display =
    "none";


  // Vista previa

  setText(
    "previewBillTo",
    cliente.cliente
  );

  setText(
    "previewPoHuella",
    po
  );


  calculate();
}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escapeHtml(
  text
) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    text;

  return div.innerHTML;
}

const actualizarConfiguracionPais = () => {

  const pais =
    form.elements.country
      ? form.elements.country.value
      : "COLOMBIA";

  const config =
    freightConfig[pais];

  if (
    config &&
    form.elements.taxRate
  ) {
    form.elements.taxRate.value =
      config.iva;
  }

  if (companyHeader) {

    if (pais === "COLOMBIA") {

        companyHeader.innerHTML = colombiaHeader;

    } else {

        companyHeader.innerHTML = corporationHeader;

    }

}

  calculate();

};

if (form.elements.country) {

  form.elements.country.addEventListener(
    "change",
    actualizarConfiguracionPais
  );

}


// =====================================================
// INICIALIZACIÓN
// =====================================================

setInitialDate();

calculate();