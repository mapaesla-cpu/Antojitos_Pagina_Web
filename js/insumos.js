/**
 * @file insumos.js
 * @description Módulo frontend para la gestión de insumos del inventario.
 *              Permite agregar, consultar, actualizar, eliminar insumos
 *              y registrar movimientos de entrada/salida de inventario.
 *              Se comunica con la API REST del backend mediante fetch.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  AGREGAR INSUMO — Formulario principal
 * ══════════════════════════════════════════════════════════════════════════ */

const formulario  = document.getElementById('formulario');

/**
 * Evento submit del formulario de nuevo insumo.
 * Envía los datos al endpoint POST /api/auth/agregar con token JWT.
 */
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        unidad: document.getElementById("unidad").value,
        cantidad: document.getElementById("cantidad").value,
        stock: document.getElementById("stock").value
    };
    const token = localStorage.getItem("token");

    const respuesta = await fetch("http://localhost:3000/api/auth/agregar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok) {
        alert(resultado.error || "Error al agregar insumo");
        return;
    }
    alert(resultado.mensaje);
    formulario.reset();
    cargarDatos();
});

/** Botón para limpiar el formulario sin enviar datos. */
const btnlimpiar = document.getElementById("limpiar-btn");
btnlimpiar.addEventListener("click", () => {
    formulario.reset();
});

/* ══════════════════════════════════════════════════════════════════════════
 *  CONSULTAR INSUMOS — Carga y renderizado de la tabla
 * ══════════════════════════════════════════════════════════════════════════ */

/** Almacén local de todos los insumos cargados desde el servidor. */
let todosLosInsumos = [];

/**
 * Carga todos los insumos desde el backend y los muestra en la tabla.
 * Llama al endpoint GET /api/auth/consultar.
 */
async function cargarDatos() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultar", {
            method: "GET"
        });   
        const data = await res.json();
        todosLosInsumos = data;
        mostrarInsumos(todosLosInsumos);
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

/**
 * Renderiza la lista de insumos en la tabla HTML.
 *
 * @param {Array<Object>} insumos - Lista de insumos a mostrar.
 */
function mostrarInsumos(insumos) {
    const tabla = document.getElementById("tablaBody");
    if (!tabla) return;
    tabla.innerHTML = "";

    insumos.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.id_insumo}</td>
                <td>${item.nombre}</td>
                <td>${item.unidad_medida}</td>
                <td>${item.cantidad_disponible}</td>
                <td>${item.stock_minimo}</td>
                <td>${item.fecha_actualizacion}</td>
                <td>
                <div class="acciones">
                    <button class="btn-entrada" onclick="abrirEntrada(${item.id_insumo})">
                        <i class="fa-solid fa-arrow-right-to-bracket"></i> Entrada
                    </button>
                    <button class="btn-salida" onclick="abrirSalida(${item.id_insumo})">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Salida
                    </button>
                    <button class="btn-editar" onclick="actualizar(${item.id_insumo})">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button> 
                    <button class="btn-eliminar" onclick="eliminar(${item.id_insumo})">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>       
                </div>  
                </td>
            </tr>           
        `;
    });
}

/**
 * Filtra los insumos por texto de búsqueda (ID o nombre).
 * Se activa al escribir en el campo buscador.
 */
function buscarInsumo() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtrados = todosLosInsumos.filter(item =>
        String(item.id_insumo).toLowerCase().includes(texto) ||
        (item.nombre && item.nombre.toLowerCase().includes(texto))
    );
    mostrarInsumos(filtrados);
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ACTUALIZAR INSUMO — Modal de edición
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de actualización y lo llena con los datos del insumo seleccionado.
 *
 * @param {number} id - ID del insumo a editar.
 */
function actualizar(id) {
    const item = todosLosInsumos.find(i => i.id_insumo === id);
    if (!item) return;
    document.getElementById("modal-id").value = item.id_insumo;
    document.getElementById("modal-nombre").value = item.nombre;
    document.getElementById("modal-unidad").value = item.unidad_medida;
    document.getElementById("modal-cantidad").value = item.cantidad_disponible;
    document.getElementById("modal-stock").value = item.stock_minimo;
    document.getElementById("modalActualizar").style.display = "flex";
}

/** Cierra el modal de actualización de insumos. */
function cerrarModal() {
    document.getElementById("modalActualizar").style.display = "none";
}

/**
 * Guarda los cambios del modal de actualización.
 * Valida los datos y envía un PUT al backend.
 */
async function guardarActualizacion() {
    const id_insumo = document.getElementById("modal-id").value;
    const nombre = document.getElementById("modal-nombre").value;
    const unidad_medida = document.getElementById("modal-unidad").value;
    const cantidad_disponible = document.getElementById("modal-cantidad").value;
    const stock_minimo = document.getElementById("modal-stock").value;

    if (!nombre.trim() || !unidad_medida.trim() || stock_minimo === "" || Number(stock_minimo) < 0) {
        alert("Complete los campos correctamente");
        return;
    }
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/auth/actualizar/${id_insumo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, unidad_medida, cantidad_disponible, stock_minimo })
    });
    const data = await res.json();
    if (!res.ok) {
        alert(data.error || "Error al actualizar");
        return;
    }
    alert(data.mensaje);
    cerrarModal();
    cargarDatos();
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ELIMINAR INSUMO
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Elimina un insumo previa confirmación del usuario.
 * Envía un DELETE al backend con el token JWT.
 *
 * @param {number} id_insumo - ID del insumo a eliminar.
 */
async function eliminar(id_insumo) {
    if (!confirm("¿Seguro que deseas eliminar este insumo?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/auth/eliminar/${id_insumo}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) {
        alert(data.error || "Error al eliminar");
        return;
    }
    cargarDatos();
}

/* ══════════════════════════════════════════════════════════════════════════
 *  ENTRADA DE INVENTARIO — Modal de entrada
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de entrada de inventario para un insumo específico.
 * Pre-llena los datos del insumo y limpia los campos de entrada.
 *
 * @param {number} id - ID del insumo al que se le registrará entrada.
 */
function abrirEntrada(id) {
    const item = todosLosInsumos.find(i => i.id_insumo === id);
    if (!item) return;
    // Llena el modal con los datos actuales
    document.getElementById("modal-entrada-id").value = item.id_insumo;
    document.getElementById("modal-entrada-nombre").value = item.nombre;
    document.getElementById("modal-entrada-unidad").textContent = item.unidad_medida;
    document.getElementById("modal-entrada-stock-actual").value = item.cantidad_disponible;

    // Limpiar los campos que debe llenar el administrador
    document.getElementById("modal-entrada-cantidad").value = "";
    document.getElementById("modal-entrada-motivo").value = "";

    // Muestra el modal
    document.getElementById("modalEntrada").style.display = "flex";
}

/**
 * Guarda la entrada de inventario.
 * Valida cantidad y motivo, luego envía POST al backend.
 */
async function guardarEntrada() {
    const id_insumo = document.getElementById("modal-entrada-id").value;
    const cantidad = document.getElementById("modal-entrada-cantidad").value;
    const motivo = document.getElementById("modal-entrada-motivo").value;

    if (!cantidad || cantidad <= 0) {
        alert("Ingrese una cantidad valida");
        return;
    }
    if (!motivo.trim()){
        alert("Ingrese el motivo de la entrada");
        return;
    }

    const token = localStorage.getItem("token");
    
    const res = await fetch("http://localhost:3000/api/auth/insumos/entrada",{
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({id_insumo, cantidad, motivo})
    });

    const data = await res.json();

    if(!res.ok) {
        alert(data.error || "Error al registrar entrada");
        return;
    }
    alert(data.mensaje);
    cerrarModalEntrada();
    cargarDatos();
}

/** Cierra el modal de entrada de inventario. */
function cerrarModalEntrada() {
    document.getElementById("modalEntrada").style.display = "none";
}

/* ══════════════════════════════════════════════════════════════════════════
 *  SALIDA DE INVENTARIO — Modal de salida
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de salida de inventario para un insumo específico.
 * Pre-llena los datos del insumo y limpia los campos de salida.
 *
 * @param {number} id - ID del insumo al que se le registrará salida.
 */
function abrirSalida(id) {
    const item = todosLosInsumos.find(i => i.id_insumo === id);
    if (!item) return;
    // Llena el modal con los datos actuales
    document.getElementById("modal-salida-id").value = item.id_insumo;
    document.getElementById("modal-salida-nombre").value = item.nombre;
    document.getElementById("modal-salida-unidad").textContent = item.unidad_medida;
    document.getElementById("modal-salida-stock-actual").value = item.cantidad_disponible;

    // Limpiar los campos que debe llenar el administrador
    document.getElementById("modal-salida-cantidad").value = "";
    document.getElementById("modal-salida-motivo").value = "";

    // Muestra el modal
    document.getElementById("modalSalida").style.display = "flex";
}

/**
 * Guarda la salida de inventario.
 * Valida cantidad (no mayor que stock), motivo, y envía POST al backend.
 */
async function guardarSalida() {
    const id_insumo = document.getElementById("modal-salida-id").value;
    const cantidad = document.getElementById("modal-salida-cantidad").value;
    const motivo = document.getElementById("modal-salida-motivo").value;

    if (!cantidad || cantidad <= 0) {
        alert("Ingrese una cantidad valida");
        return;
    }
    const stockActual = document.getElementById("modal-salida-stock-actual").value;

    if (Number(cantidad) > Number(stockActual)) {
        alert("No hay suficiente stock disponible");
        return;
    }
    if (!motivo.trim()) {
        alert("Debe indicar el motivo de la salida");
        return;
    }
    const token = localStorage.getItem("token");
    
    const res = await fetch("http://localhost:3000/api/auth/insumos/salida",{
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({id_insumo, cantidad, motivo})
    });

    const data = await res.json();

    if(!res.ok) {
        alert(data.error || "Error al registrar salida");
        return;
    }
    alert(data.mensaje);
    cerrarModalSalida();
    cargarDatos();
}

/** Cierra el modal de salida de inventario. */
function cerrarModalSalida() {
    document.getElementById("modalSalida").style.display = "none";
}
