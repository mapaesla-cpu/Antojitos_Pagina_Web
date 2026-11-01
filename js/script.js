/**
 * @file script.js
 * @description Módulo global de utilidades de interfaz y componentes compartidos.
 *              Gestiona la navegación móvil (menú hamburguesa), carrusel de populares
 *              y la carga dinámica de información del negocio en el pie de página (footer).
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  MENÚ DE NAVEGACIÓN MÓVIL
 * ══════════════════════════════════════════════════════════════════════════ */

const hamburguesa = document.getElementById("hamburguesa-menu");
const menu = document.getElementById("menu");

if (hamburguesa && menu) {
    hamburguesa.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

/* ══════════════════════════════════════════════════════════════════════════
 *  PIE DE PÁGINA DINÁMICO (FOOTER)
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta la configuración de la empresa y la muestra dinámicamente en el footer.
 */
async function cargarFooter() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/configuracion/consultar");
        const data = await res.json();

        if (data) {
            const setTexto = (id, valor) => {
                const el = document.getElementById(id);
                if (el && valor !== undefined) el.textContent = valor;
            };

            setTexto("footer-nombre", data.nombre_negocio);
            setTexto("footer-nit", data.nit);
            setTexto("footer-telefono", data.telefono);
            setTexto("footer-direccion", data.direccion);
            setTexto("footer-apertura", data.horario_apertura);
            setTexto("footer-cierre", data.horario_cierre);
            setTexto("footer-dias", data.dias_atencion);
        }
    } catch (error) {
        console.error("Error al cargar datos del footer:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarFooter);

/* ══════════════════════════════════════════════════════════════════════════
 *  CARRUSEL DE PRODUCTOS POPULARES
 * ══════════════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════════════
 *  BARRA LATERAL (SIDEBAR) ADMINISTRATIVA
 * ══════════════════════════════════════════════════════════════════════════ */

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

    // Cargar datos del usuario en el sidebar si los elementos existen
    cargarUsuarioSesion();
});

/* ══════════════════════════════════════════════════════════════════════════
 *  VERIFICACIÓN DE TOKEN Y DATOS DE SESIÓN EN EL SIDEBAR
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Verifica que exista un token JWT válido y carga el nombre y rol del usuario
 * en los elementos #usuario-sesion y #rol-usuario-sesion del sidebar.
 * Si no hay token o es inválido, redirige al login.
 */
async function cargarUsuarioSesion() {
    const spanUsuario = document.getElementById("usuario-sesion");
    const spanRol = document.getElementById("rol-usuario-sesion");

    // Solo ejecutar en páginas administrativas que tengan el sidebar con estos elementos
    if (!spanUsuario || !spanRol) return;

    const token = localStorage.getItem("token");

    // Si no hay token, redirigir al login
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/usuario/sesion", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            // Token inválido o expirado → cerrar sesión
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (data.nombre && data.rol) {
            spanUsuario.textContent = data.nombre;
            spanRol.textContent = data.rol;
        }
    } catch (error) {
        console.error("Error al cargar datos de sesión:", error);
    }
}