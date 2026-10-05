# Antojitos — Plataforma Web de Restaurante y Gestión de Pedidos

Bienvenido al repositorio oficial de **Antojitos**, una solución web integral diseñada para la venta en línea de comida rápida, gestión de pedidos en tiempo real, control de inventario de insumos y panel de administración integral.

---

## Tabla de Contenido

- [Características Principales](#-características-principales)
  - [Módulo de Clientes (Público)](#módulo-de-clientes-público)
  - [Panel Administrativo (Privado)](#panel-administrativo-privado)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Seguridad](#-seguridad)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Licencia](#-licencia)

---

## Características Principales

### Módulo de Clientes (Público)

- **Página de Inicio Interactiva:** Carrusel dinámico con los platos y productos más vendidos.
- **Menú Digital y Filtrado Dinámico:** Navegación por categorías de productos con carga asíncrona.
- **Carrito de Compras en Tiempo Real:** Panel lateral interactivo para sumar, restar y calcular totales al instante.
- **Checkout y Envío de Pedidos:** Formulario para pedidos a domicilio o recogida en tienda, con descuento automático de insumos en el inventario.
- **Rastreo de Pedidos en Línea:** Línea de tiempo interactiva donde el cliente ingresa su número de orden y consulta el avance (_pendiente_, _en preparación_, _listo_, _entregado_ o _cancelado_).
- **Contacto Automatizado:** Envío de mensajes y solicitudes vía correo electrónico mediante integración con Nodemailer.

### Panel Administrativo (Privado)

- **Autenticación y Roles:** Acceso seguro con JSON Web Tokens (JWT) y contraseñas cifradas con `bcryptjs`.
- **Dashboard Estadístico:** Métricas de ingresos del día, pedidos pendientes, total vendido y alertas de inventario crítico.
- **Gestión de Menú y Categorías:** Operaciones CRUD completas para activar/desactivar y actualizar productos y categorías.
- **Subida Segura de Imágenes:** Carga y validación estricta de tipos MIME y tamaño máximo para fotos de productos mediante Multer.
- **Control de Insumos y Recetas:** Vinculación de insumos requeridos por producto y registro de movimientos de almacén (entradas y salidas).
- **Gestión de Pedidos:** Cambio de estado operativo en tiempo real y visualización de detalles completos de cada orden.
- **Facturación e Impresión:** Generación de facturas con subtotal e impuestos, además de vista lista para imprimir.
- **Configuración del Negocio:** Modificación de horarios de apertura/cierre, NIT, teléfono, dirección y cambio de contraseña.

---

## Tecnologías Utilizadas

| Capa                  | Tecnología / Librería                                                | Descripción                                                                                  |
| --------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Backend**           | [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/) | Entorno de ejecución y framework HTTP para la API REST                                       |
| **Base de Datos**     | [MySQL](https://www.mysql.com/) / `mysql2`                           | Base de datos relacional para usuarios, productos, pedidos e inventario                      |
| **Seguridad**         | `helmet`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`           | Protección de encabezados HTTP, mitigación de fuerza bruta, hash de contraseñas y tokens JWT |
| **Carga de Archivos** | `multer`                                                             | Subida controlada de imágenes con filtros y límite de 5MB                                    |
| **Mailing**           | `nodemailer`                                                         | Servicio de notificación de correos transaccionales y de contacto                            |
| **Frontend**          | HTML5, CSS3 Nativo, Vanilla JavaScript (ES6+)                        | Interfaz reactiva, modular y sin dependencias pesadas                                        |
| **Iconografía**       | [FontAwesome](https://fontawesome.com/)                              | Iconografía vectorial para acciones e interfaces                                             |

---

## Estructura del Proyecto

```text
Antojitos_Pagina_Web/
├── config/
│   └── multer.js              # Configuración y filtros de subida de imágenes
├── controllers/
│   ├── authController.js       # Registro, login y cambio de contraseña
│   ├── categoriaController.js  # Lógica de categorías
│   ├── configuracionController.js # Métricas y datos del negocio
│   ├── contactoController.js   # Manejo de correos de contacto
│   ├── insumoController.js     # Gestión de stock e inventario
│   ├── pedidoController.js     # Procesamiento y ciclo de vida de pedidos
│   └── productoController.js   # Gestión de catálogo y recetas
├── css/
│   ├── index.css               # Estilos de la tienda y páginas públicas
│   └── stylesPanel.css         # Estilos del panel de control administrativo
├── js/
│   ├── categorias.js           # Lógica frontend de categorías
│   ├── configuracion.js        # Lógica de configuración y perfil
│   ├── contacto.js             # Lógica del formulario de contacto
│   ├── dashboard.js            # Gráficos y alertas de stock
│   ├── facturacion.js          # Módulo de facturas e impresión
│   ├── index.js                # Lógica del home y destacados
│   ├── insumos.js              # Gestión de inventario y movimientos
│   ├── login.js                # Flujo de autenticación
│   ├── menu.js                 # Menú, carrito y checkout
│   ├── pedidos_panel.js        # Panel de pedidos
│   ├── productos.js            # Catálogo e insumos por producto
│   ├── rastreo-cliente.js      # Línea de tiempo de pedidos
│   ├── registrar-usuario.js    # Creación de administradores/empleados
│   └── script.js               # Utilidades globales (sidebar, footer, navegación)
├── middlewares/
│   └── verificarToken.js       # Middleware de validación de JWT para rutas protegidas
├── models/
│   ├── categoriaModel.js
│   ├── insumoModel.js
│   ├── pedidoModel.js
│   ├── productoModel.js
│   └── usuarioModel.js
├── routes/
│   ├── authRoutes.js
│   ├── categoriaRoutes.js
│   ├── configuracionRoutes.js
│   ├── contactoRoutes.js
│   ├── insumoRoutes.js
│   ├── pedidoRoutes.js
│   └── productoRoutes.js
├── img/                        # Almacenamiento local de imágenes subidas
├── .env.example                # Plantilla de variables de entorno
├── db.js                       # Pool de conexión a MySQL
├── package.json                # Dependencias y scripts
└── server.js                   # Servidor central Express y middlewares globales
```

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
- [XAMPP](https://www.apachefriends.org/) o un servidor [MySQL](https://www.mysql.com/) en ejecución.

---

## Instalación y Configuración

1. **Clonar o descargar el repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Antojitos_Pagina_Web
   ```

2. **Instalar dependencias de Node.js:**

   ```bash
   npm install
   ```

3. **Configurar la Base de Datos:**
   - Inicia los servicios de **Apache** y **MySQL** en XAMPP.
   - Crea una base de datos en phpMyAdmin (por ejemplo `antojitos_db`).
   - Importa las tablas y procedimientos almacenados del proyecto.

4. **Configurar las Variables de Entorno:**
   - Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Edita el archivo `.env` con tus credenciales locales.

5. **Iniciar el Servidor:**
   ```bash
   npm start
   ```
   El servidor estará disponible en: `http://localhost:3000`

---

## Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```ini
PORT=3000

# Conexión MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=antojitos_db

# Notificaciones por Correo (Gmail / Nodemailer)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_clave_de_aplicacion_gmail

# Clave secreta para generación de tokens
JWT_SECRET=tu_secreto_super_seguro_jwt
```

---

## Seguridad Implementada

- **Helmet:** Configuración de cabeceras HTTP que protegen contra ataques de Cross-Site Scripting (XSS), Clickjacking y MIME sniffing.
- **Rate Limiting:** Protección activa en `/api/auth/login` con limitación de solicitudes consecutivas para bloquear intentos de fuerza bruta.
- **Control de Acceso Basado en Tokens (JWT):** Las rutas de escritura y lectura administrativa requieren cabecera `Authorization: Bearer <token>`.
- **Cifrado de Contraseñas:** Algoritmo `bcryptjs` con salting para almacenamiento seguro de credenciales.
- **Validación en Multer:** Restricción estricta de extensiones permitidas (`.jpg`, `.jpeg`, `.png`, `.webp`) y límite de 5MB por archivo para prevenir inyección de ejecutables.
- **Manejo Centralizado de Errores:** Middleware global que captura errores sin exponer la estructura de la base de datos o claves internas en producción.

---

## Endpoints de la API (Resumen)

### Autenticación y Usuarios (`/api/auth`)

- `POST /login` — Inicio de sesión con rate limit. Retorna token JWT y rol.
- `POST /login/registrarse` — Registro de nuevos usuarios (_Requiere Token Admin_).
- `PUT /configuracion/password` — Actualización de contraseña del usuario autenticado.

### Catálogo y Menú

- `GET /consultarMenu` — Listado público de productos disponibles clasificados por categoría.
- `POST /agregarProducto` — Creación de producto con carga de imagen (_Requiere Token_).
- `PUT /actualizarProducto/:id` — Edición de producto (_Requiere Token_).
- `PUT /producto/disponible/:id` — Cambio de estado activo/inactivo (_Requiere Token_).

### Pedidos y Clientes

- `POST /clientes/agregar` — Registro de datos del cliente al ordenar.
- `POST /pedidos/agregar` — Registro del pedido principal.
- `POST /detalle/agregar` — Registro de los productos del pedido.
- `GET /pedidos/consultar/:id` — Consulta pública del estado de un pedido para rastreo.
- `GET /pedidos/consultar` — Consulta de pedidos para el panel administrativo (_Requiere Token_).
- `PUT /pedidos/estado/:id` — Actualización del estado de entrega (_Requiere Token_).

### Inventario e Insumos

- `GET /consultar` — Listado de insumos de bodega.
- `POST /agregar` — Registro de nuevo insumo (_Requiere Token_).
- `POST /insumos/entrada` — Registro de entrada de inventario (_Requiere Token_).
- `POST /insumos/salida` — Registro de salida de inventario (_Requiere Token_).
- `GET /insumos/alertas` — Insumos por debajo del stock mínimo (_Requiere Token_).

---

## Licencia

Este proyecto está bajo la licencia **ISC**. Desarrollado para propósitos académicos y de gestión comercial de restaurantes.
