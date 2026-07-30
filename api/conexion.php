<?php

require_once "config.php";

$host = "127.0.0.1"; // Es más estable usar 127.0.0.1 que localhost en PDO
$usuario = "grupohue_admin";
$password = "Huellag2026$";
$bd = "grupohue_cotizacioneshg";

try {

    $conexion = new PDO(
        "mysql:host=$host;dbname=$bd;charset=utf8mb4",
        $usuario,
        $password
    );

    // Mostrar errores de PDO
    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    // Retornar resultados como arreglo asociativo
    $conexion->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $e) {

    // Enviar encabezado JSON y código de error 500
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);

    echo json_encode([
        'status'  => 'error',
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);

    exit; // Detiene la ejecución limpia
}