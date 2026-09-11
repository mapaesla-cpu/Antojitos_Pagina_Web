/**
 * @file multer.js
 * @description Configuración de Multer para la subida de archivos (imágenes de productos).
 *              Usa una ruta relativa para funcionar en cualquier entorno.
 */

const multer = require('multer');
const path = require('path');

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

/** Instancia de Multer lista para usar en las rutas. */
const upload = multer({ storage });

module.exports = upload;
