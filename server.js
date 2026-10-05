require('dotenv').config();

/**
 * @file server.js
 * @description Punto de entrada del servidor Express para Antojitos.
 *              Configura middlewares globales y registra todas las rutas MVC.
 *              Escucha en el puerto 3000 por defecto.
 */


const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// ── Conexión a la base de datos ────────────────────────────────────────────
// Solo importar para inicializar la conexión al arrancar
require('./db');

// ── Middlewares globales ───────────────────────────────────────────────────

/** Permite peticiones desde el frontend (XAMPP, Live Server, etc.) */
app.use(cors({
    origin: [
        'http://localhost',
        'http://127.0.0.1',
        'http://localhost:80',
        'http://127.0.0.1:80',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5501',
        'http://127.0.0.1:5501'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/** Parsea el cuerpo de las peticiones en formato JSON */
app.use(express.json());

/** Parsea el cuerpo de formularios HTML (application/x-www-form-urlencoded) */
app.use(express.urlencoded({ extended: true }));

/**
 * Helmet: configura headers HTTP de seguridad (X-Frame-Options, CSP, etc.).
 * crossOriginResourcePolicy deshabilitado para permitir cargar imágenes desde el frontend.
 */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

/**
 * Rate limiter para el endpoint de login.
 * Limita a 10 intentos por IP cada 15 minutos para prevenir
 * ataques de fuerza bruta contra las credenciales.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos de inicio de sesión. Intente de nuevo en 15 minutos.' }
});

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

/**
 * Middleware global de manejo de errores.
 * Captura errores de Multer (archivos muy grandes o tipo no permitido)
 * y cualquier otro error no manejado por los controladores.
 */
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El archivo es demasiado grande. Máximo 5 MB.' });
    }
    if (err.message && err.message.includes('Tipo de archivo no permitido')) {
        return res.status(400).json({ error: err.message });
    }
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});