/**
 * @file pedidoController.js
 * @description Controlador de pedidos, detalles de pedidos y facturas. Maneja
 *              el registro, consulta y gestión de estado de pedidos, así como
 *              la generación automática de facturas.
 */

const pedidoModel = require('../models/pedidoModel');

/**
 * Registra un nuevo pedido y genera su factura automáticamente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_cliente - ID del cliente que realiza el pedido.
 * @param {string} req.body.tipo_entrega - Modalidad de entrega.
 * @param {string} req.body.metodo_pago - Método de pago.
 * @param {number} req.body.total - Total del pedido.
 * @param {string} req.body.notas - Notas adicionales.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregar = async (req, res) => {
    const { id_cliente, tipo_entrega, metodo_pago, total, notas } = req.body;
    try {
        // 1. Insertar el pedido
        const result = await pedidoModel.agregar(id_cliente, tipo_entrega, metodo_pago, total, notas);
        const id_pedido = result.insertId;

        // 2. Crear la factura asociada (sin bloquear la respuesta si falla)
        pedidoModel.crearFactura(id_pedido, total).catch(err => {
            console.error('Error al generar factura automática:', err);
        });

        res.json({ id_pedido });

    } catch (error) {
        console.error('Error al registrar pedido:', error);
        res.status(500).json({ error: 'Error al registrar pedido' });
    }
};

/**
 * Retorna todos los pedidos con información del cliente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultar = async (req, res) => {
    try {
        const pedidos = await pedidoModel.consultarTodos();
        res.json(pedidos);
    } catch (error) {
        console.error('Error al consultar pedidos:', error);
        res.status(500).json({ error: 'Error al consultar pedidos' });
    }
};

/**
 * Cambia el estado de un pedido.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id - ID del pedido.
 * @param {string} req.body.estado - Nuevo estado.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await pedidoModel.cambiarEstado(id, estado);
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        console.error('Error al cambiar estado del pedido:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

/**
 * Retorna el detalle completo (cabecera + productos) de un pedido.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id - ID del pedido.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const verDetalle = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pedidoModel.verDetalle(id);
        res.json(data);
    } catch (error) {
        console.error('Error al ver detalle del pedido:', error);
        res.status(500).json({ error: 'Error' });
    }
};

/**
 * Ruta pública: retorna únicamente el ID y el estado de un pedido (para rastreo de clientes).
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id_pedido - ID del pedido a rastrear.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultarEstadoPublico = async (req, res) => {
    const { id_pedido } = req.params;
    try {
        const pedido = await pedidoModel.consultarEstadoPublico(id_pedido);
        if (!pedido) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error al consultar estado del pedido:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

/**
 * Registra un producto dentro del detalle de un pedido.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_pedido - ID del pedido.
 * @param {number} req.body.id_producto - ID del producto.
 * @param {number} req.body.cantidad - Cantidad de unidades.
 * @param {number} req.body.precio_unitario - Precio por unidad.
 * @param {number} req.body.subtotal - Total de la línea.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const agregarDetalle = async (req, res) => {
    const { id_pedido, id_producto, cantidad, precio_unitario, subtotal } = req.body;
    try {
        await pedidoModel.agregarDetalle(id_pedido, id_producto, cantidad, precio_unitario, subtotal);
        res.json({ mensaje: 'Detalle registrado' });
    } catch (error) {
        console.error('Error al registrar detalle del pedido:', error);
        res.status(500).json({ error: 'Error al registrar detalle' });
    }
};

// ── Facturas ───────────────────────────────────────────────────────────────

/**
 * Retorna todas las facturas con datos del cliente.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const consultarFacturas = async (req, res) => {
    try {
        const facturas = await pedidoModel.consultarFacturas();
        res.json(facturas);
    } catch (error) {
        console.error('Error al consultar facturas:', error);
        res.status(500).json({ error: 'Error al consultar' });
    }
};

/**
 * Retorna el detalle completo de una factura específica.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.params.id - ID de la factura.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const verFactura = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await pedidoModel.verFactura(id);
        res.json(data);
    } catch (error) {
        console.error('Error al ver factura:', error);
        res.status(500).json({ error: 'Error' });
    }
};

module.exports = {
    agregar,
    consultar,
    cambiarEstado,
    verDetalle,
    consultarEstadoPublico,
    agregarDetalle,
    consultarFacturas,
    verFactura
};
