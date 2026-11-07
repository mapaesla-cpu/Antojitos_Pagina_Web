/**
 * @file configuracionModel.js
 * @description Modelo de configuración del negocio. Delega el acceso a datos
 *              de la tabla `configuracion` a `configuracionDAO`.
 */

const configuracionDAO = require('../dao/configuracionDAO');

/**
 * Retorna la configuración general del negocio (primer registro de la tabla).
 *
 * @returns {Promise<Object>} Objeto con los datos de configuración.
 */
const consultar = () => {
    return configuracionDAO.consultar();
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
    return configuracionDAO.actualizar(
        nombre_negocio,
        nit,
        telefono,
        direccion,
        horario_apertura,
        horario_cierre,
        dias_atencion
    );
};

module.exports = {
    consultar,
    actualizar
};
