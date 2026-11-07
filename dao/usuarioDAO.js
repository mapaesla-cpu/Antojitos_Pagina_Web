/**
 * @file usuarioDAO.js
 * @description Data Access Object (DAO) para la tabla `usuarios`.
 *              Encapsula todas las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const usuarioDAO = {
    /**
     * Busca un usuario por su correo electrónico.
     * @param {string} correo
     * @returns {Promise<Array>}
     */
    buscarPorCorreo: (correo) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuarios WHERE correo = ?';
            db.query(sql, [correo], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Busca un usuario por su ID.
     * @param {number} id
     * @returns {Promise<Array>}
     */
    buscarPorId: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Inserta un nuevo usuario en la tabla `usuarios`.
     * @param {string} nombre
     * @param {string} correo
     * @param {string} hash
     * @param {string} rol
     * @returns {Promise<Object>}
     */
    crearUsuario: (nombre, correo, hash, rol) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
            db.query(sql, [nombre, correo, hash, rol], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Actualiza la contraseña encriptada de un usuario.
     * @param {number} id
     * @param {string} nuevoHash
     * @returns {Promise<Object>}
     */
    actualizarContrasena: (id, nuevoHash) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?';
            db.query(sql, [nuevoHash, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Obtiene el nombre y rol del usuario en sesión por su ID.
     * @param {number|string} id
     * @returns {Promise<Array>}
     */
    usuarioSesion: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT nombre, rol FROM usuarios WHERE id_usuario = ?';
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = usuarioDAO;

