/**
 * @file clienteRoutes.js
 * @description Rutas de clientes. Define el endpoint para registrar nuevos clientes.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// POST /api/auth/clientes/agregar → Registrar nuevo cliente
router.post('/clientes/agregar', clienteController.agregar);

module.exports = router;
