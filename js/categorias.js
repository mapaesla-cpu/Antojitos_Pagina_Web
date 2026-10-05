/**
 * @file categorias.js
 * @description Módulo frontend para la administración de categorías de productos.
 *              Permite agregar, listar, filtrar, editar y activar/desactivar
 *              categorías del catálogo del restaurante.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  FORMULARIO DE NUEVA CATEGORÍA
 * ══════════════════════════════════════════════════════════════════════════ */

const formularioC = document.getElementById('formularioC');
const btnlimpiar = document.getElementById("limpiar-btn");

if (formularioC) {
    /**
     * Envía los datos del nuevo formulario de categoría al backend.
     */
    formularioC.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById("nombre").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            estado: document.getElementById("estado").value
        };

        const token = localStorage.getItem("token");

        try {
            const respuesta = await fetch("http://localhost:3000/api/auth/agregarCategoria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(resultado.mensaje || "Categoría agregada exitosamente");
                formularioC.reset();
                cargarDatosC();
            } else {
                alert(resultado.error || resultado.mensaje || "Error al agregar categoría");
            }
        } catch (error) {
            console.error("Error al registrar categoría:", error);
            alert("Error de conexión con el servidor");
        }
    });
}

if (btnlimpiar) {
    btnlimpiar.addEventListener("click", () => {
        if (formularioC) formularioC.reset();
    });
}

/* ══════════════════════════════════════════════════════════════════════════
 *  CONSULTA Y RENDERIZADO DE CATEGORÍAS
 * ══════════════════════════════════════════════════════════════════════════ */

/** @type {Array<Object>} Lista de todas las categorías en memoria */
let todasLasCategorias = [];

/**
 * Consulta la lista completa de categorías desde la API REST.
 */
async function cargarDatosC() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarCategoria", {
            method: "GET"
        });
        const data = await res.json();
        todasLasCategorias = data;
        mostrarCategorias(todasLasCategorias);
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

/**
 * Renderiza la lista de categorías en la tabla administrativa.
 * @param {Array<Object>} categorias - Arreglo de categorías a desplegar.
 */
function mostrarCategorias(categorias) {
    const tabla = document.getElementById("tablaBody1");
    if (!tabla) return;
    tabla.innerHTML = "";

    categorias.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.id_categoria}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion || ''}</td>
                <td>${item.estado}</td>
                <td>
                    <button class="btn-editar-categoria" onclick="abrirModalEditarC(${item.id_categoria})">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button> 
                    <button class="${item.estado === 'activa' ? 'btn-eliminar' : 'btn-editar-categoria'}"
                        onclick="toggleActivo(${item.id_categoria}, '${item.estado}')">
                        <i class="fa-solid fa-${item.estado === 'activa' ? 'ban' : 'check'}"></i>
                        ${item.estado === 'activa' ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            </tr>           
        `;
    });
}

/**
 * Filtra las categorías según el texto introducido en la barra de búsqueda.
 */
function buscarCategoria() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtradas = todasLasCategorias.filter(item =>
        String(item.id_categoria).toLowerCase().includes(texto) ||
        (item.nombre && item.nombre.toLowerCase().includes(texto))
    );
    mostrarCategorias(filtradas);
}

/* ══════════════════════════════════════════════════════════════════════════
 *  MODAL DE ACTUALIZACIÓN DE CATEGORÍA
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de edición y carga la información de la categoría seleccionada.
 * @param {number} id_categoria - Identificador de la categoría.
 */
function abrirModalEditarC(id_categoria) {
    const cat = todasLasCategorias.find(c => c.id_categoria == id_categoria);
    if (!cat) return;

    document.getElementById("modal-id-categoria").value = cat.id_categoria;
    document.getElementById("modal-nombre-categoria").value = cat.nombre;
    document.getElementById("modal-descripcion-categoria").value = cat.descripcion || '';
    document.getElementById("modal-estado-categoria").value = cat.estado;

    const modal = document.getElementById("modalActualizarCategoria");
    if (modal) modal.style.display = "flex";
}

/**
 * Cierra la ventana modal de actualización de categoría.
 */
function cerrarModalC() {
    const modal = document.getElementById("modalActualizarCategoria");
    if (modal) modal.style.display = "none";
}

/**
 * Guarda los cambios efectuados sobre la categoría seleccionada.
 */
async function guardarActualizacionC() {
    const id_categoria = document.getElementById("modal-id-categoria").value;
    const nombre = document.getElementById("modal-nombre-categoria").value.trim();
    const descripcion = document.getElementById("modal-descripcion-categoria").value.trim();
    const estado = document.getElementById("modal-estado-categoria").value;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/actualizarCategoria/${id_categoria}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, descripcion, estado })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensaje || "Categoría actualizada correctamente");
            cerrarModalC();
            cargarDatosC();
        } else {
            alert(data.error || data.mensaje || "Error al actualizar categoría");
        }
    } catch (error) {
        console.error("Error al actualizar categoría:", error);
    }
}

/**
 * Alterna el estado de una categoría entre 'activa' e 'inactiva'.
 * @param {number} id_categoria - Identificador de la categoría.
 * @param {string} estadoActual - Estado vigente ('activa' o 'inactiva').
 */
async function toggleActivo(id_categoria, estadoActual) {
    const nuevoEstado = estadoActual === 'activa' ? 'inactiva' : 'activa';
    const token = localStorage.getItem("token");

    if (confirm(`¿Deseas cambiar el estado de la categoría a "${nuevoEstado}"?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/categorias/desactivar/${id_categoria}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (response.ok) {
                alert(`Estado actualizado a: ${nuevoEstado}`);
                cargarDatosC();
            } else {
                alert("No se pudo cambiar el estado de la categoría.");
            }
        } catch (error) {
            console.error("Error actualizando estado de categoría:", error);
        }
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
cargarDatosC();