/**
 * @file insumoModel.js
 * @description Modelo de insumos. Contiene las consultas SQL de la tabla `insumos`.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

/**
 * Inserta un nuevo insumo en la base de datos.
 *
 * @param {string} nombre - Nombre del insumo.
 * @param {string} unidad - Unidad de medida (kg, litros, unidades, etc.).
 * @param {number} cantidad - Cantidad disponible inicial.
 * @param {number} stock - Stock mínimo requerido antes de alertar.
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregar = (nombre, unidad, cantidad, stock) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO insumos (nombre, unidad_medida, cantidad_disponible, stock_minimo) VALUES (?, ?, ?, ?)';
        db.query(sql, [nombre, unidad, cantidad, stock], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna todos los insumos registrados.
 *
 * @returns {Promise<Array>} Lista de insumos.
 */
const consultarTodos = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM insumos WHERE activo = 1';
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Actualiza un insumo existente.
 *
 * @param {number} id - ID del insumo a actualizar.
 * @param {string} nombre - Nuevo nombre del insumo.
 * @param {string} unidad_medida - Nueva unidad de medida.
 * @param {number} cantidad_disponible - Nueva cantidad disponible.
 * @param {number} stock_minimo - Nuevo stock mínimo.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (id, nombre, unidad_medida, cantidad_disponible, stock_minimo) => {
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
};

/**
 * Elimina un insumo por su ID.
 *
 * @param {number} id - ID del insumo a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
const eliminar = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE insumos SET activo = 0 WHERE id_insumo = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna los insumos cuyo stock actual está por debajo del mínimo.
 *
 * @returns {Promise<Array>} Lista de insumos en alerta de bajo stock.
 */
const obtenerAlertas = () => {
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
};

/**
 * Suma una cantidad a un insumo (entrada de inventario).
 *
 * @param {number} id_insumo - ID del insumo.
 * @param {number} cantidad - Cantidad a sumar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const sumarCantidad = (id_insumo, cantidad) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible + ? WHERE id_insumo = ?';
        db.query(sql, [cantidad, id_insumo], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Resta una cantidad a un insumo (salida de inventario).
 *
 * @param {number} id_insumo - ID del insumo.
 * @param {number} cantidad - Cantidad a restar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const restarCantidad = (id_insumo, cantidad) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE insumos SET cantidad_disponible = cantidad_disponible - ? WHERE id_insumo = ? AND cantidad_disponible >= ?';
        db.query(sql, [cantidad, id_insumo, cantidad], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    agregar,
    consultarTodos,
    actualizar,
    eliminar,
    obtenerAlertas,
    sumarCantidad,
    restarCantidad
};
