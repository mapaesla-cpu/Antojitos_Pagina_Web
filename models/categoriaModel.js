/**
 * @file categoriaModel.js
 * @description Modelo de categorías. Representa la lógica de dominio de categorías
 *              y delega las consultas SQL a `categoriaDAO`.
 */

const categoriaDAO = require('../dao/categoriaDAO');

/**
 * Inserta una nueva categoría en la base de datos.
 *
 * @param {string} nombre - Nombre de la categoría.
 * @param {string} descripcion - Descripción de la categoría.
 * @param {number|string} estado - Estado de la categoría.
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregar = (nombre, descripcion, estado) => {
    return categoriaDAO.agregar(nombre, descripcion, estado);
};

/**
 * Retorna todas las categorías registradas.
 *
 * @returns {Promise<Array>} Lista de categorías.
 */
const consultarTodas = () => {
    return categoriaDAO.consultarTodas();
};

/**
 * Actualiza los datos de una categoría existente.
 *
 * @param {number} id - ID de la categoría a actualizar.
 * @param {string} nombre - Nuevo nombre de la categoría.
 * @param {string} descripcion - Nueva descripción.
 * @param {number|string} estado - Nuevo estado.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (id, nombre, descripcion, estado) => {
    return categoriaDAO.actualizar(id, nombre, descripcion, estado);
};

/**
 * Cambia únicamente el estado (activo/inactivo) de una categoría.
 *
 * @param {number} id - ID de la categoría.
 * @param {number|string} estado - Nuevo estado a asignar.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarEstado = (id, estado) => {
    return categoriaDAO.cambiarEstado(id, estado);
};

module.exports = {
    agregar,
    consultarTodas,
    actualizar,
    cambiarEstado
};
