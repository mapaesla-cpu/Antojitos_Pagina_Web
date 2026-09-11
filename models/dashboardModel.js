/**
 * @file dashboardModel.js
 * @description Modelo del dashboard. Contiene las consultas SQL para obtener
 *              estadísticas generales del negocio.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

/**
 * Retorna las estadísticas del dashboard: pedidos de hoy, pendientes, ingresos del día
 * y los 5 productos más vendidos.
 *
 * @returns {Promise<Object>} Objeto con: pedidosHoy, pendientes, ingresos, populares.
 */
const obtenerEstadisticas = () => {
    return new Promise((resolve, reject) => {
        // Consultas independientes que se ejecutan en secuencia (callbacks anidados)
        const sqlPedidosHoy = `SELECT COUNT(*) AS total FROM pedidos WHERE DATE(fecha_pedido) = CURDATE()`;
        const sqlPendientes = `SELECT COUNT(*) AS total FROM pedidos WHERE estado = 'pendiente'`;
        const sqlIngresos   = `SELECT SUM(total) AS total FROM pedidos WHERE DATE(fecha_pedido) = CURDATE() AND estado != 'cancelado'`;
        const sqlPopulares  = `SELECT pr.nombre, SUM(d.cantidad) AS total_vendido
                               FROM detalle_pedidos d
                               JOIN productos pr ON d.id_producto = pr.id_producto
                               GROUP BY d.id_producto
                               ORDER BY total_vendido DESC
                               LIMIT 5`;

        db.query(sqlPedidosHoy, (err, pedidosHoy) => {
            if (err) return reject(err);
            db.query(sqlPendientes, (err, pendientes) => {
                if (err) return reject(err);
                db.query(sqlIngresos, (err, ingresos) => {
                    if (err) return reject(err);
                    db.query(sqlPopulares, (err, populares) => {
                        if (err) return reject(err);
                        resolve({
                            pedidosHoy: pedidosHoy[0].total,
                            pendientes: pendientes[0].total,
                            ingresos: ingresos[0].total || 0,
                            populares
                        });
                    });
                });
            });
        });
    });
};

/**
 * Retorna los 5 productos más vendidos con imagen, precio y descripción
 * para mostrar en la página principal del menú público.
 *
 * @returns {Promise<Array>} Lista de productos populares con datos de presentación.
 */
const obtenerProductosPopulares = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT pr.nombre, pr.imagen, pr.precio, pr.descripcion,
                     SUM(d.cantidad) AS total_vendido
                     FROM detalle_pedidos d
                     JOIN productos pr ON d.id_producto = pr.id_producto
                     GROUP BY d.id_producto
                     ORDER BY total_vendido DESC
                     LIMIT 5`;
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    obtenerEstadisticas,
    obtenerProductosPopulares
};
