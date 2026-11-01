/**
 * @file usuarioController.js
 * @description Controlador de usuario. Maneja la consulta de datos de sesión
 *              del usuario autenticado (nombre y rol) para el sidebar administrativo.
 */

const usuarioModel = require('../models/usuarioModel');

/**
 * Retorna el nombre y rol del usuario autenticado.
 * El middleware verificarToken ya validó el JWT y colocó los datos en req.usuario.
 *
 * @param {import('express').Request} req - Objeto de petición (con req.usuario del middleware).
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {void} Responde con JSON: { nombre, rol } o error.
 */
const usuSesion = async (req, res) => {
    const idUsuario = req.usuario.id;

    try {
        const results = await usuarioModel.usuarioSesion(idUsuario);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        res.json({ nombre: usuario.nombre, rol: usuario.rol });

    } catch (error) {
        console.error('Error al consultar usuario:', error);
        res.status(500).json({ error: 'Error al consultar usuario' });
    }
};

module.exports = {
    usuSesion
};
