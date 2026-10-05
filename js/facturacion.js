/**
 * @file facturacion.js
 * @description Módulo frontend para la consulta, visualización e impresión
 *              de facturas generadas por los pedidos del restaurante.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  ESTADO GLOBAL
 * ══════════════════════════════════════════════════════════════════════════ */

/** @type {Array<Object>} Lista de facturas cargadas desde el backend */
let todasLasFacturas = [];

/* ══════════════════════════════════════════════════════════════════════════
 *  CONSULTA Y LISTADO DE FACTURAS
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta todas las facturas registradas en el backend con token JWT.
 */
async function cargarFacturas() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/facturas/consultar", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        todasLasFacturas = Array.isArray(data) ? data : [];
        mostrarFacturas(todasLasFacturas);
    } catch (error) {
        console.error("Error al cargar facturas:", error);
    }
}

/**
 * Renderiza la lista de facturas en la tabla de facturación.
 * @param {Array<Object>} facturas - Arreglo de facturas a mostrar.
 */
function mostrarFacturas(facturas) {
    const tabla = document.getElementById("tablaBody");
    if (!tabla) return;
    tabla.innerHTML = "";

    facturas.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.numero_factura}</td>
                <td>${new Date(item.fecha_emision).toLocaleDateString()}</td>
                <td>${item.nombre_cliente}</td>
                <td>$${Number(item.total).toLocaleString()}</td>
                <td>${item.estado}</td>
                <td>
                    <button class="btn-editar" onclick="verFactura(${item.id_factura})">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                </td>
            </tr>
        `;
    });
}

/**
 * Filtra las facturas por número de factura o nombre del cliente.
 */
function buscarFactura() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtradas = todasLasFacturas.filter(f =>
        (f.numero_factura && f.numero_factura.toLowerCase().includes(texto)) ||
        (f.nombre_cliente && f.nombre_cliente.toLowerCase().includes(texto))
    );
    mostrarFacturas(filtradas);
}

/* ══════════════════════════════════════════════════════════════════════════
 *  DETALLE E IMPRESIÓN DE FACTURA
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Obtiene el detalle de una factura y lo muestra en el modal de factura.
 * @param {number} id - Identificador de la factura.
 */
async function verFactura(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/facturas/ver/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "No se pudo cargar la factura");
            return;
        }

        document.getElementById("factura-numero").textContent = data.factura.numero_factura;
        document.getElementById("factura-fecha").textContent = new Date(data.factura.fecha_emision).toLocaleDateString();
        document.getElementById("factura-cliente").textContent = data.factura.nombre_cliente;
        document.getElementById("factura-telefono").textContent = data.factura.telefono;
        document.getElementById("factura-tipo").textContent = data.factura.tipo_entrega;
        document.getElementById("factura-subtotal").textContent = `$${Number(data.factura.subtotal).toLocaleString()}`;
        document.getElementById("factura-impuesto").textContent = `$${Number(data.factura.impuesto).toLocaleString()}`;
        document.getElementById("factura-total").textContent = `$${Number(data.factura.total).toLocaleString()}`;

        const tbody = document.getElementById("factura-productos");
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

        document.getElementById("modalFactura").style.display = "flex";
    } catch (error) {
        console.error("Error al consultar factura:", error);
    }
}

/**
 * Cierra la ventana modal de visualización de factura.
 */
function cerrarFactura() {
    const modal = document.getElementById("modalFactura");
    if (modal) modal.style.display = "none";
}

/**
 * Abre una ventana emergente para imprimir el contenido de la factura visible.
 */
function imprimirFactura() {
    const contenido = document.getElementById("contenido-factura").innerHTML;
    const ventana = window.open("", "_blank");
    ventana.document.write(`
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Factura</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .factura-nota { margin-top: 20px; font-size: 12px; color: gray; }
                    .factura-botones { display: none; }
                </style>
            </head>
            <body>${contenido}</body>
        </html>
    `);
    ventana.document.close();
    ventana.print();
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", cargarFacturas);