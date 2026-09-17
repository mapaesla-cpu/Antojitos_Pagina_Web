// Al principio directo, sin DOMContentLoaded
const formularioP = document.getElementById('formularioP');
const btnlimpiar = document.getElementById("limpiar-btn");

formularioP.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id_categoria", document.getElementById("id_categoria").value);
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("imagen", document.getElementById("imagen").files[0]);
    formData.append("disponible", document.getElementById("disponible").value);

    const respuesta = await fetch("http://localhost:3000/api/auth/agregarProducto", {
        method: "POST",
        body: formData  // ← sin headers ni JSON.stringify
    });
    alert("Status:" + respuesta.status);
    const resultado = await respuesta.text();
    alert("Respuesta del servidor: " + resultado);
});

btnlimpiar.addEventListener("click", () => {
    formularioP.reset();
});

// Y al final del archivo llama las funciones directamente:
cargarDatosP();
cargarCategorias();

let todosLosProductos = [];

async function cargarDatosP() {
    console.log("Entró a la función");
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarProducto", {
            method: "GET"
        });   
        console.log("Respuesta", res);
        const data = await res.json();
        console.log("Datos", data);

        todosLosProductos = data;
        mostrarProductos(todosLosProductos);
    } catch (error) {
        console.log("Error cargando datos:", error);
    }
}

function mostrarProductos(productos) {
    const tabla = document.getElementById("tablaBody2");
    if (!tabla) return;
    tabla.innerHTML = "";

    productos.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.id_producto}</td>
                <td>${item.nombre_categoria}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion}</td>
                <td>${item.precio}</td>
                <td><img src="http://localhost:3000/img/${item.imagen}" width="50px"></td>
                <td>${item.disponible == 1 ? 'Si' : 'No'}</td>
                <td>
                    <button class="btn-editar-producto" Onclick="mensajeEditar(); actualizarProducto(${item.id_producto}, ${item.id_categoria}, '${item.nombre}', '${item.descripcion}', '${item.precio}','${item.imagen}','${item.disponible}')">
                        <i class="fa-solid fa-edit"></i>Editar
                    </button> 
                    <button class="${item.disponible == 1 ? 'btn-eliminar' : 'btn-editar-producto'}"
                        onclick="toggleActivo(${item.id_producto}, '${item.disponible}')">
                        <i class="fa-solid fa-${item.disponible == 1? 'ban' : 'check'}"></i>
                        ${item.disponible == 1 ? 'Desactivar' : 'Activar'}
                    </button>
                </td>
            </tr>           
        `;
    });
}

function buscarProducto() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtrados = todosLosProductos.filter(item =>
        String(item.id_producto).toLowerCase().includes(texto) ||
        (item.nombre && item.nombre.toLowerCase().includes(texto))
    );
    mostrarProductos(filtrados);
}

function actualizarProducto(id_producto, id_categoria, nombre, descripcion, precio, imagenArchivo, disponible){
    // Llena el modal con los datos actuales
    cargarCategoriasModal(id_categoria);
    document.getElementById("modal-id-producto").value = id_producto;
    document.getElementById("modal-id-categoria").value = id_categoria;
    document.getElementById("modal-nombre-producto").value = nombre;
    document.getElementById("modal-descripcion-producto").value = descripcion;
    document.getElementById("modal-precio-producto").value = precio;
    document.getElementById("modal-imagen-actual-producto").src = `http://localhost:3000/img/${imagenArchivo}`;
    document.getElementById("modal-disponible-producto").value = disponible;

    cargarInsumosModal();
    cargarInsumosProducto(id_producto);

    // Muestra el modal
    document.getElementById("modalActualizarProducto").style.display = "flex";

}
async function cargarCategoriasModal(idSeleccionado) {
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
}
function cerrarModalP() {
    document.getElementById("modalActualizarProducto").style.display ="none";
}

async function guardarActualizacionP() {
    const id_producto = document.getElementById("modal-id-producto").value;
    const id_categoria = document.getElementById("modal-id-categoria").value;
    const nombre = document.getElementById("modal-nombre-producto").value;
    const descripcion = document.getElementById("modal-descripcion-producto").value;
    const precio = document.getElementById("modal-precio-producto").value;
    const imagenArchivo = document.getElementById("modal-imagen-actual-producto").src.split("/").pop(); //toma el nombre de la imagen previa
    console.log("Imagen:", imagenArchivo); 
    const disponible = document.getElementById("modal-disponible-producto").value;
    const imagen = document.getElementById("modal-imagen-actual-producto").src.split("/").pop();

    const res = await fetch (`http://localhost:3000/api/auth/actualizarProducto/${id_producto}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json" 
        },
        
        body: JSON.stringify({id_categoria,nombre, descripcion, precio, imagen, disponible})
    });

    const data = await res.json();
    console.log(data);

    cerrarModalP();
    cargarDatosP();
    
}
async function toggleActivo(id_producto, estadoActual) {
    const nuevoEstado = estadoActual == 1 ? 0 : 1;


    if(confirm(estadoActual === 0 ?"Desactivar este prodcuto?" : "¿Activar este producto?")){
         await fetch (`http://localhost:3000/api/auth/producto/disponible/${id_producto}`, {
            method: "PUT",
            headers: { 
            "Content-Type": "application/json" 
            },
            body: JSON.stringify({disponible: nuevoEstado})

        });
        
        alert(`Estado cambiado`);
        console.log("Recargando datos");
        await cargarDatosP();
    }
}
     

function mostrarMensajeEstado (){
    alert("Este campo no se puede editar. Si desea activar o desactivar está, de click en el boton al lado de editar ");
}

function mensajeEditar (){
    alert("El formulario para editar este producto aparece en la parte de abajo.")
}
async function cargarCategorias() {
    const res = await fetch("http://localhost:3000/api/auth/consultarCategoria"); // ← sin doble a
    const categorias = await res.json();

    const select = document.getElementById("id_categoria");
    select.innerHTML = '<option value="">Selecciona una categoría</option>';

    categorias.forEach(cat => {
        select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
    });
}

// Cargar insumos en el select del modal
async function cargarInsumosModal() {
    const res = await fetch("http://localhost:3000/api/auth/consultar");
    const insumos = await res.json();

    const select = document.getElementById("modal-select-insumo");
    select.innerHTML = '<option value="">Selecciona un insumo</option>';

    insumos.forEach(insumo => {
        select.innerHTML += `<option value="${insumo.id_insumo}">${insumo.nombre}</option>`;
    });
}

// Cargar insumos actuales del producto
async function cargarInsumosProducto(id_producto) {
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
}

// Agregar insumo al producto
async function agregarInsumoProducto() {
    const id_producto = document.getElementById("modal-id-producto").value;
    const id_insumo = document.getElementById("modal-select-insumo").value;
    const cantidad_requerida = document.getElementById("modal-cantidad-insumo").value;

    if (!id_insumo || !cantidad_requerida) {
        alert("Selecciona un insumo y la cantidad");
        return;
    }

    await fetch("http://localhost:3000/api/auth/producto-insumos/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto, id_insumo, cantidad_requerida })
    });

    cargarInsumosProducto(id_producto);
}

// Eliminar insumo del producto
async function eliminarInsumoProducto(id_producto, id_insumo) {
    await fetch(`http://localhost:3000/api/auth/producto-insumos/eliminar`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto, id_insumo })
    });

    cargarInsumosProducto(id_producto);
}