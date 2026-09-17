const formulario = document.getElementById('formulario-contacto');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre   = document.getElementById('contacto-nombre').value;
    const correo   = document.getElementById('contacto-email').value;
    const telefono = document.getElementById('contacto-telefono').value;
    const mensaje  = document.getElementById('contacto-mensaje').value;
    const terminos = document.getElementById('contacto-terminos').checked;

    if (!terminos) {
        alert('Debes aceptar los terminos y condiciones');
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
        alert(data.mensaje);

        if (res.ok) {
            alert(data.mensaje);
            formulario.reset();
        } else {
            // Muestra el error detallado del servidor para diagnóstico
            alert('Error del servidor:\n' + (data.detalle || data.error));
        }
    } catch (error) {
        console.error('Error al enviar:', error);
        alert('No se pudo conectar con el servidor. Verifica que el servidor este corriendo.');
    }
});
