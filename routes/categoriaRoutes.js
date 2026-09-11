/**
 * @file categoriaRoutes.js
 * @description Rutas de categorías. Define los endpoints CRUD para la gestión
 *              de categorías de productos.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// POST /api/auth/agregarCategoria → Agregar nueva categoría
router.post('/agregarCategoria', categoriaController.agregar);

// GET /api/auth/consultarCategoria → Consultar todas las categorías
router.get('/consultarCategoria', categoriaController.consultar);

// PUT /api/auth/actualizarCategoria/:id_categoria → Actualizar categoría por ID
router.put('/actualizarCategoria/:id_categoria', categoriaController.actualizar);

// PUT /api/auth/categorias/desactivar/:id_categoria → Cambiar estado activo/inactivo
router.put('/categorias/desactivar/:id_categoria', categoriaController.cambiarEstado);

module.exports = router;
