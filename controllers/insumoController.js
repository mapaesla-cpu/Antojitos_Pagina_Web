/**
 * @file insumoController.js
 * @description Controlador de insumos. Maneja las operaciones CRUD sobre los
 *              insumos del inventario. Recibe peticiones HTTP, invoca el modelo
 *              y devuelve respuestas JSON.
 */

const insumoModel = require('../models/insumoModel');

const esNumeroValido = (valor) =>
    valor !== '' && valor !== null && valor !== undefined && !isNaN(valor) && Number(valor) >= 0;

/**
 * Agrega un nuevo insumo al inventario.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre - Nombre del insumo.
 * @param {string} req.body.unidad - Unidad de medida.
 * @param {number} req.body.cantidad - Cantidad inicial disponible.
 * @param {number} req.body.stock - Stock mínimo antes de alertar.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregar = async (req, res) => {
    const { nombre, unidad, cantidad, stock } = req.body;
    if (!nombre || !nombre.trim() || !unidad || !esNumeroValido(cantidad) || !esNumeroValido(stock)) {
        return res.status(400).json({ error: 'Datos inválidos: revise nombre, unidad, cantidad y stock' });
    }
    try {
        await insumoModel.agregar(nombre, unidad, cantidad, stock);
        res.json({ mensaje: 'Insumo agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar insumo:', error);
        res.status(500).json({ error: 'Error al agregar insumo' });
    }
};

/**
 * Retorna todos los insumos registrados.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultar = async (req, res) => {
    try {
        const insumos = await insumoModel.consultarTodos();
        res.json(insumos);
    } catch (error) {
        console.error('Error al consultar insumos:', error);
        res.status(500).json({ error: 'Error en la consulta' });
    }
};

/**
 * Actualiza los datos de un insumo existente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_insumo - ID del insumo a actualizar.
 * @param {string} req.body.nombre - Nuevo nombre.
 * @param {string} req.body.unidad_medida - Nueva unidad de medida.
 * @param {number} req.body.cantidad_disponible - Nueva cantidad.
 * @param {number} req.body.stock_minimo - Nuevo stock mínimo.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const actualizar = async (req, res) => {
    const { id_insumo } = req.params;
    const { nombre, unidad_medida, cantidad_disponible, stock_minimo } = req.body;
    if (!nombre || !nombre.trim() || !unidad_medida || !esNumeroValido(cantidad_disponible) || !esNumeroValido(stock_minimo)) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }
    try {
        const resultado = await insumoModel.actualizar(id_insumo, nombre, unidad_medida, cantidad_disponible, stock_minimo);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.json({ mensaje: 'Insumo actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar insumo:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

/**
 * Elimina un insumo del inventario.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_insumo - ID del insumo a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const eliminar = async (req, res) => {
    const { id_insumo } = req.params;
    try {
        const resultado = await insumoModel.eliminar(id_insumo);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.json({ mensaje: 'Insumo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar insumo:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

/**
 * Retorna los insumos con stock por debajo del mínimo (alertas).
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const obtenerAlertas = async (req, res) => {
    try {
        const alertas = await insumoModel.obtenerAlertas();
        res.json(alertas);
    } catch (error) {
        console.error('Error al consultar alertas de stock:', error);
        res.status(500).json({ error: 'Error al consultar el stock' });
    }
};

module.exports = {
    agregar,
    consultar,
    actualizar,
    eliminar,
    obtenerAlertas
};
