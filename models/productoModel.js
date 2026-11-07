/**
 * @file productoModel.js
 * @description Modelo de productos. Gestiona el catálogo de productos y sus recetas
 *              (`producto_insumos`) delegando las consultas SQL a `productoDAO`.
 */

const productoDAO = require('../dao/productoDAO');

/**
 * Inserta un nuevo producto en la base de datos.
 *
 * @param {number} id_categoria - ID de la categoría a la que pertenece.
 * @param {string} nombre - Nombre del producto.
 * @param {string} descripcion - Descripción del producto.
 * @param {number} precio - Precio del producto.
 * @param {string|null} imagen - Nombre del archivo de imagen (o null si no se subió).
 * @param {number} disponible - Disponibilidad (1 = disponible, 0 = no disponible).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregar = (id_categoria, nombre, descripcion, precio, imagen, disponible) => {
    return productoDAO.agregar(id_categoria, nombre, descripcion, precio, imagen, disponible);
};

/**
 * Retorna todos los productos junto con el nombre de su categoría.
 *
 * @returns {Promise<Array>} Lista de productos con nombre de categoría incluido.
 */
const consultarTodos = () => {
    return productoDAO.consultarTodos();
};

/**
 * Retorna únicamente los productos marcados como disponibles (para el menú público).
 *
 * @returns {Promise<Array>} Lista de productos disponibles con nombre de categoría.
 */
const consultarMenu = () => {
    return productoDAO.consultarMenu();
};

/**
 * Actualiza un producto existente. Si no se sube nueva imagen se conserva la actual.
 *
 * @param {number} id - ID del producto a actualizar.
 * @param {number} id_categoria - Nuevo ID de categoría.
 * @param {string} nombre - Nuevo nombre.
 * @param {string} descripcion - Nueva descripción.
 * @param {number} precio - Nuevo precio.
 * @param {string} imagen - Nombre de la imagen (puede ser la existente).
 * @param {number} disponible - Nuevo estado de disponibilidad.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (id, id_categoria, nombre, descripcion, precio, imagen, disponible) => {
    return productoDAO.actualizar(id, id_categoria, nombre, descripcion, precio, imagen, disponible);
};

/**
 * Cambia únicamente la disponibilidad de un producto.
 *
 * @param {number} id - ID del producto.
 * @param {number} disponible - Nueva disponibilidad (1 o 0).
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarDisponibilidad = (id, disponible) => {
    return productoDAO.cambiarDisponibilidad(id, disponible);
};

// ── Relación Producto ↔ Insumos ────────────────────────────────────────────

/**
 * Retorna los insumos asociados a un producto específico.
 *
 * @param {number} id_producto - ID del producto a consultar.
 * @returns {Promise<Array>} Lista de insumos requeridos por el producto.
 */
const consultarInsumos = (id_producto) => {
    return productoDAO.consultarInsumos(id_producto);
};

/**
 * Asocia un insumo a un producto indicando la cantidad requerida.
 *
 * @param {number} id_producto - ID del producto.
 * @param {number} id_insumo - ID del insumo a asociar.
 * @param {number} cantidad_requerida - Cantidad del insumo necesaria para preparar el producto.
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregarInsumo = (id_producto, id_insumo, cantidad_requerida) => {
    return productoDAO.agregarInsumo(id_producto, id_insumo, cantidad_requerida);
};

/**
 * Desasocia un insumo de un producto.
 *
 * @param {number} id_producto - ID del producto.
 * @param {number} id_insumo - ID del insumo a desasociar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
const eliminarInsumo = (id_producto, id_insumo) => {
    return productoDAO.eliminarInsumo(id_producto, id_insumo);
};

module.exports = {
    agregar,
    consultarTodos,
    consultarMenu,
    actualizar,
    cambiarDisponibilidad,
    consultarInsumos,
    agregarInsumo,
    eliminarInsumo
};
