/**
 * @file inventarioRoutes.js
 * @description Rutas de inventario. Define los endpoints para registrar entradas,
 *              salidas y el descuento automático de insumos al procesar pedidos.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// POST /api/auth/insumos/entrada → Registrar entrada de insumos (requiere JWT)
router.post('/insumos/entrada', inventarioController.registrarEntrada);

// POST /api/auth/insumos/salida → Registrar salida de insumos (requiere JWT)
router.post('/insumos/salida', inventarioController.registrarSalida);

// POST /api/auth/inventario/descontar → Descontar insumos al confirmar pedido
router.post('/inventario/descontar', inventarioController.descontarInventario);

module.exports = router;
