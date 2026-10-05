/**
 * @file contacto.js
 * @description Módulo para el formulario de contacto público.
 *              Valida que el usuario acepte los términos y envía el mensaje
 *              por correo electrónico mediante la API del backend.
 */

const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    /**
     * Procesa y envía el formulario de contacto.
     */
    formularioContacto.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre   = document.getElementById('contacto-nombre').value.trim();
        const correo   = document.getElementById('contacto-email').value.trim();
        const telefono = document.getElementById('contacto-telefono').value.trim();
        const mensaje  = document.getElementById('contacto-mensaje').value.trim();
        const terminos = document.getElementById('contacto-terminos').checked;

        if (!terminos) {
            alert('Debes aceptar los términos y condiciones antes de enviar.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/auth/contacto/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, correo, telefono, mensaje })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.mensaje || '¡Mensaje enviado con éxito! Nos comunicaremos pronto.');
                formularioContacto.reset();
            } else {
                alert('No se pudo enviar el mensaje:\n' + (data.detalle || data.error || data.mensaje));
            }
        } catch (error) {
            console.error('Error al enviar contacto:', error);
            alert('No se pudo conectar con el servidor. Verifica que el servidor esté en ejecución.');
        }
    });
}
