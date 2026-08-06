<?php

require_once "../auth.php";
require_once "conexion.php";

$id = $_GET['id'] ?? 0;

if (!$id) {
    die("ID no válido");
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
    die("Cotización no encontrada");
}

$sqlPais = "
    SELECT pais
    FROM cotizaciones_detalle
    WHERE cotizacion_num = :id
    LIMIT 1
";

$stmtPais = $conexion->prepare($sqlPais);

$stmtPais->execute([
    ':id' => $id
]);

$paisData = $stmtPais->fetch(PDO::FETCH_ASSOC);

$quote['country'] = $paisData['pais'] ?? '';

$detalle = json_decode(
    $quote['detalle_json'] ?? '{}',
    true
);

$quote['items'] =
    $detalle['items'] ?? [];

$quote['sections'] =
    $detalle['sections'] ?? [];


$basePath = '../';

?>
<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="utf-8">

    <title>
        Cotización #<?= $quote['cotizacion_num'] ?>
    </title>

    <link rel="stylesheet" href="<?= $basePath ?>css/styles.css">
    <link rel="stylesheet" href="<?= $basePath ?>css/menu.css">

</head>

<body>

<?php
include __DIR__ . '/../includes/plantilla_cotizacion.php';
?>

<script>

window.onload = () => {
    window.print();
};

</script>

</body>
</html>
