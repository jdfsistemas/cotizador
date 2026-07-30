<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexion.php";

//<?php
// Configuración de encabezados
//header("Content-Type: application/json; charset=utf-8");

//require_once "../conexion.php";

// Capturar acción y método HTTP
$action = $_GET['action'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'];

// ================================
// LISTAR (GET)
// ================================
if ($action === 'listar' && $metodo === 'GET') {
    try {
        $stmt = $conexion->query("SELECT id, usuario, nombre, correo, rol, activo, ultimo_login, fecha_creacion FROM usuarios ORDER BY id DESC");
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["ok" => true, "data" => $usuarios]);
    } catch (PDOException $e) {
        error_log("Error al listar usuarios: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["ok" => false, "mensaje" => "Error interno al consultar la base de datos."]);
    }
    exit;
}

// ================================
// GUARDAR (POST)
// ================================
if ($action === 'guardar' && $metodo === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true) ?? [];

    $id       = !empty($input['id']) ? intval($input['id']) : null;
    $nombre   = trim($input['nombre'] ?? '');
    $correo   = trim($input['correo'] ?? '');
    $usuario  = trim($input['usuario'] ?? '');
    $password = $input['password'] ?? '';
    $rol      = $input['rol'] ?? 'Usuario';
    $activo   = isset($input['activo']) ? intval($input['activo']) : 1;

    // Validaciones básicas de campos vacíos
    if (empty($nombre) || empty($correo) || empty($usuario)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "mensaje" => "Todos los campos principales (nombre, correo, usuario) son obligatorios."]);
        exit;
    }

    // Validación de formato de correo
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "mensaje" => "El correo electrónico ingresado no tiene un formato válido."]);
        exit;
    }

    // Al crear un usuario nuevo, la contraseña es obligatoria
    if (!$id && empty($password)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "mensaje" => "La contraseña es obligatoria para nuevos usuarios."]);
        exit;
    }

    try {
        if ($id) {
            // EDITAR
            if (!empty($password)) {
                $passHash = password_hash($password, PASSWORD_DEFAULT);
                $sql = "UPDATE usuarios SET nombre = ?, correo = ?, usuario = ?, password = ?, rol = ?, activo = ? WHERE id = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->execute([$nombre, $correo, $usuario, $passHash, $rol, $activo, $id]);
            } else {
                $sql = "UPDATE usuarios SET nombre = ?, correo = ?, usuario = ?, rol = ?, activo = ? WHERE id = ?";
                $stmt = $conexion->prepare($sql);
                $stmt->execute([$nombre, $correo, $usuario, $rol, $activo, $id]);
            }
            $mensajeOk = "Usuario actualizado correctamente";
        } else {
            // CREAR
            $passHash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO usuarios (nombre, correo, usuario, password, rol, activo) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$nombre, $correo, $usuario, $passHash, $rol, $activo]);
            $mensajeOk = "Usuario creado correctamente";
        }

        echo json_encode(["ok" => true, "mensaje" => $mensajeOk]);
    } catch (PDOException $e) {
        error_log("Error SQL en guardar: " . $e->getMessage());

        // Captura de clave duplicada (Error PDO 23000 para UNIQUE constraints)
        if ($e->getCode() == '23000') {
            http_response_code(400);
            echo json_encode(["ok" => false, "mensaje" => "El usuario o correo electrónico ya se encuentra registrado."]);
        } else {
            http_response_code(500);
            echo json_encode(["ok" => false, "mensaje" => "Ocurrió un error al procesar la solicitud en el servidor."]);
        }
    }
    exit;
}

// ================================
// ELIMINAR (POST)
// ================================
if ($action === 'eliminar' && $metodo === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $id = intval($input['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["ok" => false, "mensaje" => "ID de usuario no válido."]);
        exit;
    }

    try {
        $stmt = $conexion->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["ok" => true, "mensaje" => "Usuario eliminado correctamente."]);
        } else {
            // Se corrige código 444 no estándar por 404 (Not Found)
            http_response_code(404);
            echo json_encode(["ok" => false, "mensaje" => "El usuario no existe o ya fue eliminado."]);
        }
    } catch (PDOException $e) {
        error_log("Error SQL en eliminar: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["ok" => false, "mensaje" => "No se pudo eliminar el usuario (posiblemente esté referenciado en otros registros)."]);
    }
    exit;
}

// Acción o Método no válido
http_response_code(400);
echo json_encode(["ok" => false, "mensaje" => "Petición no válida o recurso no encontrado."]);