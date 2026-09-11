/**
 * @file server.js
 * @description Punto de entrada del servidor Express para Antojitos.
 *              Configura middlewares globales y registra todas las rutas MVC.
 *              Escucha en el puerto 3000 por defecto.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ── Conexión a la base de datos ────────────────────────────────────────────
// Solo importar para inicializar la conexión al arrancar
require('./db');

// ── Middlewares globales ───────────────────────────────────────────────────

/** Permite peticiones desde otros orígenes (útil en desarrollo con frontend separado) */
app.use(cors());

/** Parsea el cuerpo de las peticiones en formato JSON */
app.use(express.json());

/** Parsea el cuerpo de formularios HTML (application/x-www-form-urlencoded) */
app.use(express.urlencoded({ extended: true }));

/** Sirve archivos estáticos (HTML, CSS, JS, imágenes) desde la carpeta public */
app.use(express.static(path.join(__dirname, 'public')));

// ── Rutas MVC ──────────────────────────────────────────────────────────────
// Todas las rutas se montan bajo el prefijo /api/auth para mantener
// compatibilidad con el frontend existente.

const authRoutes          = require('./routes/authRoutes');
const insumoRoutes        = require('./routes/insumoRoutes');
const categoriaRoutes     = require('./routes/categoriaRoutes');
const productoRoutes      = require('./routes/productoRoutes');
const clienteRoutes       = require('./routes/clienteRoutes');
const pedidoRoutes        = require('./routes/pedidoRoutes');
const inventarioRoutes    = require('./routes/inventarioRoutes');
const dashboardRoutes     = require('./routes/dashboardRoutes');
const contactoRoutes      = require('./routes/contactoRoutes');
const configuracionRoutes = require('./routes/configuracionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/auth', insumoRoutes);
app.use('/api/auth', categoriaRoutes);
app.use('/api/auth', productoRoutes);
app.use('/api/auth', clienteRoutes);
app.use('/api/auth', pedidoRoutes);
app.use('/api/auth', inventarioRoutes);
app.use('/api/auth', dashboardRoutes);
app.use('/api/auth', contactoRoutes);
app.use('/api/auth', configuracionRoutes);

// ── Ruta raíz ─────────────────────────────────────────────────────────────

/**
 * Ruta de verificación de salud del servidor.
 *
 * @route GET /
 * @returns {string} Mensaje de confirmación de que el servidor está activo.
 */
app.get('/', (req, res) => {
    res.send('Servidor AntoJitos funcionando ✅');
});

// ── Arranque del servidor ──────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});