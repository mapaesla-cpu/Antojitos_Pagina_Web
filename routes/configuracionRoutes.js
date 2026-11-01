/**
 * @file configuracionRoutes.js
 * @description Rutas de configuración del negocio. Define los endpoints para
 *              consultar/actualizar la configuración general y cambiar contraseñas.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracionController');
const verificarToken = require('../middlewares/verificarToken');

// GET /api/auth/configuracion/consultar → Obtener configuración del negocio
router.get('/configuracion/consultar', configuracionController.consultar);

// PUT /api/auth/configuracion/actualizar → Actualizar configuración del negocio (requiere auth)
router.put('/configuracion/actualizar', verificarToken, configuracionController.actualizar);

// PUT /api/auth/configuracion/password → Cambiar contraseña (requiere auth)
router.put('/configuracion/password', verificarToken, configuracionController.cambiarPassword);

module.exports = router;
