/**
 * @file inventarioDAO.js
 * @description Data Access Object (DAO) para movimientos de inventario
 *              y descuento de insumos por pedido.
 */

const db = require('../db');

const inventarioDAO = {
    /**
     * Registra un movimiento de entrada o salida en `movimientos_inventario`.
     * @param {number} id_insumo
     * @param {'entrada'|'salida'} tipo_movimiento
     * @param {number} cantidad
     * @param {string} motivo
     * @param {number} id_usuario
     * @returns {Promise<Object>}
     */
    registrarMovimiento: (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO movimientos_inventario (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [id_insumo, tipo_movimiento, cantidad, motivo, id_usuario], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Obtiene los productos y cantidades asociadas a un pedido.
     * @param {number} id_pedido
     * @returns {Promise<Array>}
     */
    obtenerDetallePedido: (id_pedido) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id_producto, cantidad FROM detalle_pedidos WHERE id_pedido = ?';
            db.query(sql, [id_pedido], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Obtiene los insumos y cantidades requeridas por un producto.
     * @param {number} id_producto
     * @returns {Promise<Array>}
     */
    obtenerInsumosPorProducto: (id_producto) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id_insumo, cantidad_requerida FROM producto_insumos WHERE id_producto = ?';
            db.query(sql, [id_producto], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Descuenta directamente una cantidad del stock disponible de un insumo.
     * @param {number} id_insumo
     * @param {number} cantidad
     * @returns {Promise<Object>}
     */
    descontarInsumo: (id_insumo, cantidad) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible - ? WHERE id_insumo = ?';
            db.query(sql, [cantidad, id_insumo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = inventarioDAO;

