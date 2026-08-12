<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "auth.php";

?>

  <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cotizador Colombia</title>
        <link rel="icon" type="image/png" href="img/Logo_icono.png">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/menu.css">
      </head>
      <body>
        <?php include __DIR__ . '/includes/menu.php'; ?>
        <main class="app-shell">
          
          <section class="layout-grid">
            <form class="panel" id="quoteForm">
              <div class="panel-title">
                <h2>Datos de la cotizacion</h2>
                <button class="ghost-button" type="button" id="resetButton">Restablecer</button>
              </div>

              <div class="field-grid">

                <!-- PAÍS -->
                <label>
                  País de la cotización
                  <select name="country" id="country">
                    <option value="COLOMBIA" selected>Colombia</option>
                    <option value="ECUADOR">Ecuador</option>
                    <option value="REPUBLICA_DOMINICANA">República Dominicana</option>
                  </select>
                </label>

                <!-- CLIENTE -->
                <label class="client-search-wrapper">
                  Cliente / facturar a
                  <input
                    name="billTo"
                    id="billTo"
                    placeholder="Nombre del cliente"
                    autocomplete="off">

                  <div id="clientResults" class="client-results"></div>
                </label>

                <!-- ENTREGAR EN -->
                <label>
                  Entregar en
                  <input name="deliverTo">
                </label>

                <!-- PO -->
                <label>
                  PO
                  <input
                    name="poHuella"
                    id="poHuella"
                    readonly>
                </label>

                <!-- ATT -->
                <label>
                  ATT
                  <input
                    name="att"
                    placeholder="Nombre del contacto">
                </label>

                <!-- FECHA -->
                <label>
                  Fecha
                  <input name="date" type="date">
                </label>

                <!-- TIEMPO DE ENTREGA -->
                <label>
                  Tiempo de entrega
                  <input
                    name="deliveryTime"
                    value="6 DIAS HABILES">
                </label>

              </div>

              <div class="section-divider"></div>

              <div class="field-grid">
                <label>
                  AGENTE
                  <select name="agent">
                    <option value="FEDEX">FEDEX</option>
                    <option value="DHL">DHL</option>
                  </select>
                </label>
                <label>
                  TRM
                  <input name="trm" type="number" min="0" step="0.01" value="3600">
                </label>
                <label>
                  IVA
                  <input name="taxRate" type="number" min="0" step="0.01" value="19" readonly>
                </label>
              </div>

              <div class="items">
                <div class="item-row item-head">
                  <span>Tipo</span>
                  <span>Cantidad</span>
                  <span>Producto</span>
                  <span>USD Kocher</span>
                  <span>Precio proforma USD</span>
                  <span>Total proforma USD</span>
                </div>
                <div id="itemsList" class="items-list">
                  <div class="item-row quote-item" data-initial="true">
                    <select name="type1" data-field="type" aria-label="Tipo de troquel 1">
                      <option value="">Seleccione Tipo</option>
                      <option value="standard">Universal</option>
                      <option value="extended">3L vida extendida</option>
                      <option value="chrome">Cromo</option>
                    </select>
                    <input name="qty1" data-field="qty" type="number" min="0" step="1" value="1" aria-label="Cantidad placa 04">
                    <input name="product1" data-field="product" aria-label="Producto placa 04">
                    <input name="usd1" data-field="usd" type="number" min="0" step="0.01" aria-label="USD Kocher placa 04">
                    <output data-field="hgc">USD 0.00</output>
                    <output data-field="total">USD 0.00</output>
                  </div>
                  <div class="item-row quote-item" data-initial="true">
                    <select name="type2" data-field="type" aria-label="Tipo de troquel 2">
                      <option value="">Seleccione Tipo</option>
                      <option value="standard">Universal</option>
                      <option value="extended">3L vida extendida</option>
                      <option value="chrome">Cromo</option>
                    </select>
                    <input name="qty2" data-field="qty" type="number" min="0" step="1" value="1" aria-label="Cantidad placa 15">
                    <input name="product2" data-field="product" aria-label="Producto placa 15">
                    <input name="usd2" data-field="usd" type="number" min="0" step="0.01" aria-label="USD Kocher placa 15">
                    <output data-field="hgc">USD 0.00</output>
                    <output data-field="total">USD 0.00</output>
                  </div>
                  <div class="item-row quote-item" data-initial="true">
                    <select name="type3" data-field="type" aria-label="Tipo de troquel 3">
                      <option value="">Seleccione Tipo</option>
                      <option value="standard">Universal</option>
                      <option value="extended">3L vida extendida</option>
                      <option value="chrome">Cromo</option>
                    </select>
                    <input name="qty3" data-field="qty" type="number" min="0" step="1" value="1" aria-label="Cantidad placa 16">
                    <input name="product3" data-field="product" aria-label="Producto placa 16">
                    <input name="usd3" data-field="usd" type="number" min="0" step="0.01" aria-label="USD Kocher placa 16">
                    <output data-field="hgc">USD 0.00</output>
                    <output data-field="total">USD 0.00</output>
                  </div>
                </div>
                <button class="ghost-button add-item-button" type="button" id="addItemButton">Agregar item</button>
              </div>
              <div style="margin-top: 30px; margin-bottom: 10px; padding: 0 10px;">
              <button class="primary-button" type="button" id="saveQuoteButton" 
              style="width: 100%; padding: 14px; font-weight: bold; font-size: 16px; background-color: #044597; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
              GUARDAR COTIZACIÓN
              </button>
      <p id="saveStatus" class="save-status" aria-live="polite" style="margin-top: 10px; text-align: center; font-weight: bold; color: #e53e3e; font-size: 13px; min-height: 1.2em;"></p>
    </div>
            </form>

            <aside class="panel results-panel" style="border-radius: 8px;">
              <div class="panel-title">
                <h2>Resultado</h2>
                
              </div>
              <div class="result-actions">
                <a class="ghost-link" href="detalle_cotizaciones.php">Ver cotizaciones</a>
              </div>
              <dl class="totals-list">
                <div>
                  <dt>TRM cotizacion</dt>
                  <dd id="quoteTrm">$0</dd>
                </div>
                <div>
                  <dt>Productos</dt>
                  <dd id="productsTotal">$0</dd>
                </div>
                <div>
                  <dt>Flete</dt>
                  <dd id="freightTotal">$0</dd>
                </div>
                <div>
                  <dt>Manejo</dt>
                  <dd id="handlingTotal">$0</dd>
                </div>
                <div>
                  <dt>Subtotal</dt>
                  <dd id="subtotal">$0</dd>
                </div>
                <div>
                  <dt>IVA</dt>
                  <dd id="taxTotal">$0</dd>
                </div>
                <div class="final-row">
                  <dt>Total</dt>
                  <dd id="total">$0</dd>
                </div>
              </dl>
            </aside>
          </section>

  <?php
              $basePath = '';
              include __DIR__ . '/includes/plantilla_cotizacion.php';
              ?>

        </main>

        <script src="js/app.js"></script>
        <script src="js/menu.js"></script>
      </body>
    </html>