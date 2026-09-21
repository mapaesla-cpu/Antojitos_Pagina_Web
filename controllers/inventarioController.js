/**
 * @file inventarioController.js
 * @description Controlador de inventario. Maneja el registro de entradas y salidas
 *              de insumos, y el descuento automático al confirmar un pedido.
 *              Valida el token JWT antes de permitir movimientos.
 */

const jwt = require('jsonwebtoken');
const insumoModel = require('../models/insumoModel');
const inventarioModel = require('../models/inventarioModel');

const extraerToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};

/**
 * Registra una entrada de insumos al inventario.
 * Requiere autenticación JWT válida.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.headers.authorization - Token JWT en formato "Bearer <token>".
 * @param {number} req.body.id_insumo - ID del insumo que entra.
 * @param {number} req.body.cantidad - Cantidad que ingresa al inventario.
 * @param {string} req.body.motivo - Razón del movimiento.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const registrarEntrada = async (req, res) => {
    // 1. Validar token JWT
    const decoded = extraerToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Token no proporcionado o inválido' });
    }

    const { id_insumo, cantidad, motivo } = req.body;
    const idUsuario = decoded.id;

    if (!id_insumo || !(Number(cantidad) > 0) || !motivo || !motivo.trim()) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        // 2. Sumar cantidad al insumo
        const resultado = await insumoModel.sumarCantidad(id_insumo, cantidad);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }

        // 3. Registrar el movimiento en el historial
        await inventarioModel.registrarMovimiento(id_insumo, 'entrada', cantidad, motivo, idUsuario);

        res.json({ mensaje: 'Entrada registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar entrada de inventario:', error);
        res.status(500).json({ error: 'Error al registrar entrada' });
    }
};

/**
 * Registra una salida de insumos del inventario.
 * Requiere autenticación JWT válida.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.headers.authorization - Token JWT en formato "Bearer <token>".
 * @param {number} req.body.id_insumo - ID del insumo que sale.
 * @param {number} req.body.cantidad - Cantidad que sale del inventario.
 * @param {string} req.body.motivo - Razón del movimiento.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const registrarSalida = async (req, res) => {
    // 1. Validar token JWT
    const decoded = extraerToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Token no proporcionado o inválido' });
    }

    const { id_insumo, cantidad, motivo } = req.body;
    const idUsuario = decoded.id;

    if (!id_insumo || !(Number(cantidad) > 0) || !motivo || !motivo.trim()) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        // 2. Restar cantidad al insumo
        const resultado = await insumoModel.restarCantidad(id_insumo, cantidad);
        if (resultado.affectedRows === 0) {
            return res.status(400).json({ error: 'Stock insuficiente o insumo inexistente' });
        }

        // 3. Registrar el movimiento en el historial
        await inventarioModel.registrarMovimiento(id_insumo, 'salida', cantidad, motivo, idUsuario);

        res.json({ mensaje: 'Salida registrada exitosamente' });

    } catch (error) {
        console.error('Error al registrar salida de inventario:', error);
        res.status(500).json({ error: 'Error al registrar salida' });
    }
};

/**
 * Descuenta los insumos automáticamente al confirmar/completar un pedido.
 * Recorre cada producto del pedido, obtiene sus insumos y descuenta la cantidad
 * proporcional al número de unidades del producto en el pedido.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {number} req.body.id_pedido - ID del pedido a descontar.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const descontarInventario = async (req, res) => {
    const { id_pedido } = req.body;

    try {
        // 1. Obtener los productos del pedido
        const detalle = await inventarioModel.obtenerDetallePedido(id_pedido);

        // 2. Por cada producto, obtener sus insumos y descontarlos
        for (const producto of detalle) {
            const insumos = await inventarioModel.obtenerInsumosPorProducto(producto.id_producto);

            for (const insumo of insumos) {
                // La cantidad a descontar es proporcional a cuántas unidades se pidieron
                const cantidadDescontar = insumo.cantidad_requerida * producto.cantidad;
                await inventarioModel.descontarInsumo(insumo.id_insumo, cantidadDescontar);
            }
        }

        res.json({ mensaje: 'Inventario actualizado correctamente' });

    } catch (error) {
        console.error('Error al descontar inventario:', error);
        res.status(500).json({ error: 'Error al descontar inventario' });
    }
};

module.exports = {
    registrarEntrada,
    registrarSalida,
    descontarInventario
};
