    let tabla;
    const quotesRows = document.querySelector("#quotesRows");
    const formatDate = (date) => {if (!date) return "";
        const [yyyy, mm, dd] = date.split("-");

        return `${dd}/${mm}/${yyyy}`;

    };
    const quotesStatus = document.querySelector("#quotesStatus");

    const quoteDetailModal =
        document.querySelector(
            "#quoteDetailModal"
        );

    const quoteModal =
        new bootstrap.Modal(
            document.getElementById(
                "quoteModal"
            )
        );

    const usd = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }


    // =====================================================
    // CARGAR COTIZACIONES
    // =====================================================

    const loadQuotes = async () => {

        quotesStatus.textContent = "Cargando...";

        try {

            const response = await fetch("api/listar_cotizaciones.php");
            const data = await response.json();

            if (!response.ok) {
                quotesStatus.textContent =
                    data.error || "No se pudieron cargar las cotizaciones.";
                return;
            }

            // Si DataTables ya existe, destruirla
            if ($.fn.DataTable.isDataTable("#tablaCotizaciones")) {
                $("#tablaCotizaciones").DataTable().destroy();
            }

            // Limpiar tabla
            quotesRows.innerHTML = "";

            // =================================================
            // GENERAR FILAS
            // =================================================

            data.quotes.forEach((quote) => {

                quotesRows.innerHTML += `
                    <tr>

                        <td class="cotizacion-hg">
                    <strong>
                    #${escapeHtml(quote.id)}
                    </strong>
                    </td>

                        <td>
                            ${formatDate(quote.quote_date)}
                        </td>

                        <td>
                            ${escapeHtml(quote.client)}
                        </td>

                        <td
                        class="po-huella">
                        ${escapeHtml(quote.po_huella)}
                        </span>
                        </td>

                        <td>
                            <strong>
                                USD ${usd.format(quote.total_usd)}
                            </strong>
                        </td>

                        <td class="text-center">

                            <button
                                class="btn btn-outline-primary btn-sm btn-ver-cotizacion"
                                type="button"
                                data-id="${quote.id}"
                                title="Ver detalle">
                                <i class="bi bi-eye"></i>
                                Ver
                            </button>

                            <button
                                class="btn btn-outline-success btn-sm btn-editar-cotizacion"
                                type="button"
                                data-id="${quote.id}"
                                title="Editar cotización">
                                <i class="bi bi-pencil"></i>
                                Editar
                            </button>

                        </td>

                    </tr>
                `;

            });


            // =================================================
            // DATATABLE
            // =================================================

            tabla = $("#tablaCotizaciones").DataTable({
            

                pageLength: 25,

                order: [
                    [0, "asc"]
                ],

                responsive: true,

                dom:
                `rt<'row mt-3'<'col-md-6'l i><'col-md-6'p>>`,

                language: {

                    url:
                        "https://cdn.datatables.net/plug-ins/2.3.3/i18n/es-ES.json",

                    lengthMenu:
                        "Mostrar _MENU_",

                    info:
                        "Mostrando _START_ a _END_"

                }

            });

            document
            .getElementById("buscarCotizacion")
            .addEventListener("keyup", function () {

            tabla.search(this.value).draw();

            });
            

                quotesStatus.textContent =
                data.quotes.length
                    ? ""
                    : "No hay cotizaciones guardadas.";


        } catch (error) {

            console.error(error);

            quotesStatus.textContent =
                "Error cargando las cotizaciones.";

        }

    };


    // =====================================================
    // DETALLE DE COTIZACIÓN
    // =====================================================

    const renderDetail = (quote) => {

        // =================================================
        // PRODUCTOS
        // =================================================

        const itemsHtml = quote.items.length

            ? quote.items.map((item) => `

                <tr>

                    <td class="text-center">
                        <span class="qty-badge">
                            ${escapeHtml(item.qty)}
                        </span>
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(item.product)}
                        </strong>
                    </td>

                    <td>
                        <span class="type-badge">
                            ${escapeHtml(item.typeLabel || item.type)}
                        </span>
                    </td>

                    <td class="text-end">
                        USD ${usd.format(item.hgcUsd)}
                    </td>

                    <td class="text-end fw-semibold">
                        USD ${usd.format(item.totalUsd)}
                    </td>

                </tr>

            `).join("")

            : `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-muted py-4">

                        No hay productos registrados.

                    </td>

                </tr>

            `;


        // =================================================
        // DETALLE COMPLETO
        // =================================================

        quoteDetailModal.innerHTML = `

            <div class="quote-detail-container">


                <!-- ===================================== -->
                <!-- ENCABEZADO -->
                <!-- ===================================== -->

                <div class="detail-main-header">

                    <div>

                        <span class="detail-label">
                            COTIZACIÓN
                        </span>

                        <h2>
                            #${escapeHtml(quote.id)}
                        </h2>

                    </div>


                    <div class="detail-po">

                        <span>
                            PO HUELLA
                        </span>

                        <strong>
                            ${escapeHtml(quote.po)}
                        </strong>

                    </div>

                </div>


                <!-- ===================================== -->
                <!-- INFORMACIÓN GENERAL -->
                <!-- ===================================== -->

                <div class="detail-section">

                    <div class="detail-section-title">

                        <h3>
                            Información general
                        </h3>

                    </div>


                    <div class="detail-info-grid">


                        <div class="info-card">

                            <span>
                                Cliente
                            </span>

                            <strong>
                                ${escapeHtml(quote.cliente)}
                            </strong>

                        </div>


                        <div class="info-card">

                            <span>
                                Entregar en
                            </span>

                            <strong>
                                ${escapeHtml(quote.entregar_en || "-")}
                            </strong>

                        </div>


                        <div class="info-card">

                            <span>
                                ATT
                            </span>

                            <strong>
                                ${escapeHtml(quote.att || "-")}
                            </strong>

                        </div>

                        <div class="info-card">

                            <span>
                                País
                            </span>

                            <strong>
                                ${escapeHtml(
                                    (quote.country || "-")
                                        .replaceAll("_", " ")
                                )}
                            </strong>

                        </div>


                        <div class="info-card">

                            <span>
                                Fecha de Cotización
                            </span>

                            <strong>
                                ${escapeHtml(quote.fecha)}
                            </strong>

                        </div>


                        <div class="info-card">

                            <span>
                                Agente
                            </span>

                            <strong>
                                ${escapeHtml(quote.agente)}
                            </strong>

                        </div>


                        <div class="info-card">

                            <span>
                                Tiempo de entrega
                            </span>

                            <strong>
                                ${escapeHtml(quote.tiempo_entrega || "-")}
                            </strong>

                        </div>


                    </div>

                </div>


                <!-- ===================================== -->
                <!-- CONDICIONES COMERCIALES -->
                <!-- ===================================== -->

                <div class="detail-section">

                    <div class="detail-section-title">

                        <h3>
                            Condiciones comerciales
                        </h3>

                    </div>


                    <div class="commercial-grid">


                        <div>

                            <span>
                                TRM
                            </span>

                            <strong>
                                ${usd.format(quote.trm)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                IVA
                            </span>

                            <strong>
                                ${quote.iva ?? 0}%
                            </strong>

                        </div>

                        <div>

                            <span>
                                Flete
                            </span>

                            <strong>
                                USD ${usd.format(quote.flete)}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Manejo
                            </span>

                            <strong>
                                USD ${usd.format(quote.manejo)}
                            </strong>

                        </div>


                    </div>

                </div>


                <!-- ===================================== -->
                <!-- DETALLE DE PRODUCTOS -->
                <!-- ===================================== -->

                <div class="detail-section">

                    <div class="detail-section-title">

                        <h3>
                            Detalle de la cotización
                        </h3>

                        <span class="items-count">

                            ${quote.items.length}

                            ${quote.items.length === 1
                                ? "producto"
                                : "productos"}

                        </span>

                    </div>


                    <div class="detail-table-wrapper">

                        <table class="detail-table">

                            <thead>

                                <tr>

                                    <th class="text-center">
                                        Cant.
                                    </th>

                                    <th>
                                        Producto
                                    </th>

                                    <th>
                                        Tipo
                                    </th>

                                    <th class="text-end">
                                        Valor unitario
                                    </th>

                                    <th class="text-end">
                                        Total
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${itemsHtml}

                            </tbody>

                        </table>

                    </div>

                </div>


                <!-- ===================================== -->
                <!-- RESUMEN -->
                <!-- ===================================== -->

                <div class="detail-section">

                    <div class="detail-section-title">

                        <h3>
                            Resumen de la cotización
                        </h3>

                    </div>


                    <div class="totals-card">


                        <div class="total-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                USD ${usd.format(quote.subtotal)}
                            </strong>

                        </div>


                        <div class="total-row">

                            <span>
                                Flete
                            </span>

                            <strong>
                                USD ${usd.format(quote.flete)}
                            </strong>

                        </div>


                        <div class="total-row">

                            <span>
                                Manejo
                            </span>

                            <strong>
                                USD ${usd.format(quote.manejo)}
                            </strong>

                        </div>


                        <div class="total-row">

                            <span>
                                Impuesto / IVA
                            </span>

                            <strong>
                                USD ${usd.format(quote.impuesto)}
                            </strong>

                        </div>


                        <div class="total-row total-final">

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                USD ${usd.format(quote.total)}
                            </strong>

                        </div>


                    </div>

                </div>


            </div>

        `;

        const printBtn =
    document.getElementById(
        "printQuoteBtn"
    );

if (printBtn) {

    printBtn.dataset.id =
        quote.id;

}


    quoteModal.show();


    };


    // =====================================================
    // CARGAR DETALLE
    // =====================================================

    const loadQuoteDetail = async (id) => {

        quotesStatus.textContent =
            "Cargando detalle...";

        try {

            const response =
                await fetch(
                    `api/ver_cotizacion.php?id=${encodeURIComponent(id)}`
                );

            const data =
                await response.json();


            if (!response.ok) {

                quotesStatus.textContent =
                    data.error ||
                    "No se pudo cargar el detalle.";

                return;

            }


            quotesStatus.textContent = "";

            renderDetail(data.quote);


        } catch (error) {

            console.error(error);

            quotesStatus.textContent =
                "Error cargando el detalle.";

        }

    };


    // =====================================================
    // CLICK EN VER
    // =====================================================

    quotesRows.addEventListener("click", (event) => {

        const button =
            event.target.closest(
                "button[data-id]"
            );

        if (!button) return;

        loadQuoteDetail(
            button.dataset.id
        );

    });


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    document
        .querySelector("#refreshButton")
        .addEventListener(
            "click",
            loadQuotes
        );


    // =====================================================
    // INICIAR
    // =====================================================

    loadQuotes();

    const printBtn =
    document.getElementById(
        "printQuoteBtn"
    );

if (printBtn) {

    printBtn.addEventListener(
        "click",
        () => {

            const id =
                printBtn.dataset.id;

            if (!id) return;

            window.open(
                `api/imprimir_cotizacion.php?id=${id}`,
                "_blank"
            );

        }
    );

}