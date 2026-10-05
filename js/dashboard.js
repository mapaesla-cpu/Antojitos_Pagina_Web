/**
 * @file dashboard.js
 * @description Módulo del panel de control principal (Dashboard).
 *              Carga métricas clave del negocio (pedidos del día, ingresos,
 *              productos más vendidos) y alertas de stock crítico de insumos.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  MÉTRICAS Y ESTADÍSTICAS DEL NEGOCIO
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta y despliega las estadísticas principales de ventas y actividad del día.
 */
async function cargarDashboard() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/dashboard/estadisticas", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        // Actualizar tarjetas de resumen
        const pedidosHoyEl = document.getElementById("pedidos-hoy");
        const pendientesEl = document.getElementById("pedidos-pendientes");
        const ingresosEl = document.getElementById("ingresos-hoy");

        if (pedidosHoyEl) pedidosHoyEl.textContent = data.pedidosHoy || 0;
        if (pendientesEl) pendientesEl.textContent = data.pendientes || 0;
        if (ingresosEl) ingresosEl.textContent = `$${Number(data.ingresos || 0).toLocaleString()}`;

        // Productos más vendidos
        const lista = document.getElementById("lista-populares");
        if (lista && Array.isArray(data.populares)) {
            lista.innerHTML = "";
            data.populares.forEach((item, index) => {
                lista.innerHTML += `
                    <li>
                        <span>#${index + 1}</span>
                        <span>${item.nombre}</span>
                        <span>${item.total_vendido} vendidos</span>
                    </li>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ALERTAS DE STOCK CRÍTICO DE INSUMOS
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta y despliega advertencias cuando los insumos caen por debajo del stock mínimo.
 */
async function cargarAlertasStock() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/api/auth/insumos/alertas", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const insumosCriticos = await response.json();

        const contenedor = document.getElementById('contenedor-alertas');
        const lista = document.getElementById('lista-alertas');

        if (!contenedor || !lista) return;

        if (Array.isArray(insumosCriticos) && insumosCriticos.length > 0) {
            contenedor.style.display = 'block';
            lista.innerHTML = '';

            insumosCriticos.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `⚠️ El insumo <strong>${item.nombre}</strong> está en nivel crítico. Quedan solo <span>${item.cantidad_disponible}</span> unidades (Mínimo establecido: ${item.stock_minimo}).`;
                lista.appendChild(li);
            });
        } else {
            contenedor.style.display = 'none';
        }
    } catch (error) {
        console.error('Error cargando las alertas de stock:', error);
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    cargarDashboard();
    cargarAlertasStock();
});