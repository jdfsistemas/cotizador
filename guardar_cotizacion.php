<?php

header("Content-Type: application/json");

$conexion = new mysqli("localhost","root","","cotizacioneshg");

if($conexion->connect_error){
    http_response_code(500);
    echo json_encode([
        "error"=>"Error conectando a la BD"
    ]);
    exit;
}

$data=json_decode(file_get_contents("php://input"),true);

$sql="INSERT INTO cotizaciones
(
po,
cliente,
entregar_en,
att,
fecha,
tiempo_entrega,
agente,
trm,
iva,
subtotal,
flete,
manejo,
impuesto,
total,
detalle_json,
usuario_id,
fecha_creacion
)
VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?,NOW())";

$stmt=$conexion->prepare($sql);

$detalle=json_encode($data["items"],JSON_UNESCAPED_UNICODE);

$usuario=1;

$stmt->bind_param(
"sssssssdddddddsi",

$data["poHuella"],
$data["billTo"],
$data["deliverTo"],
$data["att"],
$data["date"],
$data["deliveryTime"],
$data["agent"],

$data["quoteTrm"],
$data["taxRate"],
$data["totals"]["subtotal"],
$data["totals"]["freightTotal"],
$data["totals"]["handlingTotal"],
$data["totals"]["taxTotal"],
$data["totals"]["total"],

$detalle,
$usuario
);

$stmt->execute();

echo json_encode([
"id"=>$stmt->insert_id
]);

$stmt->close();
$conexion->close();