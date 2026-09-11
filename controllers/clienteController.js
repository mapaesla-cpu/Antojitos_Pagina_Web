/**
 * @file clienteController.js
 * @description Controlador de clientes. Maneja el registro de nuevos clientes.
 *              Recibe peticiones HTTP, invoca el modelo y devuelve respuestas JSON.
 */

const clienteModel = require('../models/clienteModel');

/**
 * Registra un nuevo cliente en el sistema.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre - Nombre completo del cliente.
 * @param {string} req.body.telefono - Número de teléfono.
 * @param {string} req.body.direccion - Dirección de entrega.
 * @param {string} req.body.correo - Correo electrónico.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @returns {void} Responde con JSON: { id_cliente } o error.
 */
const agregar = async (req, res) => {
    const { nombre, telefono, direccion, correo } = req.body;
    try {
        const result = await clienteModel.agregar(nombre, telefono, direccion, correo);
        // Retorna el ID generado para que el frontend pueda usarlo en el pedido
        res.json({ id_cliente: result.insertId });
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        res.status(500).json({ error: 'Error al registrar cliente' });
    }
};

module.exports = {
    agregar
};
