/**
 * @file authRoutes.js
 * @description Rutas de autenticación. Define los endpoints para login,
 *              registro y recuperación de contraseña.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login → Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/login/registrarse → Crear nuevo usuario
router.post('/login/registrarse', authController.registrarse);

// POST /api/auth/login/recuperar-contrasena → Recuperar contraseña
router.post('/login/recuperar-contrasena', authController.recuperarContrasena);

module.exports = router;
