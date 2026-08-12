const formulario  = document.getElementById('formularioC');

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        estado: document.getElementById("estado").value,
        
    };
    const respuesta = await fetch("http://localhost:3000/api/auth/agregarCategoria",

        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        }
    );
    const resultado = await respuesta.text();
    alert(resultado);

    formulario.reset();
});

const btnlimpiar = document.getElementById("limpiar-btn");
btnlimpiar.addEventListener("click", () => {
    formulario.reset();
});

async function cargarDatosC() {
    console.log("Entró a la función");
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarCategoria", {
            method: "GET"
        });   
        console.log("Respuesta", res);
        const data = await res.json();
        console.log("Datos", data);

        const tabla = document.getElementById("tablaBody1");
        console.log("Tabla encontrada:", tabla);
        console.log("cantidad de registros:", data.length);
        tabla.innerHTML = "";

        data.forEach(item => {
            tabla.innerHTML += `
                <tr>
                    <td>${item.id_categoria}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.estado}</td>
                    <td>
                        <button class="btn-editar-categoria" Onclick="mensajeEditar(); actualizarCategoria(${item.id_categoria}, '${item.nombre}', '${item.descripcion}', '${item.estado}')">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                        </button> 
                        <button class="${item.estado == 'activa'? 'btn-eliminar' : 'btn-editar-categoria'}"
                            onclick="toggleActivo(${item.id_categoria}, '${item.estado}')">
                            <i class="fa-solid fa-${item.estado == 'activa'? 'ban' : 'check'}"></i>
                            ${item.estado == 'activa'? 'Desactivar' : 'Activar'}
                        </button>
                </tr>           
            `;

        });
    } catch (error) {
        console.log("Error cargando datos:", error);
    }
    
}
function actualizarCategoria(id_categoria, nombre, descripcion, estado){
    // Llena el modal con los datos actuales
    document.getElementById("modal-id-categoria").value = id_categoria;
    document.getElementById("modal-nombre-categoria").value = nombre;
    document.getElementById("modal-descripcion-categoria").value = descripcion;
    document.getElementById("modal-estado-categoria").value = estado;
 

    // Muestra el modal
    document.getElementById("modalActualizarCategoria").style.display = "flex";
}
function cerrarModalC() {
    document.getElementById("modalActualizarCategoria").style.display ="none";
}

async function guardarActualizacionC() {
    const id_categoria = document.getElementById("modal-id-categoria").value;
    const nombre = document.getElementById("modal-nombre-categoria").value;
    const descripcion = document.getElementById("modal-descripcion-categoria").value;
    const estado = document.getElementById("modal-estado-categoria").value;

    const res = await fetch (`http://localhost:3000/api/auth/actualizarCategoria/${id_categoria}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({nombre, descripcion, estado})
    });

    const data = await res.json();
    console.log(data);

    cerrarModalC();
    cargarDatosC();
    
}
async function toggleActivo(id_categoria, estadoActual) {
    let nuevoEstado;

    if(estadoActual === 'activa'){
        nuevoEstado = 'inactiva';
    } else {
        nuevoEstado = 'activa';
    }
    console.log("Nuevo estado:", nuevoEstado);

    try{
        const response = await fetch (`http://localhost:3000/api/auth/categorias/desactivar/${id_categoria}`, {
            method: "PUT",
            headers: { 
            "Content-Type": "application/json" 
            },
            body: JSON.stringify({estado: nuevoEstado})
        });
        const data = await response.json();
        alert(`Estado cambiado a ${nuevoEstado}`);
        cargarDatosC();
    }catch (error) {
        console.log("Error actualizando estado:", error);
    }
     
}
function mostrarMensajeEstado (){
    alert("Este campo no se puede editar. Si desea activar o desactivar está, de click en el boton al lado de editar ");
}

function mensajeEditar (){
    alert("El formulario para editar esta categoría aparece en la parte de abajo.")
}