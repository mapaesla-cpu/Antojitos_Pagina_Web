async function cargarDashboard() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/dashboard/estadisticas");
        const data = await res.json();

        // Estadísticas
        document.getElementById("pedidos-hoy").textContent = data.pedidosHoy;
        document.getElementById("pedidos-pendientes").textContent = data.pendientes;
        document.getElementById("ingresos-hoy").textContent = `$${Number(data.ingresos).toLocaleString()}`;

        // Productos más vendidos
        const lista = document.getElementById("lista-populares");
        lista.innerHTML = "";
        data.populares.forEach((item, index) => {
            lista.innerHTML += `
                <li>
                    <span>#${index + 1}</span>
                    <span>${item.nombre}</span>
                    <span>${item.total_vendido} vendidos</span>
                </li>
            `;
        });

    } catch (error) {
        console.log("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarDashboard);

document.addEventListener('DOMContentLoaded', () => {
    cargarAlertasStock();
});

async function cargarAlertasStock() {
    try {
        const response = await fetch("http://localhost:3000/api/auth/insumos/alertas");
        const insumosCriticos = await response.json();
        
        const contenedor = document.getElementById('contenedor-alertas');
        const lista = document.getElementById('lista-alertas');
        
        if (insumosCriticos.length > 0) {
            contenedor.style.display = 'block'; // Muestra el cuadro de alerta
            lista.innerHTML = ''; // Limpia contenido previo
            
            insumosCriticos.forEach(item => {
                const li = document.createElement('li');
                // Mostramos el stock actual y advertimos cuál era su mínimo configurado
                li.innerHTML = `⚠️ El insumo <strong>${item.nombre}</strong> está en nivel crítico. Quedan solo <span>${item.cantidad_disponible}</span> unidades (Tu mínimo establecido es de ${item.stock_minimo}).`;
                lista.appendChild(li);
            });
        } else {
            contenedor.style.display = 'none'; // Si todo está bien, ocultamos el contenedor
        }
    } catch (error) {
        console.error('Error cargando las alertas de stock:', error);
    }
}