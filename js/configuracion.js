/**
 * @file configuracion.js
 * @description Módulo de configuración administrativa del restaurante y perfil de usuario.
 *              Permite actualizar datos comerciales (horarios, NIT, teléfono, dirección),
 *              cambiar contraseña del usuario activo y cerrar sesión.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  CONFIGURACIÓN GENERAL DEL NEGOCIO
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta la información configurada del negocio y la carga en los campos del formulario.
 */
async function cargarConfig() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/configuracion/consultar");
        const data = await res.json();

        if (data) {
            document.getElementById("config-nombre").value = data.nombre_negocio || '';
            document.getElementById("config-nit").value = data.nit || '';
            document.getElementById("config-telefono").value = data.telefono || '';
            document.getElementById("config-direccion").value = data.direccion || '';
            document.getElementById("config-apertura").value = data.horario_apertura || '';
            document.getElementById("config-cierre").value = data.horario_cierre || '';
            document.getElementById("config-dias").value = data.dias_atencion || '';
        }
    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
}

/**
 * Guarda los cambios en los datos comerciales del negocio.
 */
async function guardarConfig() {
    const nombre_negocio = document.getElementById("config-nombre").value.trim();
    const nit = document.getElementById("config-nit").value.trim();
    const telefono = document.getElementById("config-telefono").value.trim();
    const direccion = document.getElementById("config-direccion").value.trim();
    const horario_apertura = document.getElementById("config-apertura").value.trim();
    const horario_cierre = document.getElementById("config-cierre").value.trim();
    const dias_atencion = document.getElementById("config-dias").value.trim();

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/configuracion/actualizar", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion })
        });

        const data = await res.json();
        alert(data.mensaje || data.error || "Configuración actualizada");
    } catch (error) {
        console.error("Error al guardar configuración:", error);
        alert("Error de conexión al guardar configuración");
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  SEGURIDAD Y CAMBIO DE CONTRASEÑA
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Actualiza la contraseña del usuario actualmente autenticado.
 * Requiere la contraseña actual y confirma que la nueva coincida y cumpla requisitos mínimos.
 */
async function cambiarPassword() {
    const password_actual = document.getElementById("password-actual").value;
    const password_nueva = document.getElementById("password-nueva").value;
    const password_confirmar = document.getElementById("password-confirmar").value;

    if (!password_actual) {
        alert("Por favor ingresa tu contraseña actual.");
        return;
    }

    if (password_nueva.length < 6) {
        alert("La contraseña nueva debe tener al menos 6 caracteres.");
        return;
    }

    if (password_nueva !== password_confirmar) {
        alert("Las contraseñas nuevas no coinciden.");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/configuracion/password", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`   
            },
            body: JSON.stringify({ password_actual, password_nueva })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensaje || "Contraseña actualizada exitosamente. Inicia sesión de nuevo.");
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            window.location.href = "login.html";
        } else {
            alert(data.error || data.mensaje || "Error al cambiar la contraseña");
        }
    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        alert("Error de conexión al cambiar la contraseña");
    }
}

/**
 * Cierra la sesión activa del usuario eliminando credenciales locales y redirigiendo al login.
 */
async function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    window.location.href = "login.html";
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", cargarConfig);