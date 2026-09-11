/**
 * @file dashboardController.js
 * @description Controlador del dashboard. Maneja las peticiones de estadísticas
 *              generales del negocio y los productos más populares para el menú.
 */

const dashboardModel = require('../models/dashboardModel');

/**
 * Retorna las estadísticas del dashboard: pedidos de hoy, pendientes,
 * ingresos del día y los 5 productos más vendidos.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const obtenerEstadisticas = async (req, res) => {
    try {
        const estadisticas = await dashboardModel.obtenerEstadisticas();
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ error: 'Error al cargar estadísticas' });
    }
};

/**
 * Retorna los 5 productos más vendidos con datos de presentación
 * para el carrusel de la página principal.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const obtenerProductosPopulares = async (req, res) => {
    try {
        const productos = await dashboardModel.obtenerProductosPopulares();
        res.json({ productosmenu: productos });
    } catch (error) {
        console.error('Error al cargar productos populares:', error);
        res.status(500).json({ error: 'Error al cargar productos' });
    }
};

module.exports = {
    obtenerEstadisticas,
    obtenerProductosPopulares
};
