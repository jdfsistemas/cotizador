<?php

// 1. Cargar la configuración usando la ruta absoluta exacta del archivo
require_once __DIR__ . "/config.php";

// 2. Parámetros de conexión
$host     = "127.0.0.1";
$usuario  = "grupohue_admin";
$password = "Huellag2026$";
$bd       = "grupohue_cotizacioneshg";

try {

    // 3. Creación de la instancia PDO
    $conexion = new PDO(
        "mysql:host=$host;dbname=$bd;charset=utf8mb4",
        $usuario,
        $password
    );

    // Configurar PDO para lanzar excepciones en caso de error
    $conexion->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

    // Devolver los resultados por defecto como arreglos asociativos
    $conexion->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

} catch (PDOException $e) {

    // Si ocurre un error de conexión, se responde en formato JSON estándar
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);

    echo json_encode([
        'ok'    => false,
        'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}