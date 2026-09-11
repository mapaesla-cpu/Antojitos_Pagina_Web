/**
 * @file inventarioModel.js
 * @description Modelo de inventario. Contiene las consultas SQL para movimientos
 *              de inventario y el descuento automático de insumos al completar pedidos.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

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
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO movimientos_inventario (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [id_insumo, tipo_movimiento, cantidad, motivo, id_usuario], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Obtiene todos los productos de un pedido (para luego descontar sus insumos).
 *
 * @param {number} id_pedido - ID del pedido.
 * @returns {Promise<Array>} Lista de {id_producto, cantidad}.
 */
const obtenerDetallePedido = (id_pedido) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id_producto, cantidad FROM detalle_pedidos WHERE id_pedido = ?';
        db.query(sql, [id_pedido], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Retorna los insumos necesarios para fabricar un producto.
 *
 * @param {number} id_producto - ID del producto.
 * @returns {Promise<Array>} Lista de {id_insumo, cantidad_requerida}.
 */
const obtenerInsumosPorProducto = (id_producto) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id_insumo, cantidad_requerida FROM producto_insumos WHERE id_producto = ?';
        db.query(sql, [id_producto], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Descuenta una cantidad determinada del stock de un insumo.
 *
 * @param {number} id_insumo - ID del insumo a descontar.
 * @param {number} cantidad - Cantidad a restar del stock.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const descontarInsumo = (id_insumo, cantidad) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible - ? WHERE id_insumo = ?';
        db.query(sql, [cantidad, id_insumo], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    registrarMovimiento,
    obtenerDetallePedido,
    obtenerInsumosPorProducto,
    descontarInsumo
};
