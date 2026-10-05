/**
 * @file authRoutes.js
 * @description Rutas de autenticación. Define los endpoints para login,
 *              registro y recuperación de contraseña.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/verificarToken');

/**
 * Rate limiter para login: máximo 10 intentos por IP cada 15 minutos.
 * Previene ataques de fuerza bruta.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos. Intente de nuevo en 15 minutos.' }
});

// POST /api/auth/login → Iniciar sesión (con rate limiting)
router.post('/login', loginLimiter, authController.login);

// POST /api/auth/login/registrarse → Crear nuevo usuario (requiere autenticación)
router.post('/login/registrarse', verificarToken, authController.registrarse);

// POST /api/auth/login/recuperar-contrasena → Recuperar contraseña
router.post('/login/recuperar-contrasena', authController.recuperarContrasena);


module.exports = router;

