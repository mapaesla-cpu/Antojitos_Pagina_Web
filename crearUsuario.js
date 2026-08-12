const bcrypt = require('bcryptjs');
const db = require('./db');

const nombre = 'Admin';
const correo = 'admintres@antojitos.com';
const contrasena = '1234';
const rol = 'administrador';

bcrypt.hash(contrasena, 10, (err, hash) => {
  if (err) throw err;

  const sql = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, correo, hash, rol], (err, result) => {
    if (err) throw err;
    console.log('Usuario creado exitosamente ✅');
    process.exit();
  });
});