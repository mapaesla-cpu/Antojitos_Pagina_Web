document.getElementById('iniciar-sesion').addEventListener('click', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

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
      alert('¡Bienvenido!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.mensaje);
    }

  } catch (error) {
    alert('Error al conectar con el servidor');
  }
});