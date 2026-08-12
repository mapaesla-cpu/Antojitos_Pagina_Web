async function cargarConfig() {
    const res = await fetch("http://localhost:3000/api/auth/configuracion/consultar");
    const data = await res.json();

    document.getElementById("config-nombre").value = data.nombre_negocio;
    document.getElementById("config-nit").value = data.nit;
    document.getElementById("config-telefono").value = data.telefono;
    document.getElementById("config-direccion").value = data.direccion;
    document.getElementById("config-apertura").value = data.horario_apertura;
    document.getElementById("config-cierre").value = data.horario_cierre;
    document.getElementById("config-dias").value = data.dias_atencion;
}

async function guardarConfig() {
    const nombre_negocio = document.getElementById("config-nombre").value;
    const nit = document.getElementById("config-nit").value;
    const telefono = document.getElementById("config-telefono").value;
    const direccion = document.getElementById("config-direccion").value;
    const horario_apertura = document.getElementById("config-apertura").value;
    const horario_cierre = document.getElementById("config-cierre").value;
    const dias_atencion = document.getElementById("config-dias").value;

    const res = await fetch("http://localhost:3000/api/auth/configuracion/actualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion })
    });

    const data = await res.json();
    alert(data.mensaje);
}

async function cambiarPassword() {
    const password_actual = document.getElementById("password-actual").value;
    const password_nueva = document.getElementById("password-nueva").value;
    const password_confirmar = document.getElementById("password-confirmar").value;

    if (password_nueva !== password_confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    if (password_nueva.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/auth/configuracion/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`   
         },
        body: JSON.stringify({ password_actual, password_nueva })
    });

    const data = await res.json();
    alert(data.mensaje || data.error);

    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "login.html";

    // Limpiar campos
    document.getElementById("password-actual").value = "";
    document.getElementById("password-nueva").value = "";
    document.getElementById("password-confirmar").value = "";
}
async function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", cargarConfig);