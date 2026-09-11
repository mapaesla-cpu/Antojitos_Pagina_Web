/**
 * @file categoriaController.js
 * @description Controlador de categorías. Maneja las operaciones CRUD sobre
 *              las categorías de productos. Recibe peticiones HTTP, invoca el
 *              modelo y devuelve respuestas JSON.
 */

const categoriaModel = require('../models/categoriaModel');

/**
 * Agrega una nueva categoría de productos.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre - Nombre de la categoría.
 * @param {string} req.body.descripcion - Descripción de la categoría.
 * @param {number} req.body.estado - Estado inicial (1 = activa, 0 = inactiva).
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregar = async (req, res) => {
    const { nombre, descripcion, estado } = req.body;
    try {
        await categoriaModel.agregar(nombre, descripcion, estado);
        res.json({ mensaje: 'Categoría agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar categoría:', error);
        res.status(500).json({ error: 'Error al agregar categoría' });
    }
};

/**
 * Retorna todas las categorías registradas.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultar = async (req, res) => {
    try {
        const categorias = await categoriaModel.consultarTodas();
        res.json(categorias);
    } catch (error) {
        console.error('Error al consultar categorías:', error);
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

/**
 * Actualiza los datos de una categoría existente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_categoria - ID de la categoría a actualizar.
 * @param {string} req.body.nombre - Nuevo nombre.
 * @param {string} req.body.descripcion - Nueva descripción.
 * @param {number} req.body.estado - Nuevo estado.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const actualizar = async (req, res) => {
    const { id_categoria } = req.params;
    const { nombre, descripcion, estado } = req.body;
    try {
        await categoriaModel.actualizar(id_categoria, nombre, descripcion, estado);
        res.json({ mensaje: 'Categoría actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

/**
 * Cambia el estado activo/inactivo de una categoría.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_categoria - ID de la categoría.
 * @param {number} req.body.estado - Nuevo estado (1 | 0).
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const cambiarEstado = async (req, res) => {
    const { id_categoria } = req.params;
    const { estado } = req.body;
    try {
        await categoriaModel.cambiarEstado(id_categoria, estado);
        res.json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error('Error al cambiar estado de categoría:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

module.exports = {
    agregar,
    consultar,
    actualizar,
    cambiarEstado
};
