<?php
require_once "auth.php";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración de Usuarios</title>
    <link rel="stylesheet" href="css/usuarios.css">
    <link rel="stylesheet" href="css/menu.css">
</head>
<body>
<?php include __DIR__ . '/includes/menu.php'; ?>
<div class="contenedor">
    <header>
        <div class="titulo">
            <img src="img/Logo Color 1.png" alt="Logo" class="logo">
            <div>
                <h1>Administración de Usuarios</h1>
            </div>
        </div>
        <button id="btnNuevo">+ Nuevo Usuario</button>
    </header>

    <section class="barra">
        <input type="text" id="buscar" placeholder="Buscar usuario...">
    </section>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="tablaUsuarios">
            <!-- Se llena dinámicamente con JS -->
        </tbody>
    </table>
</div>

<!-- ========================= -->
<!-- MODAL DE REGISTRO / EDICIÓN -->
<!-- ========================= -->
<div class="modal" id="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Nuevo Usuario</h2>
        </div>

        <div class="modal-body">
            <form id="formUsuario">
                <input type="hidden" id="id">

                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" required>

                <label for="correo">Correo</label>
                <input type="email" id="correo" required>

                <label for="usuario">Usuario</label>
                <input type="text" id="usuario" required>

                <label for="password">Contraseña</label>
                <input type="password" id="password" required>

                <label for="password2">Confirmar contraseña</label>
                <input type="password" id="password2" required>

                <label for="rol">Rol</label>
                <select id="rol">
                    <option value="Administrador">Administrador</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Troqueles">Troqueles</option>
                </select>

                <label class="check">
                    <input type="checkbox" id="activo" checked>
                    <span>Activo</span>
                </label>
            </form>
        </div>

        <div class="modal-footer">
            <button type="button" id="cerrar">Cancelar</button>
            <button type="submit" form="formUsuario">Guardar</button>
        </div>
    </div>
</div>

<script src="js/usuarios.js"></script>
<script src="js/menu.js"></script>
</body>
</html>