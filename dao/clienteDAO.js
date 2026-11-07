/**
 * @file clienteDAO.js
 * @description Data Access Object (DAO) para la tabla `clientes`.
 *              Encapsula las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const clienteDAO = {
    /**
     * Inserta un nuevo cliente en la base de datos.
     * @param {string} nombre
     * @param {string} telefono
     * @param {string} direccion
     * @param {string} correo
     * @param {Date} fecha_registro
     * @returns {Promise<Object>}
     */
    agregar: (nombre, telefono, direccion, correo, fecha_registro) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO clientes (nombre, telefono, direccion, correo, fecha_registro) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nombre, telefono, direccion, correo, fecha_registro], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = clienteDAO;

