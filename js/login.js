// ===============================
// LOGIN HUELLA GLOBAL
// ===============================

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensajeError");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensaje.textContent = "";

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!correo || !password) {
        mensaje.textContent = "Debe ingresar usuario y contraseña.";
        return;
    }

    try {
        // Se apunta a login.php ubicado en la raíz
        const response = await fetch("login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                usuario: correo,
                password: password
            })
        });

        const data = await response.json();

        if (data.ok) {
            sessionStorage.setItem("usuario", data.usuario.usuario);
            sessionStorage.setItem("nombre", data.usuario.nombre);
            sessionStorage.setItem("correo", data.usuario.correo);
            sessionStorage.setItem("rol", data.usuario.rol);

            window.location.href = "cotizador.php";
        } else {
            mensaje.textContent = data.mensaje;
        }

    } catch (error) {
        console.error("Error de petición:", error);
        mensaje.textContent = "No fue posible conectarse con el servidor.";
    }
});