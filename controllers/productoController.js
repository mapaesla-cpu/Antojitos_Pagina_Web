/**
 * @file productoController.js
 * @description Controlador de productos. Maneja operaciones CRUD sobre productos
 *              y la gestión de insumos asociados a cada producto.
 *              Recibe peticiones HTTP, invoca el modelo y devuelve respuestas JSON.
 */

const productoModel = require('../models/productoModel');

/**
 * Agrega un nuevo producto. Soporta subida de imagen a través de Multer.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_categoria - ID de la categoría del producto.
 * @param {string} req.body.nombre - Nombre del producto.
 * @param {string} req.body.descripcion - Descripción.
 * @param {number} req.body.precio - Precio.
 * @param {number} req.body.disponible - Disponibilidad (1 o 0).
 * @param {Express.Multer.File} [req.file] - Archivo de imagen (opcional).
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregar = async (req, res) => {
    const { id_categoria, nombre, descripcion, precio, disponible } = req.body;
    // Si se subió imagen, se usa su nombre; de lo contrario queda como null
    const imagen = req.file ? req.file.filename : null;

    try {
        await productoModel.agregar(id_categoria, nombre, descripcion, precio, imagen, disponible);
        res.json({ mensaje: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar' });
    }
};

/**
 * Retorna todos los productos con el nombre de su categoría.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultar = async (req, res) => {
    try {
        const productos = await productoModel.consultarTodos();
        res.json(productos);
    } catch (error) {
        console.error('Error al consultar productos:', error);
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

/**
 * Retorna los productos disponibles para el menú público.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultarMenu = async (req, res) => {
    try {
        const menu = await productoModel.consultarMenu();
        res.json(menu);
    } catch (error) {
        console.error('Error al consultar menú:', error);
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

/**
 * Actualiza un producto existente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_producto - ID del producto a actualizar.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const actualizar = async (req, res) => {
    const { id_producto } = req.params;
    const { id_categoria, nombre, descripcion, precio, imagen, disponible } = req.body;
    try {
        await productoModel.actualizar(id_producto, id_categoria, nombre, descripcion, precio, imagen, disponible);
        res.json({ mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

/**
 * Cambia la disponibilidad de un producto (activo/inactivo en el menú).
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_producto - ID del producto.
 * @param {number} req.body.disponible - Nuevo estado de disponibilidad (1 o 0).
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const cambiarDisponibilidad = async (req, res) => {
    const { id_producto } = req.params;
    const { disponible } = req.body;
    try {
        await productoModel.cambiarDisponibilidad(id_producto, disponible);
        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// ── Insumos de producto ────────────────────────────────────────────────────

/**
 * Retorna los insumos requeridos por un producto específico.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_producto - ID del producto.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultarInsumos = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const insumos = await productoModel.consultarInsumos(id_producto);
        res.json(insumos);
    } catch (error) {
        console.error('Error al consultar insumos del producto:', error);
        res.status(500).json({ error: 'Error' });
    }
};

/**
 * Asocia un insumo a un producto indicando la cantidad requerida.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_producto - ID del producto.
 * @param {number} req.body.id_insumo - ID del insumo.
 * @param {number} req.body.cantidad_requerida - Cantidad necesaria por unidad de producto.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregarInsumo = async (req, res) => {
    const { id_producto, id_insumo, cantidad_requerida } = req.body;
    try {
        await productoModel.agregarInsumo(id_producto, id_insumo, cantidad_requerida);
        res.json({ mensaje: 'Insumo agregado' });
    } catch (error) {
        console.error('Error al agregar insumo al producto:', error);
        res.status(500).json({ error: 'Error' });
    }
};

/**
 * Desasocia un insumo de un producto.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_producto - ID del producto.
 * @param {number} req.body.id_insumo - ID del insumo a desasociar.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const eliminarInsumo = async (req, res) => {
    const { id_producto, id_insumo } = req.body;
    try {
        await productoModel.eliminarInsumo(id_producto, id_insumo);
        res.json({ mensaje: 'Insumo eliminado' });
    } catch (error) {
        console.error('Error al eliminar insumo del producto:', error);
        res.status(500).json({ error: 'Error' });
    }
};

module.exports = {
    agregar,
    consultar,
    consultarMenu,
    actualizar,
    cambiarDisponibilidad,
    consultarInsumos,
    agregarInsumo,
    eliminarInsumo
};
