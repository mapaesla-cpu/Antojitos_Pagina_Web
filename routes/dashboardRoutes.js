/**
 * @file dashboardRoutes.js
 * @description Rutas del dashboard. Define los endpoints para obtener estadísticas
 *              generales y productos populares del negocio.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verificarToken = require('../middlewares/verificarToken');

// GET /api/auth/dashboard/estadisticas → Estadísticas generales del negocio (requiere auth)
router.get('/dashboard/estadisticas', verificarToken, dashboardController.obtenerEstadisticas);

// GET /api/auth/dashboard/estadisticasmenu → 5 productos más populares para el menú
router.get('/dashboard/estadisticasmenu', dashboardController.obtenerProductosPopulares);

module.exports = router;
