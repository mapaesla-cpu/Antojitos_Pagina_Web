/**
 * @file multer.js
 * @description Configuración de Multer para la subida de archivos (imágenes de productos).
 *              Incluye validación de tipos MIME permitidos y límite de tamaño
 *              para prevenir subidas maliciosas.
 */

const multer = require('multer');
const path = require('path');

/**
 * Tipos MIME permitidos para la subida de imágenes.
 * Solo se aceptan formatos de imagen comunes para evitar
 * que se suban archivos ejecutables o no deseados.
 */
const MIME_TYPES_PERMITIDOS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
];

/**
 * Tamaño máximo permitido por archivo: 5 MB.
 * Previene que se suban archivos excesivamente grandes
 * que puedan saturar el disco o la memoria del servidor.
 */
const TAMANO_MAXIMO = 5 * 1024 * 1024;

/**
 * Estrategia de almacenamiento en disco para Multer.
 * - Guarda los archivos en la carpeta pública de imágenes.
 * - Renombra cada archivo con la fecha actual más su extensión original
 *   para evitar colisiones de nombres.
 */
const storage = multer.diskStorage({
    /**
     * Define la carpeta de destino donde se guardarán las imágenes.
     *
     * @param {import('express').Request} req - Objeto de petición de Express.
     * @param {Express.Multer.File} file - Objeto que representa el archivo subido.
     * @param {Function} cb - Callback para indicar la ruta de destino.
     */
    destination: (req, file, cb) => {
        // Ruta relativa para que funcione en cualquier máquina
        cb(null, path.join(__dirname, '../public/img'));
    },

    /**
     * Define el nombre con el que se guardará el archivo.
     *
     * @param {import('express').Request} req - Objeto de petición de Express.
     * @param {Express.Multer.File} file - Objeto que representa el archivo subido.
     * @param {Function} cb - Callback para indicar el nombre del archivo generado.
     */
    filename: (req, file, cb) => {
        // Formato: timestamp + extensión original (ej. 1715000000000.jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

/**
 * Filtro de archivos para Multer.
 * Rechaza cualquier archivo cuyo tipo MIME no esté en la lista permitida.
 *
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {Express.Multer.File} file - Objeto que representa el archivo subido.
 * @param {Function} cb - Callback: cb(null, true) para aceptar, cb(error) para rechazar.
 */
const fileFilter = (req, file, cb) => {
    if (MIME_TYPES_PERMITIDOS.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WebP).'), false);
    }
};

/** Instancia de Multer con almacenamiento, filtro de tipo y límite de tamaño. */
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: TAMANO_MAXIMO }
});

module.exports = upload;
