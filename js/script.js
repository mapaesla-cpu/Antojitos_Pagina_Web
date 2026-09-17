const hamburguesa = document.getElementById("hamburguesa-menu");
const menu = document.getElementById("menu");
hamburguesa.addEventListener("click", () => {
    menu.classList.toggle("active");
});

const nombreInsumo = document.getElementById("nombre_insumo");
const unidadInsumo = document.getElementById("unidad_medida");
const cantidadInsumo = document.getElementById("cantidad_disponible");
const stockInsumo = document.getElementById("stock_minimo");

async function cargarFooter() {
    const res = await fetch("http://localhost:3000/api/auth/configuracion/consultar");
    const data = await res.json();
    console.log(data);

    document.getElementById("footer-nombre").textContent = data.nombre_negocio;
    document.getElementById("footer-nit").textContent = data.nit;
    document.getElementById("footer-telefono").textContent = data.telefono;
    document.getElementById("footer-direccion").textContent = data.direccion;
    document.getElementById("footer-apertura").textContent = data.horario_apertura;
    document.getElementById("footer-cierre").textContent = data.horario_cierre;
    document.getElementById("footer-dias").textContent = data.dias_atencion;
}



const botonInsumo = document.getElementById("nombre");

const tablaInsumo = document.getElementById("nombre");

document.addEventListener("DOMContentLoaded", cargarFooter);

const populares = document.getElementById('populares-inicio');
const siguiente = document.getElementById('siguiente');
const anterior  = document.getElementById('anterior');

if (siguiente && populares) {
    siguiente.addEventListener('click', () => {
        populares.scrollBy({ left: 330, behavior: 'smooth' });
    });
}

if (anterior && populares) {
    anterior.addEventListener('click', () => {
        populares.scrollBy({ left: -330, behavior: 'smooth' });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const btnHamburguesa = document.getElementById("hamburguesa-menu");
    const btnCerrar = document.getElementById("btn-cerrar-sidebar");
    const sidebar = document.getElementById("sidebar");

    if (btnHamburguesa && sidebar) {
        btnHamburguesa.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("visible");
        });
    }

    if (btnCerrar && sidebar) {
        btnCerrar.addEventListener("click", () => {
            sidebar.classList.remove("visible");
        });
    }
});