<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

// Incluye la conexión desde la carpeta api/
require_once __DIR__ . "/api/conexion.php";

// Solo aceptar método POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Método no permitido."
    ]);
    exit;
}

// Leer datos JSON o Form POST tradicional
$rawInput = file_get_contents("php://input");
$datos = json_decode($rawInput, true);

if (!is_array($datos)) {
    $datos = $_POST;
}

// Captura de credenciales
$correo   = trim($datos["correo"] ?? $datos["usuario"] ?? "");
$password = trim($datos["password"] ?? $datos["clave"] ?? "");

// Validar campos vacíos
if ($correo === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Debe ingresar usuario y contraseña."
    ]);
    exit;
}

try {
    // Buscar por correo O nombre de usuario
    $sql = $conexion->prepare("
        SELECT *
        FROM usuarios
        WHERE correo = ? OR usuario = ?
        LIMIT 1
    ");

    $sql->execute([$correo, $correo]);
    $user = $sql->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "ok" => false,
            "mensaje" => "Usuario o contraseña incorrectos."
        ]);
        exit;
    }

    // Verificar si está activo
    if (intval($user["activo"]) !== 1) {
        http_response_code(403);
        echo json_encode([
            "ok" => false,
            "mensaje" => "Usuario inactivo. Contacte al administrador."
        ]);
        exit;
    }

    // Verificar contraseña
    $passwordValida = password_verify($password, $user["password"]) || ($user["password"] === $password);

    if (!$passwordValida) {
        http_response_code(401);
        echo json_encode([
            "ok" => false,
            "mensaje" => "Usuario o contraseña incorrectos."
        ]);
        exit;
    }

    // Regenerar ID de sesión por seguridad
    session_regenerate_id(true);

    // Guardar variables de sesión
    $_SESSION["usuario_id"] = $user["id"];
    $_SESSION["usuario"]    = $user["usuario"];
    $_SESSION["nombre"]     = $user["nombre"];
    $_SESSION["correo"]     = $user["correo"];
    $_SESSION["rol"]        = $user["rol"];

    // Actualizar fecha del último login
    $sqlLog = $conexion->prepare("
        UPDATE usuarios
        SET ultimo_login = NOW()
        WHERE id = ?
    ");
    $sqlLog->execute([$user["id"]]);

    // Responder al frontend
    echo json_encode([
        "ok" => true,
        "mensaje" => "Inicio de sesión exitoso.",
        "usuario" => [
            "id"      => $user["id"],
            "usuario" => $user["usuario"],
            "nombre"  => $user["nombre"],
            "correo"  => $user["correo"],
            "rol"     => $user["rol"]
        ]
    ]);

} catch (PDOException $e) {
    error_log("Error SQL en login: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error interno al procesar el inicio de sesión."
    ]);
}
?>