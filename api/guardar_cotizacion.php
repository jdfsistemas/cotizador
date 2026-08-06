<?php
// 1. Iniciar sesión al inicio
session_start();

// 2. FORZAR la muestra de todos los errores de PHP en texto plano para depurar
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=utf-8");

try {
    // Requerir la conexión
    require_once __DIR__ . "/conexion.php";

    // Leer el payload que viene de JS
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    if (!$data) {
        throw new Exception("No se recibió ningún JSON válido desde el navegador.");
    }

    // Datos extraídos del JSON
    $pais         = $data["country"] ?? "";
    $po           = $data["poHuella"] ?? "";
    $cliente      = $data["billTo"] ?? "";
    $entregarEn   = $data["deliverTo"] ?? "";
    $att          = $data["att"] ?? "";
    $fecha        = $data["date"] ?? "";
    $tiempoEntrega = $data["deliveryTime"] ?? "";
    $agente       = $data["agent"] ?? "";
    $trm          = floatval($data["quoteTrm"] ?? 0);
    $iva          = floatval($data["taxRate"] ?? 0);
    $subtotal     = floatval($data["totals"]["subtotal"] ?? 0);
    $flete        = floatval($data["totals"]["freightTotal"] ?? 0);
    $manejo       = floatval($data["totals"]["handlingTotal"] ?? 0);
    $impuesto     = floatval($data["totals"]["taxTotal"] ?? 0);
    $total        = floatval($data["totals"]["total"] ?? 0);
    $items = $data["items"] ?? [];
    $sections = $data["sections"] ?? [];
    $detalle = json_encode([
    "items" => $items,
    "sections" => $sections
    ], JSON_UNESCAPED_UNICODE);

    // Usuario por defecto si no hay sesión
    $usuario      = $_SESSION["usuario_id"] ?? 1;

    // Preparar INSERT ignorando el campo "id" para que MySQL lo autoincremente
    $sql = "INSERT INTO cotizaciones (
                po, cliente, entregar_en, att, fecha, tiempo_entrega, agente,
                trm, iva, subtotal, flete, manejo, impuesto, total,
                detalle_json, usuario_id, fecha_creacion
            ) VALUES (
                :po, :cliente, :entregar_en, :att, :fecha, :tiempo_entrega, :agente,
                :trm, :iva, :subtotal, :flete, :manejo, :impuesto, :total,
                :detalle_json, :usuario_id, NOW()
            )";

    $stmt = $conexion->prepare($sql);

    $stmt->execute([
        ":po"            => $po,
        ":cliente"       => $cliente,
        ":entregar_en"   => $entregarEn,
        ":att"           => $att,
        ":fecha"         => $fecha,
        ":tiempo_entrega"=> $tiempoEntrega,
        ":agente"        => $agente,
        ":trm"           => $trm,
        ":iva"           => $iva,
        ":subtotal"      => $subtotal,
        ":flete"         => $flete,
        ":manejo"        => $manejo,
        ":impuesto"      => $impuesto,
        ":total"         => $total,
        ":detalle_json"  => $detalle,
        ":usuario_id"    => $usuario
    ]);

    $cotizacionNum = $conexion->lastInsertId();

foreach ($items as $item) {

    $tipoTroquel = match ($item["type"] ?? "") {

    "standard" => "UNIVERSAL",

    "extended" => "3L VIDA EXTENDIDA",

    "chrome" => "CROMO",

    default => ""

    };

    $sqlDetalle = "
        INSERT INTO cotizaciones_detalle
        (
            cotizacion_num,
            cliente,
            pais,
            fecha_solicitud,
            producto,
            detalle,
            calidad_troquel,
            valor_kocher,
            valor_hg
        )
        VALUES
        (
            :cotizacion_num,
            :cliente,
            :pais,
            :fecha_solicitud,
            :producto,
            :detalle,
            :calidad_troquel,
            :valor_kocher,
            :valor_hg
        )
    ";

    $stmtDetalle = $conexion->prepare($sqlDetalle);

    $stmtDetalle->execute([

        ":cotizacion_num"  => $cotizacionNum,

        ":cliente"         => $cliente,

        ":pais" => $pais,

        ":fecha_solicitud" => $fecha,

        ":producto"        => $item["product"] ?? "",

        ":detalle"         => $item["product"] ?? "",

        ":calidad_troquel" => $tipoTroquel,

        ":valor_kocher"    => $item["kocherUsd"] ?? 0,

        ":valor_hg"        => $item["hgcUsd"] ?? 0

    ]);

}

   echo json_encode([
    "ok" => true,
    "id" => $cotizacionNum,
    "mensaje" => "Cotización guardada exitosamente"
]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "ERROR DETECTADO: " . $e->getMessage(),
        "archivo" => $e->getFile(),
        "linea" => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}