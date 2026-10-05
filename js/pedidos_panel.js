/**
 * @file pedidos_panel.js
 * @description Módulo de gestión y seguimiento de pedidos en el panel administrativo.
 *              Permite consultar pedidos en tiempo real, actualizar su estado
 *              (pendiente, en preparación, listo, entregado, cancelado) y ver su detalle.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  ESTADO GLOBAL
 * ══════════════════════════════════════════════════════════════════════════ */

/** @type {Array<Object>} Lista de pedidos cargados desde el backend */
let todosLosPedidos = [];

/* ══════════════════════════════════════════════════════════════════════════
 *  CONSULTA Y LISTADO DE PEDIDOS
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta la lista de todos los pedidos registrados en el sistema.
 */
async function cargarPedidos() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/pedidos/consultar", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        todosLosPedidos = Array.isArray(data) ? data : [];
        mostrarPedidos(todosLosPedidos);
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
    }
}

/**
 * Renderiza la lista de pedidos en la tabla administrativa con su selector de estado.
 * @param {Array<Object>} pedidos - Arreglo de pedidos a mostrar.
 */
function mostrarPedidos(pedidos) {
    const tabla = document.getElementById("tablaBody");
    if (!tabla) return;
    tabla.innerHTML = "";

    pedidos.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>#${item.id_pedido}</td>
                <td>${item.nombre_cliente}</td>
                <td>${item.telefono}</td>
                <td>${new Date(item.fecha_pedido).toLocaleDateString()}</td>
                <td>${item.tipo_entrega}</td>
                <td>$${Number(item.total).toLocaleString()}</td>
                <td>
                    <select onchange="cambiarEstado(${item.id_pedido}, this.value)">
                        <option value="pendiente" ${item.estado === 'pendiente' ? 'selected' : ''}>pendiente</option>
                        <option value="en preparacion" ${item.estado === 'en preparacion' ? 'selected' : ''}>en preparacion</option>
                        <option value="listo" ${item.estado === 'listo' ? 'selected' : ''}>listo</option>
                        <option value="entregado" ${item.estado === 'entregado' ? 'selected' : ''}>entregado</option>
                        <option value="cancelado" ${item.estado === 'cancelado' ? 'selected' : ''}>cancelado</option>
                    </select>
                </td>
                <td>
                    <button class="btn-editar" onclick="verDetalle(${item.id_pedido})">
                        <i class="fa-solid fa-eye"></i> Ver detalle
                    </button>
                </td>
            </tr>
        `;
    });
}

/**
 * Filtra los pedidos por ID o por nombre del cliente.
 */
function buscarPedido() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtrados = todosLosPedidos.filter(item =>
        String(item.id_pedido).toLowerCase().includes(texto) ||
        (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(texto))
    );
    mostrarPedidos(filtrados);
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ACTUALIZACIÓN DE ESTADO Y CONSULTA DE DETALLE
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Modifica el estado de un pedido (ej: pasa a preparación o entregado).
 * @param {number} id_pedido - Identificador del pedido.
 * @param {string} estado - Nuevo estado del pedido.
 */
async function cambiarEstado(id_pedido, estado) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/pedidos/estado/${id_pedido}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ estado })
        });

        if (res.ok) {
            cargarPedidos();
        } else {
            alert("No se pudo actualizar el estado del pedido.");
        }
    } catch (error) {
        console.error("Error al cambiar estado del pedido:", error);
    }
}

/**
 * Carga y despliega el detalle completo de productos y cliente de un pedido.
 * @param {number} id_pedido - Identificador del pedido a inspeccionar.
 */
async function verDetalle(id_pedido) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/pedidos/detalle/${id_pedido}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "No se pudo cargar el detalle del pedido");
            return;
        }

        document.getElementById("detalle-id").textContent = id_pedido;
        document.getElementById("detalle-cliente").textContent = data.pedido.nombre_cliente;
        document.getElementById("detalle-telefono").textContent = data.pedido.telefono;
        document.getElementById("detalle-tipo").textContent = data.pedido.tipo_entrega;
        document.getElementById("detalle-notas").textContent = data.pedido.notas || "Ninguna";
        document.getElementById("detalle-total").textContent = `$${Number(data.pedido.total).toLocaleString()}`;

        const tbody = document.getElementById("detalle-productos");
        tbody.innerHTML = "";
        data.detalle.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nombre_producto}</td>
                    <td>${item.cantidad}</td>
                    <td>$${Number(item.precio_unitario).toLocaleString()}</td>
                    <td>$${Number(item.subtotal).toLocaleString()}</td>
                </tr>
            `;
        });

        document.getElementById("modalDetalle").style.display = "flex";
    } catch (error) {
        console.error("Error al ver detalle del pedido:", error);
    }
}

/**
 * Cierra la ventana modal del detalle de pedido.
 */
function cerrarDetalle() {
    const modal = document.getElementById("modalDetalle");
    if (modal) modal.style.display = "none";
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", cargarPedidos);