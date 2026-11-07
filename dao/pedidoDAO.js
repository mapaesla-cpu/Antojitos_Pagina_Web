/**
 * @file pedidoDAO.js
 * @description Data Access Object (DAO) para las tablas `pedidos`, `detalle_pedidos` y `facturas`.
 *              Encapsula todas las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const pedidoDAO = {
    /**
     * Inserta un nuevo pedido en la tabla `pedidos`.
     * @param {number} id_cliente
     * @param {Date} fecha_pedido
     * @param {string} estado
     * @param {string} tipo_entrega
     * @param {string} metodo_pago
     * @param {number} total
     * @param {string} notas
     * @returns {Promise<Object>}
     */
    agregar: (id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO pedidos (id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna todos los pedidos junto con nombre y teléfono del cliente.
     * @returns {Promise<Array>}
     */
    consultarTodos: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT p.*, c.nombre AS nombre_cliente, c.telefono
                         FROM pedidos p
                         JOIN clientes c ON p.id_cliente = c.id_cliente
                         ORDER BY p.fecha_pedido DESC`;
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Actualiza el estado de un pedido por su ID.
     * @param {number} id
     * @param {string} estado
     * @returns {Promise<Object>}
     */
    cambiarEstado: (id, estado) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE pedidos SET estado = ? WHERE id_pedido = ?';
            db.query(sql, [estado, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Obtiene la cabecera y el detalle de productos de un pedido por su ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    verDetalle: (id) => {
        return new Promise((resolve, reject) => {
            const sqlPedido = `SELECT p.*, c.nombre AS nombre_cliente, c.telefono
                               FROM pedidos p
                               JOIN clientes c ON p.id_cliente = c.id_cliente
                               WHERE p.id_pedido = ?`;

            const sqlDetalle = `SELECT d.*, pr.nombre AS nombre_producto
                                FROM detalle_pedidos d
                                JOIN productos pr ON d.id_producto = pr.id_producto
                                WHERE d.id_pedido = ?`;

            db.query(sqlPedido, [id], (err, pedido) => {
                if (err) return reject(err);
                db.query(sqlDetalle, [id], (err, detalle) => {
                    if (err) return reject(err);
                    resolve({ pedido: pedido[0], detalle });
                });
            });
        });
    },

    /**
     * Consulta el ID y estado de un pedido para el rastreo público.
     * @param {number} id_pedido
     * @returns {Promise<Object|null>}
     */
    consultarEstadoPublico: (id_pedido) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT id_pedido, estado FROM pedidos WHERE id_pedido = ?';
            db.query(sql, [id_pedido], (err, result) => {
                if (err) return reject(err);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },

    /**
     * Inserta una línea de producto en `detalle_pedidos`.
     * @param {number} id_pedido
     * @param {number} id_producto
     * @param {number} cantidad
     * @param {number} precio_unitario
     * @param {number} subtotal
     * @returns {Promise<Object>}
     */
    agregarDetalle: (id_pedido, id_producto, cantidad, precio_unitario, subtotal) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, subtotal], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Inserta una nueva factura en la tabla `facturas`.
     * @param {number} id_pedido
     * @param {string} numero_factura
     * @param {Date} fecha_emision
     * @param {string|number} subtotal
     * @param {string|number} impuesto
     * @param {number} total
     * @param {string} estado
     * @returns {Promise<Object>}
     */
    crearFactura: (id_pedido, numero_factura, fecha_emision, subtotal, impuesto, total, estado) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO facturas (id_pedido, numero_factura, fecha_emision, subtotal, impuesto, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [id_pedido, numero_factura, fecha_emision, subtotal, impuesto, total, estado], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    /**
     * Retorna todas las facturas con datos del cliente ordenadas por fecha de emisión.
     * @returns {Promise<Array>}
     */
    consultarFacturas: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT f.*, c.nombre AS nombre_cliente, c.telefono
                         FROM facturas f
                         JOIN pedidos p ON f.id_pedido = p.id_pedido
                         JOIN clientes c ON p.id_cliente = c.id_cliente
                         ORDER BY f.fecha_emision DESC`;
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    /**
     * Retorna la cabecera y los productos asociados a una factura por su ID.
     * @param {number} id
     * @returns {Promise<Object>}
     */
    verFactura: (id) => {
        return new Promise((resolve, reject) => {
            const sqlFactura = `SELECT f.*, c.nombre AS nombre_cliente, c.telefono,
                                p.tipo_entrega, p.notas
                                FROM facturas f
                                JOIN pedidos p ON f.id_pedido = p.id_pedido
                                JOIN clientes c ON p.id_cliente = c.id_cliente
                                WHERE f.id_factura = ?`;

            const sqlDetalle = `SELECT d.*, pr.nombre AS nombre_producto
                                FROM detalle_pedidos d
                                JOIN productos pr ON d.id_producto = pr.id_producto
                                WHERE d.id_pedido = (SELECT id_pedido FROM facturas WHERE id_factura = ?)`;

            db.query(sqlFactura, [id], (err, factura) => {
                if (err) return reject(err);
                db.query(sqlDetalle, [id], (err, detalle) => {
                    if (err) return reject(err);
                    resolve({ factura: factura[0], detalle });
                });
            });
        });
    }
};

module.exports = pedidoDAO;

