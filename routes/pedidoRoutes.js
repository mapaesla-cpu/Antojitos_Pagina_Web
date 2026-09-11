/**
 * @file pedidoRoutes.js
 * @description Rutas de pedidos, detalles y facturas. Define todos los endpoints
 *              para gestionar pedidos y su ciclo de vida completo.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// ── Pedidos ────────────────────────────────────────────────────────────────

// POST /api/auth/pedidos/agregar → Registrar nuevo pedido (genera factura automáticamente)
router.post('/pedidos/agregar', pedidoController.agregar);

// GET /api/auth/pedidos/consultar → Listar todos los pedidos
router.get('/pedidos/consultar', pedidoController.consultar);

// PUT /api/auth/pedidos/estado/:id → Cambiar estado del pedido
router.put('/pedidos/estado/:id', pedidoController.cambiarEstado);

// GET /api/auth/pedidos/detalle/:id → Ver detalle completo de un pedido
router.get('/pedidos/detalle/:id', pedidoController.verDetalle);

// GET /api/auth/pedidos/consultar/:id_pedido → Consulta pública de estado (sin auth)
router.get('/pedidos/consultar/:id_pedido', pedidoController.consultarEstadoPublico);

// ── Detalle de pedidos ─────────────────────────────────────────────────────

// POST /api/auth/detalle/agregar → Registrar producto en detalle del pedido
router.post('/detalle/agregar', pedidoController.agregarDetalle);

// ── Facturas ───────────────────────────────────────────────────────────────

// GET /api/auth/facturas/consultar → Listar todas las facturas
router.get('/facturas/consultar', pedidoController.consultarFacturas);

// GET /api/auth/facturas/ver/:id → Ver factura detallada
router.get('/facturas/ver/:id', pedidoController.verFactura);

module.exports = router;
