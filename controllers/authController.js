/**
 * @file authController.js
 * @description Controlador de autenticación. Maneja login, registro de usuarios
 *              y recuperación de contraseña. Recibe las peticiones HTTP, invoca
 *              el modelo correspondiente y devuelve la respuesta JSON.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

/** Clave secreta para firmar los tokens JWT desde .env */
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Inicia sesión de un usuario y genera un token JWT válido por 8 horas.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.correo - Correo del usuario.
 * @param {string} req.body.contrasena - Contraseña en texto plano.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {void} Responde con JSON: { mensaje, token, rol } o error.
 */
const login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const results = await usuarioModel.buscarPorCorreo(correo);

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // Genera el token con el ID y rol del usuario
        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

/**
 * Registra un nuevo usuario en el sistema encriptando su contraseña.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre - Nombre del nuevo usuario.
 * @param {string} req.body.correo - Correo del nuevo usuario.
 * @param {string} req.body.contrasena - Contraseña en texto plano.
 * @param {string} req.body.rol - Rol del usuario ('admin' | 'cliente').
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {void} Responde con JSON: { mensaje } o error.
 */
const registrarse = async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;

    try {
        // Encripta la contraseña con bcrypt (salt de 10 rondas)
        const hash = await bcrypt.hash(contrasena, 10);
        await usuarioModel.crearUsuario(nombre, correo, hash, rol);
        res.status(201).json({ mensaje: 'Usuario creado exitosamente!' });

    } catch (error) {
        // Correo duplicado — restricción UNIQUE en la BD
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error al guardar el usuario en la base de datos' });
    }
};

/**
 * Recuperación de contraseña.
 * 
 * @todo Implementar correctamente: enviar correo con link/token temporal
 *       en lugar de comparar contraseña (no existe contraseña al recuperar).
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.correo - Correo del usuario que olvidó su contraseña.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {void} Responde con JSON: { mensaje } o error.
 */
const recuperarContrasena = async (req, res) => {
    const { correo } = req.body;

    try {
        const results = await usuarioModel.buscarPorCorreo(correo);

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // TODO: Implementar envío de correo con token temporal para restablecer contraseña.
        // Por ahora se confirma que el correo existe en el sistema.
        res.json({ mensaje: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña.' });

    } catch (error) {
        console.error('Error en recuperarContrasena:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};


module.exports = {
    login,
    registrarse,
    recuperarContrasena
};
