/**
 * @file insumoDAO.js
 * @description Data Access Object (DAO) para la tabla `insumos`.
 *              Encapsula todas las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const insumoDAO = {
    /**
     * Inserta un nuevo insumo en la base de datos.
     * @param {string} nombre
     * @param {string} unidad
     * @param {number} cantidad
     * @param {number} stock
     * @returns {Promise<Object>}
     */
    agregar: (nombre, unidad, cantidad, stock) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO insumos (nombre, unidad_medida, cantidad_disponible, stock_minimo) VALUES (?, ?, ?, ?)';
            db.query(sql, [nombre, unidad, cantidad, stock], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna todos los insumos activos.
     * @returns {Promise<Array>}
     */
    consultarTodos: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM insumos WHERE activo = 1';
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Actualiza un insumo existente por su ID.
     * @param {number} id
     * @param {string} nombre
     * @param {string} unidad_medida
     * @param {number} cantidad_disponible
     * @param {number} stock_minimo
     * @returns {Promise<Object>}
     */
    actualizar: (id, nombre, unidad_medida, cantidad_disponible, stock_minimo) => {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE insumos SET
                nombre = ?,
                unidad_medida = ?,
                cantidad_disponible = ?,
                stock_minimo = ?
                WHERE id_insumo = ?`;
            db.query(sql, [nombre, unidad_medida, cantidad_disponible, stock_minimo, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Realiza un borrado lógico (activo = 0) de un insumo por su ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    eliminar: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE insumos SET activo = 0 WHERE id_insumo = ?';
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna los insumos activos con stock menor o igual al mínimo.
     * @returns {Promise<Array>}
     */
    obtenerAlertas: () => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id_insumo, nombre, cantidad_disponible, stock_minimo
                FROM insumos
                WHERE cantidad_disponible <= stock_minimo AND activo = 1
            `;
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Incrementa la cantidad disponible de un insumo.
     * @param {number} id_insumo
     * @param {number} cantidad
     * @returns {Promise<Object>}
     */
    sumarCantidad: (id_insumo, cantidad) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible + ? WHERE id_insumo = ?';
            db.query(sql, [cantidad, id_insumo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Decrementa la cantidad disponible de un insumo validando que exista stock suficiente.
     * @param {number} id_insumo
     * @param {number} cantidad
     * @returns {Promise<Object>}
     */
    restarCantidad: (id_insumo, cantidad) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible - ? WHERE id_insumo = ? AND cantidad_disponible >= ?';
            db.query(sql, [cantidad, id_insumo, cantidad], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = insumoDAO;

