// ================================
// REFERENCIAS Y ELEMENTOS
// ================================
const modal = document.getElementById("modal");
const btnNuevo = document.getElementById("btnNuevo");
const btnCerrar = document.getElementById("cerrar");
const form = document.getElementById("formUsuario");
const tablaUsuarios = document.getElementById("tablaUsuarios");
const buscar = document.getElementById("buscar");

// Guardar array local para referenciar objetos en edición de forma segura
let listaUsuariosLocal = [];

// Función auxiliar para prevenir Inyección XSS al renderizar texto en HTML
function escaparHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Cargar usuarios al entrar a la página
document.addEventListener("DOMContentLoaded", cargarUsuarios);

// ================================
// BUSCAR USUARIOS
// ================================
buscar?.addEventListener("input", () => {
    const texto = buscar.value.toLowerCase().trim();

    const filtrados = listaUsuariosLocal.filter(u => {
        const nombre = (u.nombre || "").toLowerCase();
        const usuario = (u.usuario || "").toLowerCase();
        const correo = (u.correo || "").toLowerCase();
        const rol = (u.rol || "").toLowerCase();

        return nombre.includes(texto) ||
               usuario.includes(texto) ||
               correo.includes(texto) ||
               rol.includes(texto);
    });

    renderizarTabla(filtrados);
});

// ================================
// ABRIR Y CERRAR MODAL
// ================================
btnNuevo?.addEventListener("click", () => {
    form.reset();
    document.getElementById("id").value = "";
    document.querySelector(".modal-content h2").textContent = "Nuevo Usuario";
    
    // Al crear un nuevo usuario, las contraseñas son obligatorias
    document.getElementById("password").required = true;
    document.getElementById("password2").required = true;
    
    modal.style.display = "flex";
});

btnCerrar?.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ================================
// GUARDAR USUARIO (CONECTADO A PHP)
// ================================
form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const idVal = document.getElementById("id").value;
    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("password2").value;

    // Validación de coincidencia de contraseñas
    if ((!idVal || pass1 !== "") && pass1 !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const datos = {
        id: idVal ? parseInt(idVal, 10) : null,
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        usuario: document.getElementById("usuario").value.trim(),
        password: pass1,
        rol: document.getElementById("rol").value,
        activo: document.getElementById("activo").checked ? 1 : 0
    };

    try {
        const respuesta = await fetch("api/usuarios.php?action=guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const textoRespuesta = await respuesta.text();

        try {
            const resultado = JSON.parse(textoRespuesta);

            if (resultado.ok) {
                alert(resultado.mensaje);
                modal.style.display = "none";
                form.reset();
                cargarUsuarios();
            } else {
                alert("Error de backend: " + resultado.mensaje);
            }
        } catch (errJson) {
            console.error("Respuesta del servidor no válida (no es JSON):", textoRespuesta);
            alert("El servidor devolvió un error inesperado. Revisa la consola para más detalles.");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Ocurrió un error al intentar conectar con el servidor.");
    }
});

// ================================
// LISTAR USUARIOS EN LA TABLA
// ================================
async function cargarUsuarios() {
    try {
        const respuesta = await fetch("api/usuarios.php?action=listar");
        const textoRespuesta = await respuesta.text();

        try {
            const resultado = JSON.parse(textoRespuesta);
            if (resultado.ok) {
                listaUsuariosLocal = resultado.data || [];
                renderizarTabla(listaUsuariosLocal);
            } else {
                console.error("Error devuelto por PHP:", resultado.mensaje);
            }
        } catch (errJson) {
            console.error("Error al parsear el JSON de usuarios:", textoRespuesta);
        }
    } catch (error) {
        console.error("Error de red al cargar usuarios:", error);
    }
}

function renderizarTabla(usuarios) {
    if (!tablaUsuarios) return;
    tablaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
        tablaUsuarios.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay usuarios registrados</td></tr>`;
        return;
    }

    const fragmento = document.createDocumentFragment();

    usuarios.forEach(u => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${escaparHTML(u.id)}</td>
            <td>${escaparHTML(u.nombre)}</td>
            <td>${escaparHTML(u.correo)}</td>
            <td>${escaparHTML(u.usuario)}</td>
            <td>${escaparHTML(u.rol)}</td>
            <td>${u.activo == 1 ? "Activo" : "Inactivo"}</td>
            <td>
                <button type="button" class="btn-editar" onclick="prepararEdicion(${u.id})">
                    Editar
                </button>
                <button type="button" class="btn-eliminar" onclick="eliminarUsuario(${u.id})">
                    Eliminar
                </button>
            </td>
        `;
        fragmento.appendChild(fila);
    });

    tablaUsuarios.appendChild(fragmento);
}

// ================================
// ACCIONES: EDITAR Y ELIMINAR
// ================================
window.prepararEdicion = (id) => {
    const u = listaUsuariosLocal.find(item => item.id == id);
    if (!u) return;

    document.getElementById("id").value = u.id;
    document.getElementById("nombre").value = u.nombre || "";
    document.getElementById("correo").value = u.correo || "";
    document.getElementById("usuario").value = u.usuario || "";
    document.getElementById("rol").value = u.rol || "";
    document.getElementById("activo").checked = u.activo == 1;

    // Al editar, la contraseña no es obligatoria a menos que se desee cambiar
    const passInput = document.getElementById("password");
    const pass2Input = document.getElementById("password2");

    passInput.value = "";
    pass2Input.value = "";
    passInput.required = false;
    pass2Input.required = false;

    document.querySelector(".modal-content h2").textContent = "Editar Usuario";
    modal.style.display = "flex";
};

window.eliminarUsuario = async (id) => {
    if (!confirm("¿Deseas eliminar este usuario?")) return;

    try {
        const respuesta = await fetch("api/usuarios.php?action=eliminar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id })
        });

        const textoRespuesta = await respuesta.text();

        try {
            const resultado = JSON.parse(textoRespuesta);
            if (resultado.ok) {
                cargarUsuarios();
            } else {
                alert("Error al eliminar: " + resultado.mensaje);
            }
        } catch (e) {
            console.error("Respuesta no válida al eliminar:", textoRespuesta);
            alert("Ocurrió un error en el servidor al intentar eliminar.");
        }
    } catch (error) {
        console.error("Error al intentar eliminar:", error);
        alert("Error de conexión al intentar eliminar el usuario.");
    }
};