/**
 * @file inventarioModel.js
 * @description Modelo de inventario. Gestiona los movimientos de inventario y el
 *              descuento automático de insumos delegando el acceso a datos a `inventarioDAO`.
 */

const inventarioDAO = require('../dao/inventarioDAO');

/**
 * Registra un movimiento (entrada o salida) en el historial de inventario.
 *
 * @param {number} id_insumo - ID del insumo movido.
 * @param {'entrada'|'salida'} tipo_movimiento - Tipo de movimiento.
 * @param {number} cantidad - Cantidad involucrada en el movimiento.
 * @param {string} motivo - Razón o descripción del movimiento.
 * @param {number} id_usuario - ID del usuario que registró el movimiento.
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const registrarMovimiento = (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) => {
    return inventarioDAO.registrarMovimiento(id_insumo, tipo_movimiento, cantidad, motivo, id_usuario);
};

/**
 * Obtiene todos los productos de un pedido (para luego descontar sus insumos).
 *
 * @param {number} id_pedido - ID del pedido.
 * @returns {Promise<Array>} Lista de {id_producto, cantidad}.
 */
const obtenerDetallePedido = (id_pedido) => {
    return inventarioDAO.obtenerDetallePedido(id_pedido);
};

/**
 * Retorna los insumos necesarios para fabricar un producto.
 *
 * @param {number} id_producto - ID del producto.
 * @returns {Promise<Array>} Lista de {id_insumo, cantidad_requerida}.
 */
const obtenerInsumosPorProducto = (id_producto) => {
    return inventarioDAO.obtenerInsumosPorProducto(id_producto);
};

/**
 * Descuenta una cantidad determinada del stock de un insumo.
 *
 * @param {number} id_insumo - ID del insumo a descontar.
 * @param {number} cantidad - Cantidad a restar del stock.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const descontarInsumo = (id_insumo, cantidad) => {
    return inventarioDAO.descontarInsumo(id_insumo, cantidad);
};

module.exports = {
    registrarMovimiento,
    obtenerDetallePedido,
    obtenerInsumosPorProducto,
    descontarInsumo
};
