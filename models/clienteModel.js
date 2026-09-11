/**
 * @file clienteModel.js
 * @description Modelo de clientes. Contiene las consultas SQL de la tabla `clientes`.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

/**
 * Registra un nuevo cliente en la base de datos.
 *
 * @param {string} nombre - Nombre completo del cliente.
 * @param {string} telefono - Número de teléfono del cliente.
 * @param {string} direccion - Dirección de entrega del cliente.
 * @param {string} correo - Correo electrónico del cliente.
 * @returns {Promise<Object>} Resultado de la inserción (incluye `insertId` con el nuevo ID).
 */
const agregar = (nombre, telefono, direccion, correo) => {
    return new Promise((resolve, reject) => {
        const fecha_registro = new Date();
        const sql = 'INSERT INTO clientes (nombre, telefono, direccion, correo, fecha_registro) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nombre, telefono, direccion, correo, fecha_registro], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    agregar
};
