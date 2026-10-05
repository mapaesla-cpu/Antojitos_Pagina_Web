/**
 * @file productoRoutes.js
 * @description Rutas de productos. Define los endpoints CRUD para la gestión
 *              de productos y su relación con insumos.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../config/multer');
const verificarToken = require('../middlewares/verificarToken');

// POST /api/auth/agregarProducto → Agregar producto (con subida de imagen, requiere auth)
router.post('/agregarProducto', verificarToken, upload.single('imagen'), productoController.agregar);

// GET /api/auth/consultarProducto → Consultar todos los productos
router.get('/consultarProducto', productoController.consultar);

// GET /api/auth/consultarMenu → Consultar productos disponibles (menú público)
router.get('/consultarMenu', productoController.consultarMenu);

// PUT /api/auth/actualizarProducto/:id_producto → Actualizar producto por ID (requiere auth)
router.put('/actualizarProducto/:id_producto', verificarToken, productoController.actualizar);

// PUT /api/auth/producto/disponible/:id_producto → Cambiar disponibilidad del producto (requiere auth)
router.put('/producto/disponible/:id_producto', verificarToken, productoController.cambiarDisponibilidad);

// GET /api/auth/producto-insumos/:id_producto → Obtener insumos de un producto
router.get('/producto-insumos/:id_producto', productoController.consultarInsumos);

// POST /api/auth/producto-insumos/agregar → Asociar insumo a producto (requiere auth)
router.post('/producto-insumos/agregar', verificarToken, productoController.agregarInsumo);

// DELETE /api/auth/producto-insumos/eliminar → Desasociar insumo de producto (requiere auth)
router.delete('/producto-insumos/eliminar', verificarToken, productoController.eliminarInsumo);

module.exports = router;
