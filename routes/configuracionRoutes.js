/**
 * @file configuracionRoutes.js
 * @description Rutas de configuración del negocio. Define los endpoints para
 *              consultar/actualizar la configuración general y cambiar contraseñas.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracionController');

// GET /api/auth/configuracion/consultar → Obtener configuración del negocio
router.get('/configuracion/consultar', configuracionController.consultar);

// PUT /api/auth/configuracion/actualizar → Actualizar configuración del negocio
router.put('/configuracion/actualizar', configuracionController.actualizar);

// PUT /api/auth/configuracion/password → Cambiar contraseña (requiere JWT)
router.put('/configuracion/password', configuracionController.cambiarPassword);

module.exports = router;
