/**
 * @file pedidoModel.js
 * @description Modelo de pedidos y facturas. Contiene las consultas SQL de las tablas
 *              `pedidos`, `detalle_pedidos` y `facturas`.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

// ── Pedidos ────────────────────────────────────────────────────────────────

/**
 * Inserta un nuevo pedido en la base de datos.
 *
 * @param {number} id_cliente - ID del cliente que realiza el pedido.
 * @param {string} tipo_entrega - Modalidad de entrega ('domicilio' | 'local').
 * @param {string} metodo_pago - Método de pago ('efectivo' | 'tarjeta', etc.).
 * @param {number} total - Monto total del pedido.
 * @param {string} notas - Notas adicionales del pedido (puede ser vacío).
 * @returns {Promise<Object>} Resultado con `insertId` del nuevo pedido.
 */
const agregar = (id_cliente, tipo_entrega, metodo_pago, total, notas) => {
    return new Promise((resolve, reject) => {
        const fecha_pedido = new Date();
        const estado = 'pendiente';
        const sql = 'INSERT INTO pedidos (id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna todos los pedidos con datos del cliente asociado, ordenados por fecha descendente.
 *
 * @returns {Promise<Array>} Lista de pedidos con nombre y teléfono del cliente.
 */
const consultarTodos = () => {
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
};

/**
 * Cambia el estado de un pedido (pendiente → preparando → listo → entregado | cancelado).
 *
 * @param {number} id - ID del pedido.
 * @param {string} estado - Nuevo estado del pedido.
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const cambiarEstado = (id, estado) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE pedidos SET estado = ? WHERE id_pedido = ?';
        db.query(sql, [estado, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Consulta el detalle completo de un pedido (cabecera + productos incluidos).
 *
 * @param {number} id - ID del pedido.
 * @returns {Promise<Object>} Objeto con `pedido` (cabecera) y `detalle` (productos).
 */
const verDetalle = (id) => {
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
};

/**
 * Consulta únicamente el ID y estado de un pedido (ruta pública para clientes).
 *
 * @param {number} id_pedido - ID del pedido a rastrear.
 * @returns {Promise<Object|null>} Objeto con `id_pedido` y `estado`, o null si no existe.
 */
const consultarEstadoPublico = (id_pedido) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id_pedido, estado FROM pedidos WHERE id_pedido = ?';
        db.query(sql, [id_pedido], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0 ? result[0] : null);
        });
    });
};

// ── Detalle de pedidos ─────────────────────────────────────────────────────

/**
 * Registra un producto dentro del detalle de un pedido.
 *
 * @param {number} id_pedido - ID del pedido al que pertenece.
 * @param {number} id_producto - ID del producto.
 * @param {number} cantidad - Cantidad de unidades del producto.
 * @param {number} precio_unitario - Precio por unidad en el momento del pedido.
 * @param {number} subtotal - Total de esta línea (cantidad × precio_unitario).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const agregarDetalle = (id_pedido, id_producto, cantidad, precio_unitario, subtotal) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, subtotal], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// ── Facturas ───────────────────────────────────────────────────────────────

/**
 * Crea una factura asociada a un pedido con cálculo automático de IVA (19%).
 *
 * @param {number} id_pedido - ID del pedido al que pertenece la factura.
 * @param {number} total - Total del pedido (con IVA incluido).
 * @returns {Promise<Object>} Resultado de la inserción.
 */
const crearFactura = (id_pedido, total) => {
    return new Promise((resolve, reject) => {
        const numero_factura = `FAC-${Date.now()}`;
        const subtotal = total / 1.19;       // Precio sin IVA
        const impuesto = total - subtotal;   // IVA del 19%
        const fecha_emision = new Date();
        const estado = 'emitida';

        const sql = 'INSERT INTO facturas (id_pedido, numero_factura, fecha_emision, subtotal, impuesto, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [id_pedido, numero_factura, fecha_emision, subtotal.toFixed(2), impuesto.toFixed(2), total, estado], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Retorna todas las facturas con datos del cliente, ordenadas por fecha descendente.
 *
 * @returns {Promise<Array>} Lista de facturas.
 */
const consultarFacturas = () => {
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
};

/**
 * Retorna el detalle completo de una factura y sus productos asociados.
 *
 * @param {number} id - ID de la factura.
 * @returns {Promise<Object>} Objeto con `factura` (datos) y `detalle` (productos).
 */
const verFactura = (id) => {
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
};

module.exports = {
    agregar,
    consultarTodos,
    cambiarEstado,
    verDetalle,
    consultarEstadoPublico,
    agregarDetalle,
    crearFactura,
    consultarFacturas,
    verFactura
};
