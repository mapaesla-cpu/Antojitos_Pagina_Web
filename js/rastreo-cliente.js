async function buscarPedidoClientSide() {
    const id_pedido = document.getElementById('num-pedido').value;
    const contenedorResultado = document.getElementById('resultado-rastreo');
    
    // Elementos de texto en la interfaz
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
    console.log(id_pedido);
    try {
        // Hacemos la petición GET a la ruta pública del backend
        const res = await fetch(`http://localhost:3000/api/auth/pedidos/consultar/${id_pedido}`);
        
        if (!res.ok) {
            alert("No se encontró ningún pedido con el número #" + id_pedido);
            contenedorResultado.style.display = 'none';
            return;
        }

        const data = await res.json();
        
        // Asignar los datos del backend al HTML
        txtId.textContent = data.id_pedido;
        txtEstado.textContent = data.estado;
        
        // Mostrar el bloque con los resultados
        contenedorResultado.style.display = 'block';

        // 1. Limpiar clases previas de todos los pasos para evitar errores al buscar varios seguidos
        const steps = [stepPendiente, stepPreparacion, stepListo, stepEntregado];
        steps.forEach(step => {
            step.classList.remove('active', 'cancelado');
        });

        // 2. Lógica para iluminar la línea de tiempo según el estado en MySQL
        switch (data.estado.toLowerCase()) {
            case 'pendiente':
                stepPendiente.classList.add('active');
                break;

            case 'en preparacion':
                stepPendiente.classList.add('active');
                stepPreparacion.classList.add('active');
                break;

            case 'listo':
                stepPendiente.classList.add('active');
                stepPreparacion.classList.add('active');
                stepListo.classList.add('active');
                break;

            case 'entregado':
                stepPendiente.classList.add('active');
                stepPreparacion.classList.add('active');
                stepListo.classList.add('active');
                stepEntregado.classList.add('active');
                break;

            case 'cancelado':
                // Si está cancelado, pintamos el primer nodo de color rojo de alerta
                stepPendiente.classList.add('cancelado');
                txtEstado.style.color = '#dc3545'; // Cambia el texto del estado a rojo
                break;
                
            default:
                console.log("Estado no reconocido");
        }

    } catch (error) {
        console.error("Error al conectar con la API de rastreo:", error);
        alert("Hubo un problema al conectar con el servidor de Antojitos.");
    }
}