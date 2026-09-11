/**
 * @file configuracionModel.js
 * @description Modelo de configuración del negocio. Contiene las consultas SQL
 *              de la tabla `configuracion` y de contraseñas de usuarios.
 *              Todas las funciones retornan Promesas.
 */

const db = require('../db');

/**
 * Retorna la configuración general del negocio (primer registro de la tabla).
 *
 * @returns {Promise<Object>} Objeto con los datos de configuración.
 */
const consultar = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM configuracion LIMIT 1';
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

/**
 * Actualiza los datos de configuración general del negocio.
 *
 * @param {string} nombre_negocio - Nombre del negocio.
 * @param {string} nit - NIT o RUT del negocio.
 * @param {string} telefono - Teléfono de contacto del negocio.
 * @param {string} direccion - Dirección física del negocio.
 * @param {string} horario_apertura - Hora de apertura (formato HH:MM).
 * @param {string} horario_cierre - Hora de cierre (formato HH:MM).
 * @param {string} dias_atencion - Días de atención (ej. "Lunes a Viernes").
 * @returns {Promise<Object>} Resultado de la actualización.
 */
const actualizar = (nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion) => {
    return new Promise((resolve, reject) => {
        // CORRECCIÓN: WHERE en línea separada para evitar error SQL silencioso
        const sql = `UPDATE configuracion SET
            nombre_negocio = ?,
            nit = ?,
            telefono = ?,
            direccion = ?,
            horario_apertura = ?,
            horario_cierre = ?,
            dias_atencion = ?
            WHERE id_config = 1`;
        db.query(sql, [nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    consultar,
    actualizar
};
