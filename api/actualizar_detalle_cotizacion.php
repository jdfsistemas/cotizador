<?php

require_once "../auth.php";
require_once "conexion.php";

header('Content-Type: application/json; charset=utf-8');

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    $id =
        $data["id"] ?? null;

    $campo =
        $data["campo"] ?? "";

    $valor =
        $data["valor"] ?? "";

    if (!$id || !$campo) {

        throw new Exception(
            "Datos incompletos."
        );
    }

    $camposPermitidos = [

        'entrega_ok_cliente',
        'fecha_envio_cotizacion',
        'seguimiento_1',
        'seguimiento_2',
        'fecha_aprobacion',
        'fecha_envio_fabricacion',
        'fecha_despachada_kocher',
        'fecha_recibio_cliente',
        'orden_servicio',
        'placa_tool_id',
        'guia',
        'transportador',
        'factura_flete',
        'factura_kocher',
        'factura_hg',
        'correo_facturacion',
        'orden_compra',
        'observaciones_factura',
        'observaciones'

    ];

    if (!in_array($campo, $camposPermitidos)) {

        throw new Exception(
            "Campo no permitido."
        );
    }

    $sql = "
        UPDATE cotizaciones_detalle
        SET {$campo} = :valor
        WHERE id = :id
    ";

    $stmt =
        $conexion->prepare($sql);

    $stmt->execute([

        ':valor' => $valor,
        ':id' => $id

    ]);

    // RECALCULAR DIAS

$stmt = $conexion->prepare("
    SELECT
        fecha_solicitud,
        fecha_envio_cotizacion,
        fecha_envio_fabricacion,
        fecha_recibio_cliente
    FROM cotizaciones_detalle
    WHERE id = ?
");

$stmt->execute([$id]);

$row = $stmt->fetch(PDO::FETCH_ASSOC);

$diasSolCot = 0;
$diasPedidoEntrega = 0;

if (
    !empty($row['fecha_solicitud']) &&
    !empty($row['fecha_envio_cotizacion'])
) {

    $diasSolCot =
        floor(
            (
                strtotime($row['fecha_envio_cotizacion']) -
                strtotime($row['fecha_solicitud'])
            ) / 86400
        );
}

if (
    !empty($row['fecha_envio_fabricacion']) &&
    !empty($row['fecha_recibio_cliente'])
) {

    $diasPedidoEntrega =
        floor(
            (
                strtotime($row['fecha_recibio_cliente']) -
                strtotime($row['fecha_envio_fabricacion'])
            ) / 86400
        );
}

$stmt = $conexion->prepare("
    UPDATE cotizaciones_detalle
    SET
        dias_sol_cot_cotizacion = ?,
        dias_pedido_entrega = ?
    WHERE id = ?
");

$stmt->execute([
    $diasSolCot,
    $diasPedidoEntrega,
    $id
]);


    echo json_encode([

        'ok' => true

    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([

        'error' =>
            $e->getMessage()

    ]);
}