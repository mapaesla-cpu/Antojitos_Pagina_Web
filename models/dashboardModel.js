/**
 * @file dashboardModel.js
 * @description Modelo del dashboard. Delega las consultas estadísticas
 *              del negocio al objeto de acceso a datos `dashboardDAO`.
 */

const dashboardDAO = require('../dao/dashboardDAO');

/**
 * Retorna las estadísticas del dashboard: pedidos de hoy, pendientes, ingresos del día
 * y los 5 productos más vendidos.
 *
 * @returns {Promise<Object>} Objeto con: pedidosHoy, pendientes, ingresos, populares.
 */
const obtenerEstadisticas = () => {
    return dashboardDAO.obtenerEstadisticas();
};

/**
 * Retorna los 5 productos más vendidos con imagen, precio y descripción
 * para mostrar en la página principal del menú público.
 *
 * @returns {Promise<Array>} Lista de productos populares con datos de presentación.
 */
const obtenerProductosPopulares = () => {
    return dashboardDAO.obtenerProductosPopulares();
};

module.exports = {
    obtenerEstadisticas,
    obtenerProductosPopulares
};
