/**
 * @file usuarioModel.js
 * @description Modelo de usuarios. Contiene únicamente las consultas SQL
 *              relacionadas con la tabla `usuarios`. Todas las funciones
 *              retornan Promesas para un manejo asíncrono limpio.
 */

const db = require('../db');

/**
 * Busca un usuario en la base de datos por su correo electrónico.
 *
 * @param {string} correo - Correo del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados (vacío si no existe).
 */
const buscarPorCorreo = (correo) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE correo = ?';
        db.query(sql, [correo], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Busca un usuario en la base de datos por su ID.
 *
 * @param {number} id - ID del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados.
 */
const buscarPorId = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
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
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
        db.query(sql, [nombre, correo, hash, rol], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Actualiza la contraseña de un usuario.
 *
 * @param {number} id - ID del usuario a actualizar.
 * @param {string} nuevoHash - Nueva contraseña encriptada con bcrypt.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizarContrasena = (id, nuevoHash) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?';
        db.query(sql, [nuevoHash, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Busca el nombre y el rol del usuario que inicia sesión, en la base de datos por su correo electrónico.
 *
 * @param {string} correo - Correo del usuario a buscar.
 * @returns {Promise<Array>} Arreglo con los resultados (vacío si no existe).
 */
const usuarioSesion = (correo) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT nombre,rol FROM usuarios WHERE correo = ?';
        db.query(sql, [correo], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    buscarPorCorreo,
    buscarPorId,
    crearUsuario,
    actualizarContrasena,
    usuarioSesion
};
