/**
 * @file categoriaRoutes.js
 * @description Rutas de categorías. Define los endpoints CRUD para la gestión
 *              de categorías de productos.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const verificarToken = require('../middlewares/verificarToken');

// POST /api/auth/agregarCategoria → Agregar nueva categoría (requiere auth)
router.post('/agregarCategoria', verificarToken, categoriaController.agregar);

// GET /api/auth/consultarCategoria → Consultar todas las categorías
router.get('/consultarCategoria', categoriaController.consultar);

// PUT /api/auth/actualizarCategoria/:id_categoria → Actualizar categoría por ID (requiere auth)
router.put('/actualizarCategoria/:id_categoria', verificarToken, categoriaController.actualizar);

// PUT /api/auth/categorias/desactivar/:id_categoria → Cambiar estado activo/inactivo (requiere auth)
router.put('/categorias/desactivar/:id_categoria', verificarToken, categoriaController.cambiarEstado);

module.exports = router;
