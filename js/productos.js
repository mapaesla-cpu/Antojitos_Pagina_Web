/**
 * @file productos.js
 * @description Módulo frontend para la administración de productos en el catálogo.
 *              Permite agregar, listar, filtrar, editar productos y gestionar
 *              los insumos asociados a cada producto (receta).
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  ELEMENTOS Y EVENTOS PRINCIPALES
 * ══════════════════════════════════════════════════════════════════════════ */

const formularioP = document.getElementById('formularioP');
const btnlimpiar = document.getElementById("limpiar-btn");

/**
 * Evento submit para registrar un nuevo producto con soporte para imagen (FormData).
 */
formularioP.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id_categoria", document.getElementById("id_categoria").value);
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("imagen", document.getElementById("imagen").files[0]);
    formData.append("disponible", document.getElementById("disponible").value);

    const token = localStorage.getItem("token");

    try {
        const respuesta = await fetch("http://localhost:3000/api/auth/agregarProducto", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(resultado.mensaje || "Producto agregado exitosamente");
            formularioP.reset();
            cargarDatosP();
        } else {
            alert(resultado.error || resultado.mensaje || "Error al agregar el producto");
        }
    } catch (error) {
        console.error("Error al registrar producto:", error);
        alert("No se pudo conectar con el servidor.");
    }
});

btnlimpiar.addEventListener("click", () => {
    formularioP.reset();
});

/* ══════════════════════════════════════════════════════════════════════════
 *  CONSULTAR Y MOSTRAR PRODUCTOS
 * ══════════════════════════════════════════════════════════════════════════ */

/** @type {Array<Object>} Lista en memoria de todos los productos cargados */
let todosLosProductos = [];

/**
 * Consulta la lista completa de productos desde el backend.
 */
async function cargarDatosP() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarProducto", {
            method: "GET"
        });
        const data = await res.json();
        todosLosProductos = data;
        mostrarProductos(todosLosProductos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

/**
 * Renderiza la lista de productos en la tabla administrativa.
 * @param {Array<Object>} productos - Lista de productos a renderizar.
 */
function mostrarProductos(productos) {
    const tabla = document.getElementById("tablaBody2");
    if (!tabla) return;
    tabla.innerHTML = "";

    productos.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.id_producto}</td>
                <td>${item.nombre_categoria || ''}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion || ''}</td>
                <td>$${Number(item.precio).toLocaleString()}</td>
                <td><img src="http://localhost:3000/img/${item.imagen}" width="50px" alt="${item.nombre}"></td>
                <td>${item.disponible == 1 ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn-editar-producto" onclick="abrirModalEditar(${item.id_producto})">
                        <i class="fa-solid fa-edit"></i> Editar
                    </button> 
                    <button class="${item.disponible == 1 ? 'btn-eliminar' : 'btn-editar-producto'}"
                        onclick="toggleActivo(${item.id_producto}, ${item.disponible})">
                        <i class="fa-solid fa-${item.disponible == 1 ? 'ban' : 'check'}"></i>
                        ${item.disponible == 1 ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            </tr>           
        `;
    });
}

/**
 * Filtra los productos según el término de búsqueda ingresado.
 */
function buscarProducto() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtrados = todosLosProductos.filter(item =>
        String(item.id_producto).toLowerCase().includes(texto) ||
        (item.nombre && item.nombre.toLowerCase().includes(texto))
    );
    mostrarProductos(filtrados);
}

/* ══════════════════════════════════════════════════════════════════════════
 *  MODAL DE ACTUALIZACIÓN DE PRODUCTO
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el modal de edición y carga la información del producto seleccionado.
 * @param {number} id_producto - Identificador único del producto.
 */
function abrirModalEditar(id_producto) {
    const prod = todosLosProductos.find(p => p.id_producto == id_producto);
    if (!prod) return;

    cargarCategoriasModal(prod.id_categoria);
    document.getElementById("modal-id-producto").value = prod.id_producto;
    document.getElementById("modal-id-categoria").value = prod.id_categoria;
    document.getElementById("modal-nombre-producto").value = prod.nombre;
    document.getElementById("modal-descripcion-producto").value = prod.descripcion || '';
    document.getElementById("modal-precio-producto").value = prod.precio;
    document.getElementById("modal-imagen-actual-producto").src = `http://localhost:3000/img/${prod.imagen}`;
    document.getElementById("modal-disponible-producto").value = prod.disponible;

    cargarInsumosModal();
    cargarInsumosProducto(id_producto);

    document.getElementById("modalActualizarProducto").style.display = "flex";
}

/**
 * Carga las categorías en el selector del modal de actualización.
 * @param {number} idSeleccionado - Categoría actual para preseleccionarla.
 */
async function cargarCategoriasModal(idSeleccionado) {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarCategoria");
        const categorias = await res.json();

        const select = document.getElementById("modal-id-categoria");
        select.innerHTML = '';
        categorias.forEach(cat => {
            select.innerHTML += `
                <option value="${cat.id_categoria}"
                    ${cat.id_categoria == idSeleccionado ? 'selected' : ''}>
                    ${cat.nombre}
                </option>`;
        });
    } catch (error) {
        console.error("Error al cargar categorías en modal:", error);
    }
}

/**
 * Cierra la ventana modal de actualización de producto.
 */
function cerrarModalP() {
    document.getElementById("modalActualizarProducto").style.display = "none";
}

/**
 * Guarda las modificaciones del producto seleccionado.
 */
async function guardarActualizacionP() {
    const id_producto = document.getElementById("modal-id-producto").value;
    const id_categoria = document.getElementById("modal-id-categoria").value;
    const nombre = document.getElementById("modal-nombre-producto").value;
    const descripcion = document.getElementById("modal-descripcion-producto").value;
    const precio = document.getElementById("modal-precio-producto").value;
    const imagen = document.getElementById("modal-imagen-actual-producto").src.split("/").pop();
    const disponible = document.getElementById("modal-disponible-producto").value;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/actualizarProducto/${id_producto}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_categoria, nombre, descripcion, precio, imagen, disponible })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.mensaje || "Producto actualizado con éxito");
            cerrarModalP();
            cargarDatosP();
        } else {
            alert(data.error || data.mensaje || "Error al actualizar producto");
        }
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    }
}

/**
 * Activa o desactiva la disponibilidad de un producto.
 * @param {number} id_producto - Identificador único del producto.
 * @param {number|string} estadoActual - Estado actual (1 = disponible, 0 = no disponible).
 */
async function toggleActivo(id_producto, estadoActual) {
    const nuevoEstado = Number(estadoActual) === 1 ? 0 : 1;
    const accion = Number(estadoActual) === 1 ? 'desactivar' : 'activar';

    if (confirm(`¿Estás seguro de que deseas ${accion} este producto?`)) {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/api/auth/producto/disponible/${id_producto}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ disponible: nuevoEstado })
            });

            if (res.ok) {
                alert(`Producto ${nuevoEstado === 1 ? 'activado' : 'desactivado'} con éxito.`);
                await cargarDatosP();
            } else {
                alert("Error al cambiar el estado del producto.");
            }
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    }
}

/**
 * Carga las categorías en el formulario de registro de producto.
 */
async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarCategoria");
        const categorias = await res.json();

        const select = document.getElementById("id_categoria");
        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  GESTIÓN DE INSUMOS POR PRODUCTO (RECETA)
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Carga la lista de insumos en el select del modal para vincularlos al producto.
 */
async function cargarInsumosModal() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultar");
        const insumos = await res.json();

        const select = document.getElementById("modal-select-insumo");
        select.innerHTML = '<option value="">Selecciona un insumo</option>';

        insumos.forEach(insumo => {
            select.innerHTML += `<option value="${insumo.id_insumo}">${insumo.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error cargando insumos para modal:", error);
    }
}

/**
 * Consulta y renderiza los insumos que componen un producto específico.
 * @param {number} id_producto - ID del producto a consultar.
 */
async function cargarInsumosProducto(id_producto) {
    try {
        const res = await fetch(`http://localhost:3000/api/auth/producto-insumos/${id_producto}`);
        const data = await res.json();

        const tbody = document.getElementById("tabla-insumos-producto");
        tbody.innerHTML = "";

        data.forEach(item => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.nombre_insumo}</td>
                    <td>${item.cantidad_requerida}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarInsumoProducto(${item.id_producto}, ${item.id_insumo})">✕</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando insumos del producto:", error);
    }
}

/**
 * Asocia un insumo con su cantidad requerida al producto actual.
 */
async function agregarInsumoProducto() {
    const id_producto = document.getElementById("modal-id-producto").value;
    const id_insumo = document.getElementById("modal-select-insumo").value;
    const cantidad_requerida = document.getElementById("modal-cantidad-insumo").value;

    if (!id_insumo || !cantidad_requerida) {
        alert("Selecciona un insumo y la cantidad");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:3000/api/auth/producto-insumos/agregar", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_producto, id_insumo, cantidad_requerida })
        });

        if (res.ok) {
            cargarInsumosProducto(id_producto);
            document.getElementById("modal-cantidad-insumo").value = "";
        } else {
            alert("No se pudo agregar el insumo al producto.");
        }
    } catch (error) {
        console.error("Error al agregar insumo al producto:", error);
    }
}

/**
 * Desvincula un insumo de un producto.
 * @param {number} id_producto - ID del producto.
 * @param {number} id_insumo - ID del insumo a retirar.
 */
async function eliminarInsumoProducto(id_producto, id_insumo) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/api/auth/producto-insumos/eliminar`, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_producto, id_insumo })
        });

        if (res.ok) {
            cargarInsumosProducto(id_producto);
        } else {
            alert("No se pudo eliminar el insumo del producto.");
        }
    } catch (error) {
        console.error("Error al eliminar insumo del producto:", error);
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN
 * ══════════════════════════════════════════════════════════════════════════ */
cargarDatosP();
cargarCategorias();