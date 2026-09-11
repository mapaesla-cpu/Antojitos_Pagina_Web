/**
 * @file categoriaModel.js
 * @description Modelo de categorías. Contiene las consultas SQL de la tabla `categorias`.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

/**
 * Inserta una nueva categoría en la base de datos.
 *
 * @param {string} nombre - Nombre de la categoría.
 * @param {string} descripcion - Descripción de la categoría.
 * @param {number} estado - Estado de la categoría (1 = activo, 0 = inactivo).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregar = (nombre, descripcion, estado) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, ?)';
        db.query(sql, [nombre, descripcion, estado], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna todas las categorías registradas.
 *
 * @returns {Promise<Array>} Lista de categorías.
 */
const consultarTodas = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM categorias';
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Actualiza los datos de una categoría existente.
 *
 * @param {number} id - ID de la categoría a actualizar.
 * @param {string} nombre - Nuevo nombre de la categoría.
 * @param {string} descripcion - Nueva descripción.
 * @param {number} estado - Nuevo estado (1 = activo, 0 = inactivo).
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (id, nombre, descripcion, estado) => {
    return new Promise((resolve, reject) => {
        // CORRECCIÓN: Se asegura la coma antes de WHERE en la plantilla SQL
        const sql = `UPDATE categorias SET
            nombre = ?,
            descripcion = ?,
            estado = ?
            WHERE id_categoria = ?`;
        db.query(sql, [nombre, descripcion, estado, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Cambia únicamente el estado (activo/inactivo) de una categoría.
 *
 * @param {number} id - ID de la categoría.
 * @param {number} estado - Nuevo estado a asignar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarEstado = (id, estado) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE categorias SET estado = ? WHERE id_categoria = ?';
        db.query(sql, [estado, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    agregar,
    consultarTodas,
    actualizar,
    cambiarEstado
};
