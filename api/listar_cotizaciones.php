<?php

require_once "../auth.php";
require_once "conexion.php";

header('Content-Type: application/json; charset=utf-8');

try {

    $sql = "
        SELECT *
        FROM cotizaciones
        ORDER BY cotizacion_num ASC
        LIMIT 50
    ";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $quotes = [];

    foreach ($registros as $row) {

        $quotes[] = [
            'id'          => $row['cotizacion_num'] ?? '',
            'quote_date'  => $row['fecha'] ?? '',
            'client'      => $row['cliente'] ?? '',
            'po_huella' => ($row['po'] ?? '') . ($row['cotizacion_num'] ?? ''),
            'total_usd'   => $row['subtotal'] ?? 0,
            'created_at'  => $row['fecha'] ?? ''
        ];
    }

    echo json_encode([
        'quotes' => $quotes
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}