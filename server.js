const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const authRoutes = require('./authRoutes');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Servidor AntoJitos funcionando ✅');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});