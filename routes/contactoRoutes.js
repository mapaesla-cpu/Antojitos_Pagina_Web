/**
 * @file contactoRoutes.js
 * @description Rutas del formulario de contacto. Define el endpoint para
 *              enviar mensajes por correo electrónico.
 *              Solo mapea rutas a funciones del controlador.
 */

const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

// POST /api/auth/contacto/enviar → Enviar mensaje de contacto por email
router.post('/contacto/enviar', contactoController.enviarMensaje);

module.exports = router;
