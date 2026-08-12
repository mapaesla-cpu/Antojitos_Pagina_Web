async function cargarPopularesMenu() {
    const res = await fetch("http://localhost:3000/api/auth/dashboard/estadisticasmenu");
    const data = await res.json();

    const contenedor = document.getElementById("populares-inicio");
    contenedor.innerHTML = "";

    data.productosmenu.forEach(item => {
        contenedor.innerHTML += `
            <div class="producto-card">
                <img src="http://localhost:3000/img/${item.imagen}" alt="${item.nombre}">
                <h2>${item.nombre}</h2>
                <h3>$ ${Number(item.precio).toLocaleString()}</h3>
                <p>${item.descripcion}</p>
                <button class="btn-contenedor-productos" 
                onclick="window.location.href='menu.html'">
                Ver menú
            </button>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", cargarPopularesMenu);
