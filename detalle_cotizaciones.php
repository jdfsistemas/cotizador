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
        <table id="tablaCotizaciones" class="table table-striped table-hover table-bordered align-middle" style="width:100%">
            <thead>
              <tr>
                <th>N° Cotización HG</th>
                <th>Fecha cotización</th>
                <th>Cliente</th>
                <th>PO Huella</th>
                <th>Total USD</th>
                <th>Guardada</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody id="quotesRows"></tbody>
          </table>
        </div>
      </section>

      <section class="panel detail-panel" id="detailPanel" hidden>
        <div class="panel-title">
          <h2>Detalle</h2>
          <button class="btn btn-outline-secondary btn-sm" type="button" id="closeDetailButton">
          <i class="bi bi-x-lg"></i>
          Cerrar
          </button>
        </div>
        <div id="quoteDetail"></div>
      </section>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.11/js/dataTables.bootstrap5.min.js"></script>
    <script src="js/cotizaciones.js"></script>
    <script src="js/menu.js"></script>
  </body>
</html>
