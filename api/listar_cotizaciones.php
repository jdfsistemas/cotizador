<?php

require_once "../auth.php";
require_once "conexion.php";

header('Content-Type: application/json; charset=utf-8');

try {

    $sql = "
        SELECT
            d.*,
            c.po
        FROM cotizaciones_detalle d
        INNER JOIN cotizaciones c
            ON c.cotizacion_num = d.cotizacion_num
        ORDER BY d.cotizacion_num ASC
        LIMIT 50
    ";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $quotes = [];

    foreach ($registros as $row) {

            $quotes[] = [
            
            'id' => $row['id'],

            'codigo' => $row['po'] ?? '',

            'cotizacion_num' => $row['cotizacion_num'] ?? '',

            'pais' => $row['pais'] ?? '',

            'entrega_ok_cliente' =>
                $row['entrega_ok_cliente'] ?? '',

            'cliente' =>
                $row['cliente'] ?? '',

            'fecha_solicitud' =>
                $row['fecha_solicitud'] ?? '',

            'producto' =>
                $row['producto'] ?? '',

            'detalle' =>
                $row['detalle'] ?? '',

            'fecha_envio_cotizacion' =>
                $row['fecha_envio_cotizacion'] ?? '',

            'seguimiento_1' =>
                $row['seguimiento_1'] ?? '',

            'seguimiento_2' =>
                $row['seguimiento_2'] ?? '',

            'fecha_aprobacion' =>
                $row['fecha_aprobacion'] ?? '',

            'fecha_envio_fabricacion' =>
                $row['fecha_envio_fabricacion'] ?? '',

            'fecha_despachada_kocher' =>
                $row['fecha_despachada_kocher'] ?? '',

            'calidad_troquel' =>
                $row['calidad_troquel'] ?? '',

            'valor_kocher' =>
                $row['valor_kocher'] ?? '',

            'valor_hg' =>
                $row['valor_hg'] ?? '',

            'orden_servicio' =>
                $row['orden_servicio'] ?? '',

            'placa_tool_id' =>
                $row['placa_tool_id'] ?? '',

            'guia' =>
                $row['guia'] ?? '',

            'transportador' =>
                $row['transportador'] ?? '',

            'factura_flete' =>
                $row['factura_flete'] ?? '',

            'factura_kocher' =>
                $row['factura_kocher'] ?? '',

            'factura_hg' =>
                $row['factura_hg'] ?? '',

            'correo_facturacion' =>
                $row['correo_facturacion'] ?? '',

            'orden_compra' =>
                $row['orden_compra'] ?? '',

            'observaciones_factura' =>
                $row['observaciones_factura'] ?? '',

            'fecha_recibio_cliente' =>
                $row['fecha_recibio_cliente'] ?? '',

            'observaciones' =>
                $row['observaciones'] ?? '',

            'dias_sol_cot_cotizacion' =>
                $row['dias_sol_cot_cotizacion'] ?? '',

            'dias_pedido_entrega' =>
                $row['dias_pedido_entrega'] ?? ''

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