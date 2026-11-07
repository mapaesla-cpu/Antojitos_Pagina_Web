/**
 * @file clienteModel.js
 * @description Modelo de clientes. Define las reglas de creación de clientes
 *              y delega la persistencia en base de datos a `clienteDAO`.
 */

const clienteDAO = require('../dao/clienteDAO');

/**
 * Registra un nuevo cliente asignando su fecha de registro actual.
 *
 * @param {string} nombre - Nombre completo del cliente.
 * @param {string} telefono - Número de teléfono del cliente.
 * @param {string} direccion - Dirección de entrega del cliente.
 * @param {string} correo - Correo electrónico del cliente.
 * @returns {Promise<Object>} Resultado de la inserción (incluye `insertId` con el nuevo ID).
 */
const agregar = (nombre, telefono, direccion, correo) => {
    const fecha_registro = new Date();
    return clienteDAO.agregar(nombre, telefono, direccion, correo, fecha_registro);
};

module.exports = {
    agregar
};
