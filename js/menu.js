//Cargar menú
console.log("Menú cargado")
let todosLosProductos = [];
async function cargarMenu() {
    console.log("Entró a la función");
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarMenu", {
            method: "GET"
        });   
        console.log("Respuesta", res);
        const data = await res.json();
        console.log("Datos", data);

        const contenedor = document.getElementById("producto-menu");
        console.log("Productos encontrados:", contenedor);
        console.log("cantidad de registros:", data.length);

        contenedor.innerHTML = "";

        const categorias = {}; //Agrupa los productos por categoría

        data.forEach(item => {
            todosLosProductos.push(item);
            if (!categorias[item.nombre_categoria]){
                categorias[item.nombre_categoria] = [];
            }
            categorias[item.nombre_categoria].push(item);
        });

        console.log("Categorías:", categorias);

        //Crear secciones por categoróa
        for (const categoria in categorias) {
            let cards = "";
            categorias[categoria].forEach(item => {
                cards += `
                    <div class="producto-card">
                        <img src="http://localhost:3000/img/${item.imagen}" alt="${item.nombre}">
                        <h2>${item.nombre}</h2>
                        <h3>$${Number(item.precio).toLocaleString("es-CO",{minimumFractionDigits: 0,maximumFractionDigits: 0})}</h3>
                        <p>${item.descripcion}</p>
                        <button class="btn-contenedor-productos"
                            onclick="agregarCarrito(${item.id_producto})">
                            Agregar al Carrito
                    </button>                
                    </div>  
                `;
            });
            
            contenedor.innerHTML += `
                <section class="categoria-section">
                    <h1 class="titulo-categoria">${categoria}</h1>
                    <div class="contenido-contendor-productos">${cards}</div>
                </section>
            `;
        }
            //Generar botones de filtro dinámicamente
            const filtrosDiv = document.getElementById("filtros");
            //Se agrega la categoría 'Todas' al inicio
            filtrosDiv.innerHTML += `
                <button class="btn-filtro" onclick="filtrar('todas', this)">
                Todas</button>`;

            for (const categoria in categorias){
                filtrosDiv.innerHTML += `
                <button class="btn-filtro" onclick="filtrar('${categoria}', this)">
                ${categoria}</button>
                `;
            }

    } catch (error) {
        console.log("Error cargando menú:", error);
    }
    
}


function filtrar (categoria, btn) {
    console.log("Filtrando:", categoria);
    console.log("Secciones encontradas:", document.querySelectorAll(".categoria-section").length)
    //Actualizar botón activo
    document.querySelectorAll(".btn-filtro").forEach(b => {
        b.classList.remove("activo");
    });
    btn.classList.add("activo");
    document.querySelectorAll(".categoria-section").forEach(section =>{  
        if (categoria == "todas") {
            section.style.display = "block";
        }else {
            const titulo = section.querySelector(".titulo-categoria").textContent;
            section.style.display = titulo == categoria ? "block" : "none";
        }
    });
}
function abrirCarrito (){
    document.getElementById("panel-carrito").classList.remove('cerrado');
    document.getElementById("overlay").style.display = "block";
}
function cerrarCarrito (){
    document.getElementById("panel-carrito").classList.add('cerrado');
    document.getElementById("overlay").style.display = "none";
}

let carrito = [];

function agregarCarrito(id_producto) {
    //Busca el producto en los datos
    const producto = todosLosProductos.find(p => p.id_producto == id_producto);

    //¿Ya está en el carrito?
    const existe = carrito.find(p => p.id_producto == id_producto);

    if (existe) {
        existe.cantidad++;
    }else {
        carrito.push({...producto, cantidad: 1});
    }
    actualizarCarrito();
    abrirCarrito();

}

function actualizarCarrito () {
    const itemsDiv = document.getElementById("carrito-items");
    itemsDiv.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        itemsDiv.innerHTML +=`
            <div class="carrito-items">
                <img src="http://localhost:3000/img/${item.imagen}" width="50px">
                <div style="flex: 1;">
                    <p style="margin:0; font-weight:bold;">${item.nombre}</p>
                    <p style="margin:0; color:#ff6b6b;">$${Number(item.precio).toLocaleString("es-CO",{minimumFractionDigits: 0,maximumFractionDigits: 0})}</p>
                </div>
                <div class="cantidad-control">
                    <button onclick="cambiarCantidad(${item.id_producto}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id_producto}, 1)">+</button>
                </div>
                <button onclick="eliminarDelCarrito(${item.id_producto})" 
                style="color:red; border:none; background:none; cursor:pointer; font-size: 16px; font-weight:bold; margin-left: auto;">Eliminar</button>   
            </div>
        `;
    });
    
    document.getElementById("carrito-total").textContent = `$${total.toLocaleString()}`;
    const totalItems =carrito.reduce((sum, item)=> sum +item.cantidad,0);
    document.getElementById("carrito-count").textContent = totalItems;
}
 function cambiarCantidad(id_producto, cambio){
    const item = carrito.find(p => Number(p.id_producto) === Number(id_producto));
    item.cantidad += cambio;

    if (item.cantidad <= 0){
        eliminarDelCarrito(id_producto);

    }else{
        actualizarCarrito();
    }
 }
function eliminarDelCarrito(id_producto) {
    carrito = carrito.filter(p => p.id_producto != id_producto);
    actualizarCarrito();
}

function confirmarPedido(){
    alert("Ingresa tus datos al final de la página para confirmar tu pedido");
    if (carrito.length==0){
        alert("Tu carrito está vacío!");
        return;
    }
    //Muestra el total en el modal
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    document.getElementById("modal-total").textContent = `$${total.toLocaleString()}`;


    document.getElementById("modal-pedido").style.display = "flex";
}
function cerrarModalPedido (){
    document.getElementById("modal-pedido").style.display = "none";
}

 cargarMenu();
     //Muestra/oculta campo dirección según tipo de entrega
document.getElementById("pedido-tipo-entrega").addEventListener("change", (e) => {
        console.log("Tipo entrega:", e.target.value);
        const campoDireccion = document.getElementById("campo-direccion");
        if (e.target.value === "domicilio"){
            campoDireccion.style.display = "block";
        }else{
            campoDireccion.style.display = "none";
        }
});

async function enviarPedido() {
    const nombre = document.getElementById("pedido-nombre").value;
    const telefono = document.getElementById("pedido-telefono").value;
    const correo = document.getElementById("pedido-correo").value;
    const direccion = document.getElementById("pedido-direccion").value;
    const tipo_entrega = document.getElementById("pedido-tipo-entrega").value;
    const notas = document.getElementById("pedido-nota").value;
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    console.log("Datos cliente:", {nombre, telefono, correo, direccion});
    console.log("Total:", total);
    console.log("Carrito:", carrito);

    //Validar campos
    if (!nombre || !telefono){
        alert("Por favor ingresa tu nombre y teléfono");
        return;
    }
    try {
        //1. Registrar cliente
        const resCliente = await fetch("http://localhost:3000/api/auth/clientes/agregar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nombre, telefono, direccion, correo})
        });   
        const dataCliente = await resCliente.json();
        const id_cliente = dataCliente.id_cliente;

        //2. Registrar pedido
        const resPedido = await fetch("http://localhost:3000/api/auth/pedidos/agregar", {
          method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id_cliente, tipo_entrega, metodo_pago: "efectivo" , total, notas})
        });   
        const dataPedido = await resPedido.json();
        console.log("Pedido:", dataPedido);
        const id_pedido = dataPedido.id_pedido;
        console.log("id_pedido:", id_pedido);

        //3. Registrar detalle por cada producto
        for (const item of carrito) {
            await fetch ("http://localhost:3000/api/auth/detalle/agregar", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id_pedido,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio,
                    subtotal: item.precio * item.cantidad
                })
            });
        }

        //4. Limpiar carrito y cerrar modales
        alert(`¡Pedido confirmado! tu número de pedido es #${id_pedido}`);
        carrito = [];
        actualizarCarrito();
        cerrarModalPedido();
        cerrarCarrito();
        await fetch("http://localhost:3000/api/auth/inventario/descontar", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({id_pedido})
    });


    } catch (error) {
        console.log("Erroro:", error);
        alert("Hubo un error al procesar tu pedido");
        
    }
    
}


