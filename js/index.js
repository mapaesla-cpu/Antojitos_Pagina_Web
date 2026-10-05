/**
 * @file index.js
 * @description Módulo de la página principal (Home/Inicio).
 *              Consulta los platos o productos destacados para mostrarlos en el carrusel
 *              o sección de populares de la página principal.
 */

/**
 * Consulta los productos populares del menú y los renderiza en la sección de inicio.
 */
async function cargarPopularesMenu() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/dashboard/estadisticasmenu");
        const data = await res.json();

        const contenedor = document.getElementById("populares-inicio");
        if (!contenedor) return;

        contenedor.innerHTML = "";

        if (Array.isArray(data.productosmenu)) {
            data.productosmenu.forEach(item => {
                contenedor.innerHTML += `
                    <div class="producto-card">
                        <img src="http://localhost:3000/img/${item.imagen}" alt="${item.nombre}">
                        <h2>${item.nombre}</h2>
                        <h3>$${Number(item.precio).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                        <p>${item.descripcion || ''}</p>
                        <button class="btn-contenedor-productos" onclick="window.location.href='menu.html'">
                            Ver menú
                        </button>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar productos populares de inicio:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarPopularesMenu);
