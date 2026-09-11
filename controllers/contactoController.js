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
    service: 'gmail',
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
            from: process.env.EMAIL_USER,      // Remitente: email del negocio
            to: process.env.EMAIL_USER,        // Destinatario: el mismo email del negocio
            replyTo: correo,                   // Permite responder directamente al cliente
            subject: `Mensaje de ${nombre}`,
            text: `
Nombre: ${nombre}
Correo: ${correo}
Teléfono: ${telefono}

Mensaje:
${mensaje}
            `
        });

        res.json({ mensaje: 'Correo enviado correctamente' });

    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
};

module.exports = {
    enviarMensaje
};
