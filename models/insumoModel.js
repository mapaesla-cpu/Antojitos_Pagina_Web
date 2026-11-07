/**
 * @file insumoModel.js
 * @description Modelo de insumos. Representa las operaciones de negocio sobre insumos
 *              y delega la ejecución SQL a `insumoDAO`.
 */

const insumoDAO = require('../dao/insumoDAO');

/**
 * Inserta un nuevo insumo en la base de datos.
 *
 * @param {string} nombre - Nombre del insumo.
 * @param {string} unidad - Unidad de medida (kg, litros, unidades, etc.).
 * @param {number} cantidad - Cantidad disponible inicial.
 * @param {number} stock - Stock mínimo requerido antes de alertar.
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregar = (nombre, unidad, cantidad, stock) => {
    return insumoDAO.agregar(nombre, unidad, cantidad, stock);
};

/**
 * Retorna todos los insumos activos registrados.
 *
 * @returns {Promise<Array>} Lista de insumos.
 */
const consultarTodos = () => {
    return insumoDAO.consultarTodos();
};

/**
 * Actualiza un insumo existente.
 *
 * @param {number} id - ID del insumo a actualizar.
 * @param {string} nombre - Nuevo nombre del insumo.
 * @param {string} unidad_medida - Nueva unidad de medida.
 * @param {number} cantidad_disponible - Nueva cantidad disponible.
 * @param {number} stock_minimo - Nuevo stock mínimo.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (id, nombre, unidad_medida, cantidad_disponible, stock_minimo) => {
    return insumoDAO.actualizar(id, nombre, unidad_medida, cantidad_disponible, stock_minimo);
};

/**
 * Elimina lógicamente un insumo por su ID.
 *
 * @param {number} id - ID del insumo a eliminar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
const eliminar = (id) => {
    return insumoDAO.eliminar(id);
};

/**
 * Retorna los insumos cuyo stock actual está por debajo del mínimo.
 *
 * @returns {Promise<Array>} Lista de insumos en alerta de bajo stock.
 */
const obtenerAlertas = () => {
    return insumoDAO.obtenerAlertas();
};

/**
 * Suma una cantidad a un insumo (entrada de inventario).
 *
 * @param {number} id_insumo - ID del insumo.
 * @param {number} cantidad - Cantidad a sumar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const sumarCantidad = (id_insumo, cantidad) => {
    return insumoDAO.sumarCantidad(id_insumo, cantidad);
};

/**
 * Resta una cantidad a un insumo (salida de inventario).
 *
 * @param {number} id_insumo - ID del insumo.
 * @param {number} cantidad - Cantidad a restar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const restarCantidad = (id_insumo, cantidad) => {
    return insumoDAO.restarCantidad(id_insumo, cantidad);
};

module.exports = {
    agregar,
    consultarTodos,
    actualizar,
    eliminar,
    obtenerAlertas,
    sumarCantidad,
    restarCantidad
};
