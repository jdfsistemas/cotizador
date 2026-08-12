<?php
require_once "auth.php";
?>

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cotizaciones Guardadas</title>
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.11/css/dataTables.bootstrap5.min.css">
    <!-- Estilos propios -->
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/menu.css">
    <link rel="stylesheet" href="css/datatable.css">
</head>
  <body>
    <?php include __DIR__ . '/includes/menu.php'; ?>
    <main class="app-shell">
      <section class="quote-header">
        <div class="company-header">
        <img src="img/Logo Color 1.png" alt="Huella Global" class="company-logo">
          <h1>COTIZACIONES GUARDADAS</h1>
        </div>
      </section>
      <section class="panel shadow-sm rounded-4 p-4">
      <div class="panel-title mb-4">

    <input
    type="text"
    id="buscarCotizacion"
    class="form-control"
    placeholder="Buscar"
    style="width:300px;">

    <div class="header-actions">

        <a href="cotizador.php"
           class="btn btn-success">
            + Nueva Cotización
        </a>

        <button
            id="refreshButton"
            class="btn btn-primary">
            Actualizar
        </button>
      </div>
  </div>

        <p id="quotesStatus" class="save-status" aria-live="polite"></p>
        <div class="table-responsive">
        <table id="tablaCotizaciones"
       class="table table-striped table-hover table-bordered align-middle"
       style="width:100%">

    <thead>
        <tr>

            <th>COD</th>
            <th>NO. COTIZACION HG</th>
            <th>PAIS</th>
            <th>ENTREGA OK AL CLIENTE</th>
            <th>CLIENTE</th>
            <th>FECHA SOLICITUD</th>
            <th>PRODUCTO</th>
            <th>DETALLE</th>
            <th>FECHA ENVIO COTIZACION</th>
            <th>SEGUIMIENTO 1</th>
            <th>SEGUIMIENTO 2</th>
            <th>FECHA APROBACION</th>
            <th>FECHA ENVIO FABRICACION</th>
            <th>FECHA DESPACHADA</th>
            <th>CALIDAD</th>
            <th>VALOR K+B</th>
            <th>VALOR HG</th>
            <th>ORDEN SERVICIO K+B ID</th>
            <th>N° PLACA K+B TOOL ID</th>
            <th>GUIA</th>
            <th>TRANSPORTADOR</th>
            <th>FACTURA FLETE</th>
            <th>FACTURA K+B</th>
            <th>CORREO ENVIADO A FACTURAR</th>
            <th>ORDEN COMPRA</th>
            <th>FACTURA HG</th>
            <th>OBSERVACIONES FACTURA HG</th>
            <th>FECHA RECIBIO CLIENTE</th>
            <th>OBSERVACIONES</th>
            <th>DIAS SOL-COT</th>
            <th>DIAS PEDIDO-ENTREGA</th>

        </tr>
    </thead>

    <tbody id="quotesRows"></tbody>

</table>
        </div>
      </section>
    </main>

    
    <div
    class="modal fade"
    id="quoteModal"
    tabindex="-1"
    aria-hidden="true">

    <div class="modal-dialog modal-xl modal-dialog-scrollable">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">
                    Detalle de Cotización
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>

            <div
                class="modal-body"
                id="quoteDetailModal">
            </div>

            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-primary"
                    id="printQuoteBtn">

                    <i class="bi bi-printer"></i>
                    Imprimir

                </button>

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Cerrar

                </button>

            </div>

        </div>

    </div>

</div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.11/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/cotizaciones.js"></script>
    <script src="js/menu.js"></script>
  </body>
</html>
