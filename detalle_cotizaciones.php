<?php
require_once "auth.php";
?>

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cotizaciones guardadas</title>
    <link rel="stylesheet" href="css/styles.css">
  </head>
  <body>
    <main class="app-shell">
      <section class="quote-header">
        <div class="company-header">
        <img src="img/Logo Color 1.png" alt="Huella Global" class="company-logo">
          <h1>Cotizaciones guardadas</h1>
        </div>
        <div class="summary-total">
          <span>Registros</span>
          <strong id="quotesCount">0</strong>
          <small>Ultimas 50 cotizaciones</small>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>Historial</h2>
          <div class="header-actions">
            <a class="ghost-link" href="/">Nueva cotizacion</a>
            <button class="primary-button" type="button" id="refreshButton">Actualizar</button>
          </div>
        </div>
        <p id="quotesStatus" class="save-status" aria-live="polite"></p>
        <div class="table-wrap">
          <table class="quotes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
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
          <button class="ghost-button" type="button" id="closeDetailButton">Cerrar</button>
        </div>
        <div id="quoteDetail"></div>
      </section>
    </main>

    <script src="cotizaciones.js"></script>
  </body>
</html>
