/**
 * @file rastreo-cliente.js
 * @description Módulo de seguimiento y rastreo de pedidos para clientes.
 *              Consulta el estado de un pedido por su número de orden
 *              e ilumina los pasos interactivos de la línea de tiempo.
 */

/**
 * Consulta el estado del pedido ingresado por el cliente y actualiza visualmente
 * la barra de progreso (pendiente, en preparación, listo, entregado, cancelado).
 */
async function buscarPedidoClientSide() {
    const id_pedido = document.getElementById('num-pedido').value.trim();
    const contenedorResultado = document.getElementById('resultado-rastreo');

    // Elementos de texto de la interfaz
    const txtId = document.getElementById('txt-id-pedido');
    const txtEstado = document.getElementById('txt-estado');

    // Elementos de los pasos de la línea de tiempo
    const stepPendiente = document.getElementById('step-pendiente');
    const stepPreparacion = document.getElementById('step-preparacion');
    const stepListo = document.getElementById('step-listo');
    const stepEntregado = document.getElementById('step-entregado');

    if (!id_pedido) {
        alert("Por favor, ingresa un número de pedido.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/auth/pedidos/consultar/${id_pedido}`);

        if (!res.ok) {
            alert(`No se encontró ningún pedido con el número #${id_pedido}`);
            if (contenedorResultado) contenedorResultado.style.display = 'none';
            return;
        }

        const data = await res.json();

        // Asignar los datos del backend al HTML
        if (txtId) txtId.textContent = data.id_pedido;
        if (txtEstado) {
            txtEstado.textContent = data.estado;
            txtEstado.style.color = '';
        }

        if (contenedorResultado) contenedorResultado.style.display = 'block';

        // 1. Limpiar estados previos de los pasos
        const steps = [stepPendiente, stepPreparacion, stepListo, stepEntregado];
        steps.forEach(step => {
            if (step) step.classList.remove('active', 'cancelado');
        });

        // 2. Iluminar la línea de tiempo según el estado del pedido
        const estado = (data.estado || '').toLowerCase();
        switch (estado) {
            case 'pendiente':
                if (stepPendiente) stepPendiente.classList.add('active');
                break;

            case 'en preparacion':
                if (stepPendiente) stepPendiente.classList.add('active');
                if (stepPreparacion) stepPreparacion.classList.add('active');
                break;

            case 'listo':
                if (stepPendiente) stepPendiente.classList.add('active');
                if (stepPreparacion) stepPreparacion.classList.add('active');
                if (stepListo) stepListo.classList.add('active');
                break;

            case 'entregado':
                if (stepPendiente) stepPendiente.classList.add('active');
                if (stepPreparacion) stepPreparacion.classList.add('active');
                if (stepListo) stepListo.classList.add('active');
                if (stepEntregado) stepEntregado.classList.add('active');
                break;

            case 'cancelado':
                if (stepPendiente) stepPendiente.classList.add('cancelado');
                if (txtEstado) txtEstado.style.color = '#dc3545';
                break;

            default:
                break;
        }

    } catch (error) {
        console.error("Error al conectar con la API de rastreo:", error);
        alert("Hubo un problema al conectar con el servidor de Antojitos.");
    }
}