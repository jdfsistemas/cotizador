<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Huella Global Colombia | Inicio de sesión</title>

    <link rel="stylesheet" href="css/login.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
</head>

<body>

    <div class="login-container">

        <!-- Panel izquierdo -->

        <div class="left-panel">

            <img src="img/Logo Color 1.png" class="logo" alt="Huella Global">

            <h1>COTIZADOR DE TROQUELES</h1>

        </div>

        <!-- Panel derecho -->

        <div class="right-panel">

            <div class="login-card">

                <h2>Iniciar Sesión</h2>

                <p class="subtitle">
                    Ingresa tus credenciales
                </p>

                <form id="loginForm">

                    <div class="form-group">

                        <label>Correo electrónico</label>

                        <input
                        type="email"
                        id="correo"
                        placeholder="Correo electrónico"
                        autocomplete="email">

                    </div>

                    <div class="form-group">

                        <label>Contraseña</label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            required>

                    </div>

                    <button type="submit">

                        Iniciar sesión

                    </button>

                    <div id="mensajeError"></div>

                </form>

            </div>

        </div>

    </div>

    <script src="js/login.js"></script>

</body>

</html>