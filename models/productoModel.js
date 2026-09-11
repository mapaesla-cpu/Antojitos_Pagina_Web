/**
 * @file productoModel.js
 * @description Modelo de productos. Contiene las consultas SQL de la tabla `productos`
 *              y de la tabla intermedia `producto_insumos`.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

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
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO productos (id_categoria, nombre, descripcion, precio, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [id_categoria, nombre, descripcion, precio, imagen, disponible], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna todos los productos junto con el nombre de su categoría.
 *
 * @returns {Promise<Array>} Lista de productos con nombre de categoría incluido.
 */
const consultarTodos = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT p.*, c.nombre AS nombre_categoria
                     FROM productos p
                     JOIN categorias c ON p.id_categoria = c.id_categoria`;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

/**
 * Retorna únicamente los productos marcados como disponibles (para el menú público).
 *
 * @returns {Promise<Array>} Lista de productos disponibles con nombre de categoría.
 */
const consultarMenu = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT p.*, c.nombre AS nombre_categoria
                     FROM productos p
                     JOIN categorias c ON p.id_categoria = c.id_categoria
                     WHERE p.disponible = 1`;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
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
    return new Promise((resolve, reject) => {
        // CORRECCIÓN: WHERE separado en nueva línea para evitar error SQL silencioso
        const sql = `UPDATE productos SET
            id_categoria = ?,
            nombre = ?,
            descripcion = ?,
            precio = ?,
            imagen = ?,
            disponible = ?
            WHERE id_producto = ?`;
        db.query(sql, [id_categoria, nombre, descripcion, precio, imagen, disponible, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Cambia únicamente la disponibilidad de un producto.
 *
 * @param {number} id - ID del producto.
 * @param {number} disponible - Nueva disponibilidad (1 o 0).
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarDisponibilidad = (id, disponible) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE productos SET disponible = ? WHERE id_producto = ?';
        db.query(sql, [disponible, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ── Relación Producto ↔ Insumos ────────────────────────────────────────────

/**
 * Retorna los insumos asociados a un producto específico.
 *
 * @param {number} id_producto - ID del producto a consultar.
 * @returns {Promise<Array>} Lista de insumos requeridos por el producto.
 */
const consultarInsumos = (id_producto) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT pi.*, i.nombre AS nombre_insumo
                     FROM producto_insumos pi
                     JOIN insumos i ON pi.id_insumo = i.id_insumo
                     WHERE pi.id_producto = ?`;
        db.query(sql, [id_producto], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
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
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO producto_insumos (id_producto, id_insumo, cantidad_requerida) VALUES (?, ?, ?)';
        db.query(sql, [id_producto, id_insumo, cantidad_requerida], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Desasocia un insumo de un producto.
 *
 * @param {number} id_producto - ID del producto.
 * @param {number} id_insumo - ID del insumo a desasociar.
 * @returns {Promise<Object>} Resultado de la eliminación.
 */
const eliminarInsumo = (id_producto, id_insumo) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM producto_insumos WHERE id_producto = ? AND id_insumo = ?';
        db.query(sql, [id_producto, id_insumo], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
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
