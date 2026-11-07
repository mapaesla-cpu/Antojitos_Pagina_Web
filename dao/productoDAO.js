/**
 * @file productoDAO.js
 * @description Data Access Object (DAO) para las tablas `productos` y `producto_insumos`.
 *              Encapsula todas las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const productoDAO = {
    /**
     * Inserta un nuevo producto en la base de datos.
     * @param {number} id_categoria
     * @param {string} nombre
     * @param {string} descripcion
     * @param {number} precio
     * @param {string|null} imagen
     * @param {number} disponible
     * @returns {Promise<Object>}
     */
    agregar: (id_categoria, nombre, descripcion, precio, imagen, disponible) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO productos (id_categoria, nombre, descripcion, precio, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sql, [id_categoria, nombre, descripcion, precio, imagen, disponible], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna todos los productos con el nombre de su categoría.
     * @returns {Promise<Array>}
     */
    consultarTodos: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT p.*, c.nombre AS nombre_categoria
                         FROM productos p
                         JOIN categorias c ON p.id_categoria = c.id_categoria`;
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Retorna los productos disponibles (disponible = 1) para el menú público.
     * @returns {Promise<Array>}
     */
    consultarMenu: () => {
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
    },

    /**
     * Actualiza los datos de un producto por su ID.
     * @param {number} id
     * @param {number} id_categoria
     * @param {string} nombre
     * @param {string} descripcion
     * @param {number} precio
     * @param {string} imagen
     * @param {number} disponible
     * @returns {Promise<Object>}
     */
    actualizar: (id, id_categoria, nombre, descripcion, precio, imagen, disponible) => {
        return new Promise((resolve, reject) => {
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
    },

    /**
     * Actualiza la disponibilidad de un producto por su ID.
     * @param {number} id
     * @param {number} disponible
     * @returns {Promise<Object>}
     */
    cambiarDisponibilidad: (id, disponible) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE productos SET disponible = ? WHERE id_producto = ?';
            db.query(sql, [disponible, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Consulta los insumos asociados a un producto en `producto_insumos`.
     * @param {number} id_producto
     * @returns {Promise<Array>}
     */
    consultarInsumos: (id_producto) => {
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
    },

    /**
     * Asocia un insumo con su cantidad requerida a un producto.
     * @param {number} id_producto
     * @param {number} id_insumo
     * @param {number} cantidad_requerida
     * @returns {Promise<Object>}
     */
    agregarInsumo: (id_producto, id_insumo, cantidad_requerida) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO producto_insumos (id_producto, id_insumo, cantidad_requerida) VALUES (?, ?, ?)';
            db.query(sql, [id_producto, id_insumo, cantidad_requerida], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Desasocia un insumo de un producto en `producto_insumos`.
     * @param {number} id_producto
     * @param {number} id_insumo
     * @returns {Promise<Object>}
     */
    eliminarInsumo: (id_producto, id_insumo) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM producto_insumos WHERE id_producto = ? AND id_insumo = ?';
            db.query(sql, [id_producto, id_insumo], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = productoDAO;

