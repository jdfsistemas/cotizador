<?php

require_once "../auth.php";
require_once "conexion.php";

header('Content-Type: application/json; charset=utf-8');

try {

    $id = $_GET['id'] ?? 0;

    if (!$id) {
        throw new Exception("ID no válido.");
    }

    $sql = "
        SELECT *
        FROM cotizaciones
        WHERE cotizacion_num = :id
        LIMIT 1
    ";

    $stmt = $conexion->prepare($sql);

    $stmt->execute([
        ':id' => $id
    ]);

    $quote = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$quote) {
        throw new Exception("Cotización no encontrada.");
    }

    $payload = json_decode(
        $quote['detalle_json'] ?? '{}',
        true
    );

    echo json_encode([
    'quote' => [
        'id' => $quote['cotizacion_num'],
        'cliente' => $quote['cliente'],
        'po' => ($quote['po'] ?? '') . ($quote['cotizacion_num'] ?? ''),
        'fecha' => $quote['fecha'],
        'agente' => $quote['agente'],
        'subtotal' => $quote['subtotal'],
        'flete' => $quote['flete'],
        'manejo' => $quote['manejo'],
        'impuesto' => $quote['impuesto'],
        'total' => $quote['total'],
        'items' => $payload
    ]
], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}