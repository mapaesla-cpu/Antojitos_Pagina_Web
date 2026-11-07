/**
 * @file pedidoModel.js
 * @description Modelo de pedidos y facturas. Contiene las reglas de negocio (como el
 *              estado inicial del pedido y el cálculo de IVA de facturación) y delega
 *              la persistencia SQL a `pedidoDAO`.
 */

const pedidoDAO = require('../dao/pedidoDAO');

// ── Pedidos ────────────────────────────────────────────────────────────────

/**
 * Crea un nuevo pedido asignando fecha actual y estado inicial 'pendiente'.
 *
 * @param {number} id_cliente - ID del cliente que realiza el pedido.
 * @param {string} tipo_entrega - Modalidad de entrega ('domicilio' | 'local').
 * @param {string} metodo_pago - Método de pago ('efectivo' | 'tarjeta', etc.).
 * @param {number} total - Monto total del pedido.
 * @param {string} notas - Notas adicionales del pedido (puede ser vacío).
 * @returns {Promise<Object>} Resultado con `insertId` del nuevo pedido.
 */
const agregar = (id_cliente, tipo_entrega, metodo_pago, total, notas) => {
    const fecha_pedido = new Date();
    const estado = 'pendiente';
    return pedidoDAO.agregar(id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas);
};

/**
 * Retorna todos los pedidos con datos del cliente asociado, ordenados por fecha descendente.
 *
 * @returns {Promise<Array>} Lista de pedidos con nombre y teléfono del cliente.
 */
const consultarTodos = () => {
    return pedidoDAO.consultarTodos();
};

/**
 * Cambia el estado de un pedido (pendiente → en preparacion → listo → entregado | cancelado).
 *
 * @param {number} id - ID del pedido.
 * @param {string} estado - Nuevo estado del pedido.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarEstado = (id, estado) => {
    return pedidoDAO.cambiarEstado(id, estado);
};

/**
 * Consulta el detalle completo de un pedido (cabecera + productos incluidos).
 *
 * @param {number} id - ID del pedido.
 * @returns {Promise<Object>} Objeto con `pedido` (cabecera) y `detalle` (productos).
 */
const verDetalle = (id) => {
    return pedidoDAO.verDetalle(id);
};

/**
 * Consulta únicamente el ID y estado de un pedido (ruta pública para clientes).
 *
 * @param {number} id_pedido - ID del pedido a rastrear.
 * @returns {Promise<Object|null>} Objeto con `id_pedido` y `estado`, o null si no existe.
 */
const consultarEstadoPublico = (id_pedido) => {
    return pedidoDAO.consultarEstadoPublico(id_pedido);
};

// ── Detalle de pedidos ─────────────────────────────────────────────────────

/**
 * Registra un producto dentro del detalle de un pedido.
 *
 * @param {number} id_pedido - ID del pedido al que pertenece.
 * @param {number} id_producto - ID del producto.
 * @param {number} cantidad - Cantidad de unidades del producto.
 * @param {number} precio_unitario - Precio por unidad en el momento del pedido.
 * @param {number} subtotal - Total de esta línea (cantidad × precio_unitario).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregarDetalle = (id_pedido, id_producto, cantidad, precio_unitario, subtotal) => {
    return pedidoDAO.agregarDetalle(id_pedido, id_producto, cantidad, precio_unitario, subtotal);
};

// ── Facturas ───────────────────────────────────────────────────────────────

/**
 * Crea una factura asociada a un pedido con cálculo automático de IVA (19%).
 *
 * @param {number} id_pedido - ID del pedido al que pertenece la factura.
 * @param {number} total - Total del pedido (con IVA incluido).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const crearFactura = (id_pedido, total) => {
    const numero_factura = `FAC-${Date.now()}`;
    const subtotal = total / 1.19;       // Precio sin IVA
    const impuesto = total - subtotal;   // IVA del 19%
    const fecha_emision = new Date();
    const estado = 'emitida';

    return pedidoDAO.crearFactura(
        id_pedido,
        numero_factura,
        fecha_emision,
        subtotal.toFixed(2),
        impuesto.toFixed(2),
        total,
        estado
    );
};

/**
 * Retorna todas las facturas con datos del cliente, ordenadas por fecha descendente.
 *
 * @returns {Promise<Array>} Lista de facturas.
 */
const consultarFacturas = () => {
    return pedidoDAO.consultarFacturas();
};

/**
 * Retorna el detalle completo de una factura y sus productos asociados.
 *
 * @param {number} id - ID de la factura.
 * @returns {Promise<Object>} Objeto con `factura` (datos) y `detalle` (productos).
 */
const verFactura = (id) => {
    return pedidoDAO.verFactura(id);
};

module.exports = {
    agregar,
    consultarTodos,
    cambiarEstado,
    verDetalle,
    consultarEstadoPublico,
    agregarDetalle,
    crearFactura,
    consultarFacturas,
    verFactura
};
