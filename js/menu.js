document.addEventListener("DOMContentLoaded", function () {

    const btnMenu = document.getElementById("btnMenu");
    const menu = document.getElementById("menu");

    // Busca automáticamente el contenido de la página
    const contenido =
        document.querySelector(".contenedor") ||
        document.querySelector(".app-shell");

    if (btnMenu && menu) {

        btnMenu.onclick = function () {

            menu.classList.toggle("abierto");

            if (contenido) {
                contenido.classList.toggle("menu-abierto");
            }

        };

    }

    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {

        btnLogout.onclick = function () {

            sessionStorage.clear();
            location.href = "index.html";

        };

    }

});