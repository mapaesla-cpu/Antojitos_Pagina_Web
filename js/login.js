/**
 * @file login.js
 * @description Módulo de autenticación para el panel de administración.
 *              Envía credenciales de acceso al backend, valida la respuesta
 *              y almacena el token JWT y rol en localStorage.
 */

const botonLogin = document.getElementById('iniciar-sesion');

if (botonLogin) {
    /**
     * Maneja el intento de inicio de sesión del usuario.
     */
    botonLogin.addEventListener('click', async (e) => {
        e.preventDefault();

        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value;

        if (!correo || !contrasena) {
            alert('Por favor ingresa tu correo y contraseña.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', data.rol);
                alert('¡Bienvenido al panel!');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.mensaje || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error de conexión en login:', error);
            alert('Error al conectar con el servidor.');
        }
    });
}