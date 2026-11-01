/**
 * @file insumoRoutes.js
 * @description Rutas de insumos. Define los endpoints CRUD para la gestión
 *              del inventario de insumos y las alertas de bajo stock.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/insumoController');
const verificarToken = require('../middlewares/verificarToken');

// POST /api/auth/agregar → Agregar nuevo insumo
router.post('/agregar', verificarToken, insumoController.agregar);

// GET /api/auth/consultar → Consultar todos los insumos (requiere auth)
router.get('/consultar', verificarToken, insumoController.consultar);

// PUT /api/auth/actualizar/:id_insumo → Actualizar insumo por ID
router.put('/actualizar/:id_insumo', verificarToken, insumoController.actualizar);

// DELETE /api/auth/eliminar/:id_insumo → Eliminar insumo por ID
router.delete('/eliminar/:id_insumo', verificarToken, insumoController.eliminar);

// GET /api/auth/insumos/alertas → Obtener insumos con bajo stock (requiere auth)
router.get('/insumos/alertas', verificarToken, insumoController.obtenerAlertas);

module.exports = router;
