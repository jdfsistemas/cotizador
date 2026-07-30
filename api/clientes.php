<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

$busqueda = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($busqueda === '') {
    echo json_encode([]);
    exit;
}

try {

    $sql = "
        SELECT
            id,
            cliente,
            iniciales,
            consecutivo
        FROM clientes
        WHERE cliente LIKE :busqueda
        ORDER BY cliente ASC
        LIMIT 10
    ";

    $stmt = $conexion->prepare($sql);

    $stmt->execute([
        ':busqueda' => '%' . $busqueda . '%'
    ]);

    $clientes = $stmt->fetchAll();

    foreach ($clientes as &$cliente) {

        $cliente['identificacion'] =
            $cliente['iniciales'] .
            str_pad(
                $cliente['consecutivo'],
                3,
                '0',
                STR_PAD_LEFT
            );
    }

    echo json_encode(
        $clientes,
        JSON_UNESCAPED_UNICODE
    );

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'status' => 'error',
        'message' => 'Error consultando clientes'
    ]);
}