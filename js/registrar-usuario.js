document.getElementById('btn-registrarse').addEventListener('click', async (e) => {
  e.preventDefault();


const nombre = document.getElementById('registro-nombre-usuario').value;
const correo = document.getElementById('registro-correo').value;
const contrasena = document.getElementById('registro-contrasena').value;
const confirmarContrasena = document.getElementById('registro-contrasena-confirmar').value;
const rol = document.getElementById('registro-rol').value;
if (!contrasena || contrasena.trim().length < 6){
  return alert ('La contraseña debe tener minimo 6 caracteres.');
}

if(contrasena !== confirmarContrasena){
    return alert('Las contraseñas no coinciden');
}
try {
    const result = await fetch(`http://localhost:3000/api/auth/login/registrarse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena, rol })
    });
    console.log(result);
    const data = await result.json();

    if (result.ok) {
      alert('Usuario creado exitosamente!');
      window.location.href = 'login.html';
    } else {
      alert(data.mensaje || 'Error al registrar usuario');
    }
}catch (error) {
    console.error('Error:', error);
}

});

document.getElementById('btn-regresar').addEventListener('click', async (e) => {
  window.location.href ='login.html';
});
