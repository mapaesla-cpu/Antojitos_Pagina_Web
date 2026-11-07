/**
 * @file usuarioModel.js
 * @description Modelo de usuarios. Representa la lógica de dominio de usuarios
 *              y delega el acceso a datos al DAO correspondiente (`usuarioDAO`).
 */

const usuarioDAO = require('../dao/usuarioDAO');

/**
 * Busca un usuario en la base de datos por su correo electrónico.
 *
 * @param {string} correo - Correo del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados (vacío si no existe).
 */
const buscarPorCorreo = (correo) => {
    return usuarioDAO.buscarPorCorreo(correo);
};

/**
 * Busca un usuario en la base de datos por su ID.
 *
 * @param {number} id - ID del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados.
 */
const buscarPorId = (id) => {
    return usuarioDAO.buscarPorId(id);
};

/**
 * Inserta un nuevo usuario en la base de datos.
 *
 * @param {string} nombre - Nombre completo del usuario.
 * @param {string} correo - Correo electrónico del usuario.
 * @param {string} hash - Contraseña ya encriptada con bcrypt.
 * @param {string} rol - Rol del usuario ('admin' | 'cliente').
 * @returns {Promise<Object>} Resultado de la inserción (incluye `insertId`).
 */
const crearUsuario = (nombre, correo, hash, rol) => {
    return usuarioDAO.crearUsuario(nombre, correo, hash, rol);
};

/**
 * Actualiza la contraseña de un usuario.
 *
 * @param {number} id - ID del usuario a actualizar.
 * @param {string} nuevoHash - Nueva contraseña encriptada con bcrypt.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizarContrasena = (id, nuevoHash) => {
    return usuarioDAO.actualizarContrasena(id, nuevoHash);
};

/**
 * Busca el nombre y el rol del usuario que inicia sesión por su ID.
 *
 * @param {string|number} id - ID del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados (vacío si no existe).
 */
const usuarioSesion = (id) => {
    return usuarioDAO.usuarioSesion(id);
};

module.exports = {
    buscarPorCorreo,
    buscarPorId,
    crearUsuario,
    actualizarContrasena,
    usuarioSesion
};
