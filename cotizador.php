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
        <form class="panel" id="quoteForm" onsubmit="return false;">
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
                <option value="REPUBLICA DOMINICANA">República Dominicana</option>
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

            <div id="quoteActions" style="display: none; margin-top: 10px; gap: 10px;">

              <button
                class="primary-button"
                type="button"
                id="updateQuoteButton"
                style="flex: 1; padding: 12px; font-weight: bold; background-color: #044597; color: #ffffff; border: none; border-radius: 6px; cursor: pointer;">
                ACTUALIZAR
              </button>

              <button
                class="primary-button"
                type="button"
                id="printQuoteButton"
                style="flex: 1; padding: 12px; font-weight: bold; background-color: #198754; color: #ffffff; border: none; border-radius: 6px; cursor: pointer;">
                IMPRIMIR
              </button>
            </div>
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

      <!-- Contenedor interno para los cálculos de app.js -->
      <table style="display: none;">
        <tbody id="quoteRows"></tbody>
      </table>

</main>

<!-- Modal de Actualización con Formulario Completo -->
<div id="updateModal" class="modal-overlay" style="display: none;">
  <div class="modal-content" style="max-width: 900px; width: 95%; background-color: #f0f4f8; border-radius: 12px; padding: 24px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
    
    <div style="margin-bottom: 20px;">
      <h3 style="margin: 0; color: #044597; font-size: 22px; font-weight: bold;">Datos de la cotización</h3>
    </div>

    <!-- SECCIÓN DE CAMPOS PRINCIPALES -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">País de la cotización</label>
        <input type="text" id="modal_pais" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">Cliente / facturar a</label>
        <input type="text" id="modal_cliente" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">Entregar en</label>
        <input type="text" id="modal_entregar" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">PO</label>
        <input type="text" id="modal_po" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">ATT</label>
        <input type="text" id="modal_att" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">Fecha</label>
        <input type="date" id="modal_fecha" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">Tiempo de entrega</label>
        <input type="text" id="modal_tiempo_entrega" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #dcdfe4; margin: 15px 0;">

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">AGENTE</label>
        <input type="text" id="modal_agente" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">TRM</label>
        <input type="number" id="modal_trm" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
      <div>
        <label style="display: block; font-size: 11px; font-weight: bold; color: #044597; margin-bottom: 4px;">IVA</label>
        <input type="number" id="modal_iva" style="width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; background-color: #ffffff; font-size: 13px; box-sizing: border-box;">
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #dcdfe4; margin: 15px 0;">

    <!-- TABLA DINÁMICA DE ÍTEMS -->
    <div id="modalItemsContainer" style="margin-bottom: 20px;"></div>

    <!-- BOTONES DE ACCIÓN -->
    <div class="modal-actions" style="display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid #dcdfe4; padding-top: 15px;">
      <button type="button" id="btnConfirmUpdate" style="background-color: #044597; color: #ffffff; padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;">
        Actualizar Cotización
      </button>
      <button type="button" id="btnCloseModal" style="background-color: #ffffff; color: #333; border: 1px solid #ccc; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-size: 13px;">
        Cancelar
      </button>
    </div>

  </div>
</div>
 
    <!-- Cargar JavaScripts al final -->
    <script src="js/app.js"></script>
    <script src="js/menu.js"></script>
  </body>
</html>