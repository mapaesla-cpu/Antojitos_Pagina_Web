const formulario  = document.getElementById('formulario');

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        unidad: document.getElementById("unidad").value,
        cantidad: document.getElementById("cantidad").value,
        stock: document.getElementById("stock").value
    };
    const respuesta = await fetch("http://localhost:3000/api/auth/agregar",

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

async function cargarDatos() {
    console.log("Entró a la función");
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultar", {
            method: "GET"
        });   
        console.log("Respuesta", res);
        const data = await res.json();
        console.log("Datos", data);

        const tabla = document.getElementById("tablaBody");
        console.log("Tabla encontrada:", tabla);
        console.log("cantidad de registros:", data.length);
        tabla.innerHTML = "";

        data.forEach(item => {
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
                        <button class="btn-entrada" Onclick="abrirEntrada(${item.id_insumo}, '${item.nombre}', '${item.unidad_medida}', ${item.cantidad_disponible})">
                            <i class="fa-solid fa-arrow-right-to-bracket"></i> Entrada
                        </button>
                        <button class="btn-salida" Onclick="abrirSalida(${item.id_insumo}, '${item.nombre}', '${item.unidad_medida}', ${item.cantidad_disponible})">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i> Salida
                        </button>
                        <button class="btn-editar" Onclick="actualizar(${item.id_insumo}, '${item.nombre}', '${item.unidad_medida}', ${item.cantidad_disponible}, ${item.stock_minimo})">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                        </button> 
                        <button class="btn-eliminar" Onclick="eliminar(${item.id_insumo})">
                            <i class="fa-solid fa-trash"></i> Eliminar
                        </button>       
                    </div>  
                    </td>
                </tr>           
            `;

        });
    } catch (error) {
        console.log("Error cargando datos:", error);
    }
    
}
function actualizar(id_insumo, nombre, unidad_medida, cantidad_disponible, stock_minimo){
    alert("Ingrese los datos en el formulario al final de la página");
    // Llena el modal con los datos actuales
    document.getElementById("modal-id").value = id_insumo;
    document.getElementById("modal-nombre").value = nombre;
    document.getElementById("modal-unidad").value = unidad_medida;
    document.getElementById("modal-cantidad").value = cantidad_disponible;
    document.getElementById("modal-stock").value = stock_minimo;

    // Muestra el modal
    document.getElementById("modalActualizar").style.display = "flex";
}
function cerrarModal() {
    document.getElementById("modalActualizar").style.display ="none";
}

async function guardarActualizacion() {
    const id_insumo = document.getElementById("modal-id").value;
    const nombre = document.getElementById("modal-nombre").value;
    const unidad_medida = document.getElementById("modal-unidad").value;
    const cantidad_disponible = document.getElementById("modal-cantidad").value;
    const stock_minimo = document.getElementById("modal-stock").value;

    const res = await fetch (`http://localhost:3000/api/auth/actualizar/${id_insumo}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({nombre, unidad_medida, cantidad_disponible, stock_minimo})
    });

    const data = await res.json();
    console.log(data);

    cerrarModal();
    cargarDatos();
    
}
async function eliminar(id_insumo) {
    if (confirm("¿Seguro que deseas eliminar este insumo?")){
        await fetch (`http://localhost:3000/api/auth/eliminar/${id_insumo}`, {
            method: "DELETE"
        });
        cargarDatos();
    }
    
}
//Modal entrada
function abrirEntrada(id_insumo, nombre, unidad_medida, cantidad_disponible){
    alert("Ingrese los datos en el formulario al final de la página");
    // Llena el modal con los datos actuales
    document.getElementById("modal-entrada-id").value = id_insumo;
    document.getElementById("modal-entrada-nombre").value = nombre;
    document.getElementById("modal-entrada-unidad").textContent = unidad_medida;
    document.getElementById("modal-entrada-stock-actual").value = cantidad_disponible;
   

    //Limpiar los campos que debe llenar el administrador
    document.getElementById("modal-entrada-cantidad").value = "";
    document.getElementById("modal-entrada-motivo").value = "";

    // Muestra el modal
    document.getElementById("modalEntrada").style.display = "flex";
}
async function guardarEntrada() {
    const id_insumo = document.getElementById("modal-entrada-id").value;
    const cantidad = document.getElementById("modal-entrada-cantidad").value;
    const motivo = document.getElementById("modal-entrada-motivo").value;

    if (!cantidad || cantidad <=0) {
        alert("Ingrese una catidad valida");
        return;
    }
    if (!motivo.trim()){
        alert("Ingrese el motivo de la entrada");
        return;
    }

    const token = localStorage.getItem("token");
    //const id_usuario = localStorage.getItem("id_usuario");
    
    const res = await fetch("http://localhost:3000/api/auth/insumos/entrada",{
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({id_insumo, cantidad, motivo})
    });

    const data = await res.json();
    console.log(data);

    if(!res.ok) {
        alert(data.error || "Error al registrar entrada");
        return;
    }
    alert(data.message);
    cerrarModalEntrada();
    cargarDatos();
}
function cerrarModalEntrada() {
    document.getElementById("modalEntrada").style.display ="none";
}

//Modal salida
function abrirSalida(id_insumo, nombre, unidad_medida, cantidad_disponible){
    alert("Ingrese los datos en el formulario al final de la página");
    // Llena el modal con los datos actuales
    document.getElementById("modal-salida-id").value = id_insumo;
    document.getElementById("modal-salida-nombre").value = nombre;
    document.getElementById("modal-salida-unidad").textContent = unidad_medida;
    document.getElementById("modal-salida-stock-actual").value = cantidad_disponible;
   

    //Limpiar los campos que debe llenar el administrador
    document.getElementById("modal-salida-cantidad").value = "";
    document.getElementById("modal-salida-motivo").value = "";

    // Muestra el modal
    document.getElementById("modalSalida").style.display = "flex";
}
async function guardarSalida() {
    const id_insumo = document.getElementById("modal-salida-id").value;
    const cantidad = document.getElementById("modal-salida-cantidad").value;
    const motivo = document.getElementById("modal-salida-motivo").value;

    if (!cantidad || cantidad <=0) {
        alert("Ingrese una catidad valida");
        return;
    }
    //const stockActual = parseFloat(document.getElementById("modal-salida-stock-actual").value);
    const stockActual = document.getElementById("modal-salida-stock-actual").value;

console.log("Cantidad solicitada:", cantidad);
console.log("Stock actual:", stockActual);
    

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
    console.log(data);

    if(!res.ok) {
        alert(data.error || "Error al registrar salida");
        return;
    }
    alert(data.message);
    cerrarModalSalida();
    cargarDatos();
}
function cerrarModalSalida() {
    document.getElementById("modalSalida").style.display ="none";
}
