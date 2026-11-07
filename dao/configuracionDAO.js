/**
 * @file configuracionDAO.js
 * @description Data Access Object (DAO) para la tabla `configuracion`.
 *              Encapsula las consultas SQL directas hacia la base de datos.
 */

const db = require('../db');

const configuracionDAO = {
    /**
     * Retorna el primer registro de configuración general del negocio.
     * @returns {Promise<Object>}
     */
    consultar: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM configuracion LIMIT 1';
            db.query(sql, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    /**
     * Actualiza los datos de configuración general del negocio.
     * @param {string} nombre_negocio
     * @param {string} nit
     * @param {string} telefono
     * @param {string} direccion
     * @param {string} horario_apertura
     * @param {string} horario_cierre
     * @param {string} dias_atencion
     * @returns {Promise<Object>}
     */
    actualizar: (nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion) => {
        return new Promise((resolve, reject) => {
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
    }
};

module.exports = configuracionDAO;

