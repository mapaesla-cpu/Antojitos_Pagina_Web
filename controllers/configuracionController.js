/**
 * @file configuracionController.js
 * @description Controlador de configuración del negocio y gestión de contraseñas.
 *              Maneja la consulta y actualización de la configuración general,
 *              y el cambio de contraseña del usuario autenticado.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const configuracionModel = require('../models/configuracionModel');
const usuarioModel = require('../models/usuarioModel');

/** Clave secreta para verificar tokens JWT. */
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Retorna la configuración general del negocio.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultar = async (req, res) => {
    try {
        const config = await configuracionModel.consultar();
        res.json(config);
    } catch (error) {
        console.error('Error al consultar configuración:', error);
        res.status(500).json({ error: 'Error al consultar' });
    }
};

/**
 * Actualiza los datos de configuración general del negocio.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre_negocio - Nombre del negocio.
 * @param {string} req.body.nit - NIT o RUT.
 * @param {string} req.body.telefono - Teléfono de contacto.
 * @param {string} req.body.direccion - Dirección física.
 * @param {string} req.body.horario_apertura - Hora de apertura.
 * @param {string} req.body.horario_cierre - Hora de cierre.
 * @param {string} req.body.dias_atencion - Días de atención.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const actualizar = async (req, res) => {
    const { nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion } = req.body;
    try {
        await configuracionModel.actualizar(nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion);
        res.json({ mensaje: 'Configuración actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

/**
 * Cambia la contraseña del usuario autenticado.
 * Verifica primero la contraseña actual antes de actualizar.
 * Requiere token JWT válido en el encabezado Authorization.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.headers.authorization - Token JWT en formato "Bearer <token>".
 * @param {string} req.body.password_actual - Contraseña actual del usuario.
 * @param {string} req.body.password_nueva - Nueva contraseña deseada.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const cambiarPassword = async (req, res) => {
    const { password_actual, password_nueva } = req.body;

    // 1. Validar que el token JWT esté presente
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const idUsuario = decoded.id;

    try {
        // 2. Buscar al usuario en la base de datos
        const results = await usuarioModel.buscarPorId(idUsuario);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        // 3. Verificar que la contraseña actual sea correcta
        const match = await bcrypt.compare(password_actual, usuario.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        // 4. Encriptar la nueva contraseña y guardarla
        const nuevoHash = await bcrypt.hash(password_nueva, 10);
        await usuarioModel.actualizarContrasena(idUsuario, nuevoHash);

        res.json({ mensaje: 'Contraseña actualizada correctamente. Inicie sesión nuevamente' });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar contraseña' });
    }
};

module.exports = {
    consultar,
    actualizar,
    cambiarPassword
};
