/**
 * @file categoriaDAO.js
 * @description Data Access Object (DAO) para la tabla `categorias`.
 *              Encapsula todas las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const categoriaDAO = {
    /**
     * Inserta una nueva categoría en la base de datos.
     * @param {string} nombre
     * @param {string} descripcion
     * @param {string|number} estado
     * @returns {Promise<Object>}
     */
    agregar: (nombre, descripcion, estado) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, ?)';
            db.query(sql, [nombre, descripcion, estado], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna todas las categorías registradas.
     * @returns {Promise<Array>}
     */
    consultarTodas: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM categorias';
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Actualiza los datos de una categoría por su ID.
     * @param {number} id
     * @param {string} nombre
     * @param {string} descripcion
     * @param {string|number} estado
     * @returns {Promise<Object>}
     */
    actualizar: (id, nombre, descripcion, estado) => {
        return new Promise((resolve, reject) => {
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
    },

    /**
     * Cambia el estado de una categoría por su ID.
     * @param {number} id
     * @param {string|number} estado
     * @returns {Promise<Object>}
     */
    cambiarEstado: (id, estado) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE categorias SET estado = ? WHERE id_categoria = ?';
            db.query(sql, [estado, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = categoriaDAO;

