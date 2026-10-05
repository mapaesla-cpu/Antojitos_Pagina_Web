/**
 * @file db.js
 * @description Configuración y conexión a la base de datos MySQL.
 *              Usa variables de entorno (.env) para las credenciales
 *              en lugar de valores hardcodeados, mejorando la seguridad.
 */

const mysql = require('mysql2');

/**
 * Conexión a la base de datos MySQL.
 * Las credenciales se leen desde el archivo .env para evitar
 * exponer datos sensibles en el código fuente.
 */
const conexion = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'antojitos_db'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error conectando a la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos ✅');
});

module.exports = conexion;