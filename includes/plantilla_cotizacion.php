<?php
$basePath = $basePath ?? '';
?>

<?php if (strtoupper(trim($quote['country'] ?? '')) === 'COLOMBIA'): ?>

<section class="quote-header">
    <div id="companyHeader" class="company-header">

        <img
            src="<?= $basePath ?>img/Logo Color 1.png"
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

    </div>
</section>

<?php else: ?>

<section class="quote-header">
    <div id="companyHeader" class="company-header">

       <img
    src="<?= $basePath ?>img/logos huella global Corporation.png"
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

    </div>
</section>

<?php endif; ?>

<section class="quote-preview">

    <div class="preview-top">

        <div>
            <h2>Factura proforma</h2>

            <p>
                <strong>Facturar a:</strong>
                <?= htmlspecialchars($quote['cliente'] ?? '') ?>
            </p>

            <p>
                <strong>Entregar en:</strong>
                <?= htmlspecialchars($quote['entregar_en'] ?? '') ?>
            </p>
        </div>

        <div>

        <?php
            $poHuella = trim($quote['po'] ?? '');
            $numeroCotizacion = trim((string)($quote['cotizacion_num'] ?? ''));

            // Si el PO ya termina con el número de cotización,
            // no lo volvemos a agregar.
            if (
                $numeroCotizacion !== '' &&
                substr($poHuella, -strlen($numeroCotizacion)) === $numeroCotizacion
            ) {
                $poHuellaFinal = $poHuella;
            } else {
                $poHuellaFinal = $poHuella . $numeroCotizacion;
            }
            ?>

            <p>
                <strong>PO Huella:</strong>
                <?= htmlspecialchars($poHuellaFinal) ?>
            </p>

            <p>
                <strong>Fecha:</strong>
                <?= htmlspecialchars($quote['fecha'] ?? '') ?>
            </p>

            <p>
                <strong>Entrega:</strong>
                <?= htmlspecialchars($quote['tiempo_entrega'] ?? '') ?>
            </p>

        </div>

    </div>

    <div class="table-wrap">

        <table>

            <thead>
                <tr>
                    <th>CANTIDAD</th>
                    <th>CARACTERISTICAS Y CONCEPTOS</th>
                    <th>PRECIO $</th>
                    <th>TOTAL</th>
                </tr>
            </thead>

   <tbody id="quoteRows">

<?php

$sectionsByType = [];

foreach (($quote['sections'] ?? []) as $section) {

    $sectionsByType[$section['key']] = $section;

}

?>

<?php foreach (($quote['items'] ?? []) as $item): ?>

<?php

$type = strtolower($item['type'] ?? '');

$section = $sectionsByType[$type] ?? [];

$totals = $section['totals'] ?? [];

switch ($type) {

    case 'standard':
        $typeName = 'UNIVERSAL';
        break;

    case 'extended':
        $typeName = '3L VIDA EXTENDIDA';
        break;

    case 'chrome':
        $typeName = 'CROMO';
        break;

    default:
        $typeName = strtoupper(
            $item['typeLabel']
            ?? $item['type']
            ?? ''
        );

}

?>

<tr class="section-row">

    <td colspan="4">

        TROQUEL <?= $typeName ?>

    </td>

</tr>

<tr>

    <td>
        <?= htmlspecialchars($item['qty'] ?? '') ?>
    </td>

    <td>
        <?= htmlspecialchars($item['product'] ?? '') ?>
    </td>

    <td>
        USD <?= number_format(
            $item['hgcUsd'] ?? 0,
            2
        ) ?>
    </td>

    <td>
        USD <?= number_format(
            $item['totalUsd'] ?? 0,
            2
        ) ?>
    </td>

</tr>

<tr>

    <td></td>

    <td></td>

    <td>
        Flete y Manejo
    </td>

    <td>
    USD <?= number_format(
        ($totals['freightTotal'] ?? 0)
        + ($totals['handlingTotal'] ?? 0),
        2
    ) ?>
    </td>

</tr>

<tr>

    <td></td>

    <td></td>

    <td>
        <strong>Subtotal</strong>
    </td>

    <td>
    <strong>
        USD <?= number_format(
            $totals['subtotal'] ?? 0,
            2
        ) ?>
    </strong>
    </td>

</tr>

<?php if (($totals['taxTotal'] ?? 0) > 0): ?>

<tr>

    <td></td>

    <td></td>

    <td>
        <strong>IVA</strong>
    </td>

    <td>
        <strong>
           USD <?= number_format(
                $totals['taxTotal'] ?? 0,
                2
            ) ?>
        </strong>
    </td>

</tr>

<?php endif; ?>

<tr>

    <td></td>

    <td></td>

    <td>
        <strong>Total aprox.</strong>
    </td>

    <td>
        <strong>
        USD <?= number_format(
            $totals['total'] ?? 0,
            2
        ) ?>
        </strong>
    </td>

</tr>

<?php
$isChrome =
    stripos(
        $item['type'] ?? '',
        'chrome'
    ) !== false
    ||
    stripos(
        $item['typeLabel'] ?? '',
        'cromo'
    ) !== false;
?>

<?php if ($isChrome): ?>

<tr class="cromo-nota">

    <td colspan="4">

        De ser aprobada la calidad cromo son 6 días para fabricación;
        después de ingresado pedido puede tardar máximo 12 días en la entrega.

    </td>

</tr>

<?php endif; ?>

<?php endforeach; ?>

</tbody>

        </table>

    </div>

    <div class="notes">
        <h1>NOTA:</h1>

        <p>
            En caso de que su pedido se haga por mas de una unidad,
            el costo de flete y manejo solo se cobrara una sola vez
            por cada grupo de cinco (5) troqueles.
        </p>

        <p>
            Los valores relacionados en esta oferta son aproximados
            y no constituyen un valor exacto de la factura a generarse.
            Este documento aplica como cotizacion y prefactura del troquel
            si la propuesta es aprobada.
        </p>

        <p>
            Las ordenes se deben recibir antes de 9:30 hrs para que puedan
            ser procesadas y enviadas ese mismo dia a Colombia; ordenes
            despues de esa hora se procesaran al dia siguiente.
        </p>

    </div>

</section>