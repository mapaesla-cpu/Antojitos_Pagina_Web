/**
 * @file contactoController.js
 * @description Controlador del formulario de contacto. Gestiona el envío de
 *              correos electrónicos usando Nodemailer con credenciales desde .env.
 */

const nodemailer = require('nodemailer');

/**
 * Transportador de Nodemailer configurado con Gmail.
 * Las credenciales se leen desde variables de entorno para mayor seguridad.
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,       // SSL en puerto 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo con los datos del formulario de contacto al email del negocio.
 *
 * @param {import('express').Request} req - Objeto de petición.
 * @param {string} req.body.nombre - Nombre de la persona que contacta.
 * @param {string} req.body.correo - Correo de la persona para responderle.
 * @param {string} req.body.telefono - Teléfono de contacto.
 * @param {string} req.body.mensaje - Contenido del mensaje.
 * @param {import('express').Response} res - Objeto de respuesta.
 */
const enviarMensaje = async (req, res) => {
    const { nombre, correo, telefono, mensaje } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: correo,
            subject: `Mensaje de ${nombre}`,
            text: `Nombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`
        });

        res.json({ mensaje: 'Correo enviado correctamente' });

    } catch (error) {
        console.error('[contacto] Error Nodemailer:', error.message, '| Código:', error.code);
        res.status(500).json({
            error: 'Error al enviar el correo'
        });
    }
};

module.exports = {
    enviarMensaje
};
