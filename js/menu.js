/**
 * @file menu.js
 * @description Módulo de la carta/menú público para clientes.
 *              Permite listar productos por categorías, filtrarlos,
 *              administrar el carrito de compras y realizar pedidos en línea.
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  ESTADO GLOBAL
 * ══════════════════════════════════════════════════════════════════════════ */

/** @type {Array<Object>} Catálogo completo de productos disponibles */
let todosLosProductos = [];

/** @type {Array<Object>} Lista de productos actualmente añadidos al carrito */
let carrito = [];

/* ══════════════════════════════════════════════════════════════════════════
 *  CARGA Y RENDERIZADO DEL MENÚ
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Consulta los productos del menú desde el backend y genera las secciones por categoría.
 */
async function cargarMenu() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/consultarMenu", {
            method: "GET"
        });
        const data = await res.json();

        const contenedor = document.getElementById("producto-menu");
        if (!contenedor) return;

        contenedor.innerHTML = "";
        todosLosProductos = [];

        // Agrupar los productos por nombre de categoría
        const categorias = {};

        data.forEach(item => {
            todosLosProductos.push(item);
            if (!categorias[item.nombre_categoria]) {
                categorias[item.nombre_categoria] = [];
            }
            categorias[item.nombre_categoria].push(item);
        });

        // Crear secciones dinámicamente por categoría
        for (const categoria in categorias) {
            let cards = "";
            categorias[categoria].forEach(item => {
                cards += `
                    <div class="producto-card">
                        <img src="http://localhost:3000/img/${item.imagen}" alt="${item.nombre}">
                        <h2>${item.nombre}</h2>
                        <h3>$${Number(item.precio).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                        <p>${item.descripcion || ''}</p>
                        <button class="btn-contenedor-productos" onclick="agregarCarrito(${item.id_producto})">
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

        // Generar botones de filtro dinámicamente
        const filtrosDiv = document.getElementById("filtros");
        if (filtrosDiv) {
            filtrosDiv.innerHTML = `
                <button class="btn-filtro activo" onclick="filtrar('todas', this)">
                    Todas
                </button>`;

            for (const categoria in categorias) {
                filtrosDiv.innerHTML += `
                    <button class="btn-filtro" onclick="filtrar('${categoria}', this)">
                        ${categoria}
                    </button>
                `;
            }
        }

    } catch (error) {
        console.error("Error cargando menú:", error);
    }
}

/**
 * Filtra las secciones visibles del menú según la categoría seleccionada.
 * @param {string} categoria - Nombre de la categoría o 'todas'.
 * @param {HTMLElement} btn - Botón clickeado para aplicarle estilo activo.
 */
function filtrar(categoria, btn) {
    document.querySelectorAll(".btn-filtro").forEach(b => {
        b.classList.remove("activo");
    });
    if (btn) btn.classList.add("activo");

    document.querySelectorAll(".categoria-section").forEach(section => {
        if (categoria === "todas") {
            section.style.display = "block";
        } else {
            const titulo = section.querySelector(".titulo-categoria").textContent;
            section.style.display = titulo === categoria ? "block" : "none";
        }
    });
}

/* ══════════════════════════════════════════════════════════════════════════
 *  GESTIÓN DEL CARRITO DE COMPRAS
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre el panel lateral del carrito de compras.
 */
function abrirCarrito() {
    const panel = document.getElementById("panel-carrito");
    const overlay = document.getElementById("overlay");
    if (panel) panel.classList.remove('cerrado');
    if (overlay) overlay.style.display = "block";
}

/**
 * Cierra el panel lateral del carrito de compras.
 */
function cerrarCarrito() {
    const panel = document.getElementById("panel-carrito");
    const overlay = document.getElementById("overlay");
    if (panel) panel.classList.add('cerrado');
    if (overlay) overlay.style.display = "none";
}

/**
 * Añade un producto al carrito o incrementa su cantidad si ya existe.
 * @param {number} id_producto - Identificador único del producto.
 */
function agregarCarrito(id_producto) {
    const producto = todosLosProductos.find(p => p.id_producto == id_producto);
    if (!producto) return;

    const existe = carrito.find(p => p.id_producto == id_producto);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    abrirCarrito();
}

/**
 * Actualiza la interfaz del carrito (items, subtotal y badge de cantidad).
 */
function actualizarCarrito() {
    const itemsDiv = document.getElementById("carrito-items");
    if (!itemsDiv) return;

    itemsDiv.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        itemsDiv.innerHTML += `
            <div class="carrito-items">
                <img src="http://localhost:3000/img/${item.imagen}" width="50px" alt="${item.nombre}">
                <div style="flex: 1;">
                    <p style="margin:0; font-weight:bold;">${item.nombre}</p>
                    <p style="margin:0; color:#ff6b6b;">$${Number(item.precio).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
                <div class="cantidad-control">
                    <button onclick="cambiarCantidad(${item.id_producto}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id_producto}, 1)">+</button>
                </div>
                <button onclick="eliminarDelCarrito(${item.id_producto})" 
                    style="color:red; border:none; background:none; cursor:pointer; font-size: 16px; font-weight:bold; margin-left: auto;">
                    Eliminar
                </button>   
            </div>
        `;
    });

    const totalEl = document.getElementById("carrito-total");
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;

    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const countEl = document.getElementById("carrito-count");
    if (countEl) countEl.textContent = totalItems;
}

/**
 * Modifica la cantidad de un producto en el carrito.
 * @param {number} id_producto - ID del producto.
 * @param {number} cambio - Cantidad a sumar (+1) o restar (-1).
 */
function cambiarCantidad(id_producto, cambio) {
    const item = carrito.find(p => Number(p.id_producto) === Number(id_producto));
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id_producto);
    } else {
        actualizarCarrito();
    }
}

/**
 * Elimina un producto completamente del carrito.
 * @param {number} id_producto - ID del producto a retirar.
 */
function eliminarDelCarrito(id_producto) {
    carrito = carrito.filter(p => p.id_producto != id_producto);
    actualizarCarrito();
}

/* ══════════════════════════════════════════════════════════════════════════
 *  CONFIRMACIÓN Y ENVÍO DE PEDIDOS
 * ══════════════════════════════════════════════════════════════════════════ */

/**
 * Abre la ventana modal para capturar los datos del cliente y finalizar el pedido.
 */
function confirmarPedido() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const modalTotal = document.getElementById("modal-total");
    if (modalTotal) modalTotal.textContent = `$${total.toLocaleString()}`;

    const modal = document.getElementById("modal-pedido");
    if (modal) modal.style.display = "flex";
}

/**
 * Cierra la ventana modal de confirmación de pedido.
 */
function cerrarModalPedido() {
    const modal = document.getElementById("modal-pedido");
    if (modal) modal.style.display = "none";
}

/**
 * Envía el pedido al backend: crea cliente si aplica, registra pedido y sus detalles,
 * y descuenta insumos del inventario automáticamente.
 */
async function enviarPedido() {
    const nombre = document.getElementById("pedido-nombre").value.trim();
    const telefono = document.getElementById("pedido-telefono").value.trim();
    const correo = document.getElementById("pedido-correo").value.trim();
    const direccion = document.getElementById("pedido-direccion").value.trim();
    const tipo_entrega = document.getElementById("pedido-tipo-entrega").value;
    const notas = document.getElementById("pedido-nota").value.trim();
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    if (!nombre || !telefono || !correo) {
        alert("Por favor rellena todos los campos obligatorios (nombre, teléfono y correo).");
        return;
    }

    if (tipo_entrega === "domicilio" && !direccion) {
        alert("Por favor ingresa la dirección de entrega.");
        return;
    }

    try {
        // 1. Registrar o actualizar cliente
        const resCliente = await fetch("http://localhost:3000/api/auth/clientes/agregar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, telefono, direccion, correo })
        });
        const dataCliente = await resCliente.json();
        const id_cliente = dataCliente.id_cliente;

        // 2. Registrar pedido
        const resPedido = await fetch("http://localhost:3000/api/auth/pedidos/agregar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_cliente, tipo_entrega, metodo_pago: "efectivo", total, notas })
        });
        const dataPedido = await resPedido.json();
        const id_pedido = dataPedido.id_pedido;

        // 3. Registrar detalle por cada producto del carrito
        for (const item of carrito) {
            await fetch("http://localhost:3000/api/auth/detalle/agregar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_pedido,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio,
                    subtotal: item.precio * item.cantidad
                })
            });
        }

        // 4. Descontar insumos automáticamente del inventario
        await fetch("http://localhost:3000/api/auth/inventario/descontar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_pedido })
        });

        // 5. Notificar al cliente y limpiar estado
        alert(`¡Pedido confirmado con éxito! Tu número de pedido es #${id_pedido}`);
        carrito = [];
        actualizarCarrito();
        cerrarModalPedido();
        cerrarCarrito();

    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
    }
}

/* ══════════════════════════════════════════════════════════════════════════
 *  INICIALIZACIÓN Y EVENT LISTENERS
 * ══════════════════════════════════════════════════════════════════════════ */

const tipoEntregaSelect = document.getElementById("pedido-tipo-entrega");
if (tipoEntregaSelect) {
    tipoEntregaSelect.addEventListener("change", (e) => {
        const campoDireccion = document.getElementById("campo-direccion");
        if (campoDireccion) {
            campoDireccion.style.display = e.target.value === "domicilio" ? "block" : "none";
        }
    });
}

cargarMenu();
