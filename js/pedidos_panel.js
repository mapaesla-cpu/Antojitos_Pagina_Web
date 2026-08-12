async function cargarPedidos() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/pedidos/consultar");
        const data = await res.json();

        const tabla = document.getElementById("tablaBody");
        tabla.innerHTML = "";

        data.forEach(item => {
            tabla.innerHTML += `
                <tr>
                    <td>#${item.id_pedido}</td>
                    <td>${item.nombre_cliente}</td>
                    <td>${item.telefono}</td>
                    <td>${new Date(item.fecha_pedido).toLocaleDateString()}</td>
                    <td>${item.tipo_entrega}</td>
                    <td>$${Number(item.total).toLocaleString()}</td>
                    <td>
                        <select onchange="cambiarEstado(${item.id_pedido}, this.value)">
                            <option ${item.estado == 'pendiente' ? 'selected' : ''}>pendiente</option>
                            <option ${item.estado == 'en preparacion' ? 'selected' : ''}>en preparacion</option>
                            <option ${item.estado == 'listo' ? 'selected' : ''}>listo</option>
                            <option ${item.estado == 'entregado' ? 'selected' : ''}>entregado</option>
                            <option ${item.estado == 'cancelado' ? 'selected' : ''}>cancelado</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-editar" onclick="verDetalle(${item.id_pedido})">
                            <i class="fa-solid fa-eye"></i> Ver detalle
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.log("Error:", error);
    }
}

async function cambiarEstado(id_pedido, estado) {
    console.log(id_pedido, estado);
    await fetch(`http://localhost:3000/api/auth/pedidos/estado/${id_pedido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
    });
    cargarPedidos();
}

async function verDetalle(id_pedido) {
    const res = await fetch(`http://localhost:3000/api/auth/pedidos/detalle/${id_pedido}`);
    const data = await res.json();

    document.getElementById("detalle-id").textContent = id_pedido;
    document.getElementById("detalle-cliente").textContent = data.pedido.nombre_cliente;
    document.getElementById("detalle-telefono").textContent = data.pedido.telefono;
    document.getElementById("detalle-tipo").textContent = data.pedido.tipo_entrega;
    document.getElementById("detalle-notas").textContent = data.pedido.notas || "Ninguna";
    document.getElementById("detalle-total").textContent = `$${Number(data.pedido.total).toLocaleString()}`;

    const tbody = document.getElementById("detalle-productos");
    tbody.innerHTML = "";
    data.detalle.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.nombre_producto}</td>
                <td>${item.cantidad}</td>
                <td>$${Number(item.precio_unitario).toLocaleString()}</td>
                <td>$${Number(item.subtotal).toLocaleString()}</td>
            </tr>
        `;
    });

    document.getElementById("modalDetalle").style.display = "flex";
}

function cerrarDetalle() {
    document.getElementById("modalDetalle").style.display = "none";
}

document.addEventListener("DOMContentLoaded", cargarPedidos);