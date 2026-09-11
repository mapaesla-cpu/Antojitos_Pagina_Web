/**
 * @file insumoRoutes.js
 * @description Rutas de insumos. Define los endpoints CRUD para la gestión
 *              del inventario de insumos y las alertas de bajo stock.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/insumoController');

// POST /api/auth/agregar → Agregar nuevo insumo
router.post('/agregar', insumoController.agregar);

// GET /api/auth/consultar → Consultar todos los insumos
router.get('/consultar', insumoController.consultar);

// PUT /api/auth/actualizar/:id_insumo → Actualizar insumo por ID
router.put('/actualizar/:id_insumo', insumoController.actualizar);

// DELETE /api/auth/eliminar/:id_insumo → Eliminar insumo por ID
router.delete('/eliminar/:id_insumo', insumoController.eliminar);

// GET /api/auth/insumos/alertas → Obtener insumos con bajo stock
router.get('/insumos/alertas', insumoController.obtenerAlertas);

module.exports = router;
