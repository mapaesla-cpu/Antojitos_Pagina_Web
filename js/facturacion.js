let todasLasFacturas = [];

async function cargarFacturas() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/facturas/consultar");
        console.log("Status:", res.status); // ← agrega
        const data = await res.json();
        console.log("Facturas:", data); // ← agrega
        todasLasFacturas = data;
        mostrarFacturas(todasLasFacturas);
    } catch (error) {
        console.log("Error:", error);
    }
}

function mostrarFacturas(facturas) {
    const tabla = document.getElementById("tablaBody");
    tabla.innerHTML = "";

    facturas.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.numero_factura}</td>
                <td>${new Date(item.fecha_emision).toLocaleDateString()}</td>
                <td>${item.nombre_cliente}</td>
                <td>$${Number(item.total).toLocaleString()}</td>
                <td>${item.estado}</td>
                <td>
                    <button class="btn-editar" onclick="verFactura(${item.id_factura})">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                </td>
            </tr>
        `;
    });
}

function buscarFactura() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const filtradas = todasLasFacturas.filter(f =>
        f.numero_factura.toLowerCase().includes(texto) ||
        f.nombre_cliente.toLowerCase().includes(texto)
    );
    mostrarFacturas(filtradas);
}

async function verFactura(id) {
    const res = await fetch(`http://localhost:3000/api/auth/facturas/ver/${id}`);
    const data = await res.json();
    console.log("Data factura:", data);
    console.log("Detalle:", data.detalle);

    document.getElementById("factura-numero").textContent = data.factura.numero_factura;
    document.getElementById("factura-fecha").textContent = new Date(data.factura.fecha_emision).toLocaleDateString();
    document.getElementById("factura-cliente").textContent = data.factura.nombre_cliente;
    document.getElementById("factura-telefono").textContent = data.factura.telefono;
    document.getElementById("factura-tipo").textContent = data.factura.tipo_entrega;
    document.getElementById("factura-subtotal").textContent = `$${Number(data.factura.subtotal).toLocaleString()}`;
    document.getElementById("factura-impuesto").textContent = `$${Number(data.factura.impuesto).toLocaleString()}`;
    document.getElementById("factura-total").textContent = `$${Number(data.factura.total).toLocaleString()}`;

    const tbody = document.getElementById("factura-productos");
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

    document.getElementById("modalFactura").style.display = "flex";
}

function cerrarFactura() {
    document.getElementById("modalFactura").style.display = "none";
}

function imprimirFactura() {
    const contenido = document.getElementById("contenido-factura").innerHTML;
    const ventana = window.open("", "_blank");
    ventana.document.write(`
        <html>
            <head>
                <title>Factura</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    .factura-nota { margin-top: 20px; font-size: 12px; color: gray; }
                    .factura-botones { display: none; }
                </style>
            </head>
            <body>${contenido}</body>
        </html>
    `);
    ventana.document.close();
    ventana.print();
}

document.addEventListener("DOMContentLoaded", cargarFacturas);