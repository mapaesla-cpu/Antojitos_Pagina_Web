/**
 * @file pedidoRoutes.js
 * @description Rutas de pedidos, detalles y facturas. Define todos los endpoints
 *              para gestionar pedidos y su ciclo de vida completo.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const verificarToken = require('../middlewares/verificarToken');

// ── Pedidos ────────────────────────────────────────────────────────────────

// POST /api/auth/pedidos/agregar → Registrar nuevo pedido (genera factura automáticamente)
router.post('/pedidos/agregar', pedidoController.agregar);

// GET /api/auth/pedidos/consultar → Listar todos los pedidos (requiere auth)
router.get('/pedidos/consultar', verificarToken, pedidoController.consultar);

// PUT /api/auth/pedidos/estado/:id → Cambiar estado del pedido (requiere auth)
router.put('/pedidos/estado/:id', verificarToken, pedidoController.cambiarEstado);

// GET /api/auth/pedidos/detalle/:id → Ver detalle completo de un pedido (requiere auth)
router.get('/pedidos/detalle/:id', verificarToken, pedidoController.verDetalle);

// GET /api/auth/pedidos/consultar/:id_pedido → Consulta pública de estado (sin auth)
router.get('/pedidos/consultar/:id_pedido', pedidoController.consultarEstadoPublico);

// ── Detalle de pedidos ─────────────────────────────────────────────────────

// POST /api/auth/detalle/agregar → Registrar producto en detalle del pedido
router.post('/detalle/agregar', pedidoController.agregarDetalle);

// ── Facturas ───────────────────────────────────────────────────────────────

// GET /api/auth/facturas/consultar → Listar todas las facturas (requiere auth)
router.get('/facturas/consultar', verificarToken, pedidoController.consultarFacturas);

// GET /api/auth/facturas/ver/:id → Ver factura detallada (requiere auth)
router.get('/facturas/ver/:id', verificarToken, pedidoController.verFactura);

module.exports = router;
