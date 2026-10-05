/**
 * @file registrar-usuario.js
 * @description Módulo para el registro de nuevos usuarios del sistema.
 *              Valida campos y longitud mínima de contraseña antes de enviar
 *              los datos a la API de autenticación con autorización de administrador.
 */

const btnRegistrarse = document.getElementById('btn-registrarse');
const btnRegresar = document.getElementById('btn-regresar');

if (btnRegistrarse) {
    /**
     * Valida y procesa el registro de un nuevo usuario administrador o empleado.
     */
    btnRegistrarse.addEventListener('click', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('registro-nombre-usuario').value.trim();
        const correo = document.getElementById('registro-correo').value.trim();
        const contrasena = document.getElementById('registro-contrasena').value;
        const confirmarContrasena = document.getElementById('registro-contrasena-confirmar').value;
        const rol = document.getElementById('registro-rol').value;

        if (!nombre || !correo) {
            return alert('Por favor completa todos los campos.');
        }

        if (!contrasena || contrasena.trim().length < 6) {
            return alert('La contraseña debe tener mínimo 6 caracteres.');
        }

        if (contrasena !== confirmarContrasena) {
            return alert('Las contraseñas no coinciden.');
        }

        const token = localStorage.getItem("token");

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const result = await fetch(`http://localhost:3000/api/auth/login/registrarse`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ nombre, correo, contrasena, rol })
            });

            const data = await result.json();

            if (result.ok) {
                alert('¡Usuario creado exitosamente!');
                window.location.href = 'login.html';
            } else {
                alert(data.mensaje || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Error de conexión con el servidor.');
        }
    });
}

if (btnRegresar) {
    btnRegresar.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
    });
}
