const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'antojitos_db'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error conectando a la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos ✅');
});

module.exports = conexion;