/**
 * @file dashboardDAO.js
 * @description Data Access Object (DAO) para las consultas estadísticas del dashboard.
 *              Encapsula las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const dashboardDAO = {
    /**
     * Obtiene las estadísticas generales del día: pedidos de hoy, pendientes,
     * ingresos del día y top 5 productos más vendidos.
     * @returns {Promise<Object>}
     */
    obtenerEstadisticas: () => {
        return new Promise((resolve, reject) => {
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
    },

    /**
     * Retorna los 5 productos más vendidos con imagen, precio y descripción.
     * @returns {Promise<Array>}
     */
    obtenerProductosPopulares: () => {
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
    }
};

module.exports = dashboardDAO;

