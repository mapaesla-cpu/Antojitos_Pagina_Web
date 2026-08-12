const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('./db');

const multer = require('multer');
const path = require('path');
const { error } = require('console');

// Configuración de multer
const storage = multer.diskStorage({
    /**
     * Define la carpeta de destino donde se guardarán las imágenes.
     * 
     * @param {Object} req - Objeto de petición Express.
     * @param {Object} file - Objeto que representa el archivo subido.
     * @param {Function} cb - Función callback para retornar la ruta de destino.
     */
    destination: (req, file, cb) => {
        cb(null, 'C:/Xampp/htdocs/Antojitos_Pagina_Web/public/img'); // carpeta donde se guardan las imágenes
    },
    /**
     * Define el nombre que tendrá el archivo guardado.
     * 
     * @param {Object} req - Objeto de petición Express.
     * @param {Object} file - Objeto que representa el archivo subido.
     * @param {Function} cb - Función callback para retornar el nombre de archivo generado.
     */
    filename: (req, file, cb) => {
        // El nombre del archivo será: fecha + nombre original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

/**
 * Inicia sesión de un usuario y genera un token JWT.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.correo - Correo electrónico del usuario.
 * @param {string} req.body.contrasena - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// LOGIN
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(sql, [correo], async (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (results.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    const usuario = results[0];
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      'secreto_antojitos',
      { expiresIn: '8h' }
    );

    res.json({ mensaje: 'Login exitoso', token, rol: usuario.rol });
  });
});

/**
 * Agrega un nuevo insumo al inventario.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nombre del insumo.
 * @param {string} req.body.unidad - Unidad de medida del insumo.
 * @param {number} req.body.cantidad - Cantidad disponible inicial.
 * @param {number} req.body.stock - Stock mínimo requerido.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Agregar Insumos
router.post("/agregar", (req, res) => {
  const nombre = req.body.nombre;
  const unidad = req.body.unidad;
  const cantidad = req.body.cantidad;
  const stock = req.body.stock;

  const sql = 'INSERT INTO insumos (nombre, unidad_medida, cantidad_disponible, stock_minimo) VALUES (?, ?, ?, ?)';

  db.query( sql,[nombre, unidad, cantidad, stock], (error, resultado) => {

    if(error){
      console.log(error);
      res.send("Error");
    }else{
      res.send("Insumo agregado correctamente");
    }
  }
 );
});

/**
 * Consulta y retorna todos los insumos registrados.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Consultar Insumos
router.get("/consultar", (req, res) => {

  const sql = 'SELECT * FROM insumos';

  db.query( sql, (error, results) => {

    if(error){
      console.log(error);
      return res.status(500).json({ error: "Error en la consulta"});
    }
    res.json(results);
    
  });

});

/**
 * Actualiza los datos de un insumo existente por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_insumo - ID del insumo a actualizar.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nuevo nombre del insumo.
 * @param {string} req.body.unidad_medida - Nueva unidad de medida.
 * @param {number} req.body.cantidad_disponible - Nueva cantidad disponible.
 * @param {number} req.body.stock_minimo - Nuevo stock mínimo.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Actualizar insumo
router.put("/actualizar/:id_insumo", (req, res) => {
  const { id_insumo} = req.params;
  const { nombre, unidad_medida, cantidad_disponible, stock_minimo} = req.body;

  const sql = `UPDATE insumos SET
      nombre = ?,
      unidad_medida = ?,
      cantidad_disponible = ?,
      stock_minimo = ?
      WHERE id_insumo = ?`;

      db.query(sql, [nombre, unidad_medida, cantidad_disponible, stock_minimo, id_insumo], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar"});
        }
        res.json({mensaje: "Insumo actualizado correctamente"});
      });
});

/**
 * Elimina un insumo del inventario por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_insumo - ID del insumo a eliminar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Eliminar insumo
router.delete("/eliminar/:id_insumo", (req, res) => {
  const {id_insumo} = req.params;

  const sql = `DELETE FROM insumos WHERE id_insumo = ?`;

  db.query(sql, [id_insumo], (error, results) => {
    if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al eliminar"});
        }
        res.json({mensaje: "Insumo eliminado correctamente"});
  });

});

/**
 * Agrega una nueva categoría de productos.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nombre de la categoría.
 * @param {string} req.body.descripcion - Descripción de la categoría.
 * @param {number|string} req.body.estado - Estado de la categoría.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Agregar Categoria
router.post("/agregarCategoria", (req, res) => {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const estado = req.body.estado;
  

  const sql = 'INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, ?)';

  db.query( sql,[nombre, descripcion, estado], (error, resultado) => {

    if(error){
      console.log(error);
      res.send("Error");
    }else{
      res.send("Categoría agregada correctamente");
    }
  }
 );
});

/**
 * Consulta y retorna todas las categorías registradas.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Consultar Categoria
router.get("/consultarCategoria", (req, res) => {

  const sql = 'SELECT * FROM categorias';

  db.query( sql, (error, results) => {

    if(error){
      console.log(error);
      return res.status(500).json({ error: "Error en la consulta"});
    }
    res.json(results);
    
  });

});

/**
 * Actualiza una categoría existente por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_categoria - ID de la categoría a actualizar.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nuevo nombre de la categoría.
 * @param {string} req.body.descripcion - Nueva descripción de la categoría.
 * @param {number|string} req.body.estado - Nuevo estado de la categoría.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Actualizar Categoria
router.put("/actualizarCategoria/:id_categoria", (req, res) => {
  const { id_categoria} = req.params;
  const { nombre, descripcion, estado} = req.body;

  const sql = `UPDATE categorias SET
      nombre = ?,
      descripcion = ?,
      estado = ?
      WHERE id_categoria = ?`;

      db.query(sql, [nombre, descripcion, estado, id_categoria], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar"});
        }
        res.json({mensaje: "Categoría actualizada correctamente"});
      });
});

/**
 * Desactiva o cambia el estado de una categoría por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_categoria - ID de la categoría.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {number|string} req.body.estado - Nuevo estado a asignar a la categoría.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Desactivar Categoria
router.put("/categorias/desactivar/:id_categoria", (req, res) => {
  const {id_categoria} = req.params;
  const {estado} = req.body;

  const sql = `UPDATE categorias SET estado = ? WHERE id_categoria = ?`;

  db.query(sql, [estado, id_categoria], (error, results) => {
    if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar estado"});
        }
        res.json({mensaje: "Estado actualizado correctamente"});
  });

});

/**
 * Agrega un nuevo producto cargando una imagen opcional.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_categoria - ID de la categoría a la que pertenece el producto.
 * @param {string} req.body.nombre - Nombre del producto.
 * @param {string} req.body.descripcion - Descripción del producto.
 * @param {number} req.body.precio - Precio del producto.
 * @param {number|string} req.body.disponible - Disponibilidad del producto (e.g., 1 o 0).
 * @param {Object} req.file - Archivo cargado por multer para la imagen del producto.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Agregar Producto
router.post("/agregarProducto", upload.single('imagen'), (req, res) => {
    console.log("Body:", req.body);      // ← agrega esto
    console.log("Archivo:", req.file);   // ← agrega esto
    
    const { id_categoria, nombre, descripcion, precio, disponible } = req.body;
    const imagen = req.file ? req.file.filename : null;
    
    console.log("Imagen:", imagen);      // ← agrega esto

    const sql = "INSERT INTO productos (id_categoria, nombre, descripcion, precio, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [id_categoria, nombre, descripcion, precio, imagen, disponible], (error, results) => {
        if (error) {
            console.log("Error SQL:", error); // ← agrega esto
            return res.status(500).json({ error: "Error al agregar" });
        }
        res.json({ mensaje: "Producto agregado correctamente" });
    });
});

/**
 * Consulta y retorna todos los productos con el nombre de su categoría asociada.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Consultar Producto
router.get("/consultarProducto", (req, res) => {
    const sql = `SELECT p.*, c.nombre as nombre_categoria 
                 FROM productos p 
                 JOIN categorias c ON p.id_categoria = c.id_categoria`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error en la consulta" });
        }
        res.json(results);
    });
});

/**
 * Actualiza un producto existente por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_producto - ID del producto a actualizar.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_categoria - Nuevo ID de la categoría asociada.
 * @param {string} req.body.nombre - Nuevo nombre del producto.
 * @param {string} req.body.descripcion - Nueva descripción.
 * @param {number} req.body.precio - Nuevo precio.
 * @param {string} req.body.imagen - Nombre de la imagen del producto.
 * @param {number|string} req.body.disponible - Nuevo estado de disponibilidad.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Actualizar Producto
router.put("/actualizarProducto/:id_producto", (req, res) => { 
  console.log("Body:", req.body);
  console.log("Imagen recibida:",req.body.imagen);
  const { id_producto} = req.params;
  const { id_categoria, nombre, descripcion, precio, imagen,disponible} = req.body;

  const sql = `UPDATE productos SET
      id_categoria = ?,
      nombre = ?,
      descripcion = ?,
      precio = ?,
      imagen = ?,
      disponible = ?
      WHERE id_producto = ?`;

      db.query(sql, [id_categoria, nombre, descripcion, precio, imagen, disponible, id_producto], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar"});
        }
        res.json({mensaje: "Producto actualizado correctamente"});
      });
});

/**
 * Cambia el estado de disponibilidad de un producto por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_producto - ID del producto.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {number|string} req.body.disponible - Nuevo estado de disponibilidad a asignar (e.g., 1 o 0).
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Desactivar Producto
router.put("/producto/disponible/:id_producto", (req, res) => {
  const {id_producto} = req.params;
  const {disponible} = req.body;

  const sql = `UPDATE productos SET disponible = ? WHERE id_producto = ?`;

  db.query(sql, [disponible, id_producto], (error, results) => {
    if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar estado"});
        }
        res.json({mensaje: "Estado actualizado correctamente"});
  });

});

/**
 * Consulta y obtiene la lista de insumos requeridos por un producto específico.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_producto - ID del producto a consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Consultar insumos de un producto
router.get("/producto-insumos/:id_producto", (req, res) => {
    const { id_producto } = req.params;
    const sql = `SELECT pi.*, i.nombre as nombre_insumo 
                 FROM producto_insumos pi
                 JOIN insumos i ON pi.id_insumo = i.id_insumo
                 WHERE pi.id_producto = ?`;
    db.query(sql, [id_producto], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        res.json(results);
    });
});

/**
 * Asocia un insumo a un producto especificando la cantidad requerida.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_producto - ID del producto.
 * @param {string} req.body.id_insumo - ID del insumo a asociar.
 * @param {number} req.body.cantidad_requerida - Cantidad necesaria del insumo para el producto.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Agregar insumo a producto
router.post("/producto-insumos/agregar", (req, res) => {
    const { id_producto, id_insumo, cantidad_requerida } = req.body;
    const sql = "INSERT INTO producto_insumos (id_producto, id_insumo, cantidad_requerida) VALUES (?, ?, ?)";
    db.query(sql, [id_producto, id_insumo, cantidad_requerida], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        res.json({ mensaje: "Insumo agregado" });
    });
});

/**
 * Desasocia un insumo de un producto.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_producto - ID del producto.
 * @param {string} req.body.id_insumo - ID del insumo a desasociar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Eliminar insumo de producto
router.delete("/producto-insumos/eliminar", (req, res) => {
    const { id_producto, id_insumo } = req.body;
    const sql = "DELETE FROM producto_insumos WHERE id_producto = ? AND id_insumo = ?";
    db.query(sql, [id_producto, id_insumo], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        res.json({ mensaje: "Insumo eliminado" });
    });
});

/**
 * Consulta y retorna todos los productos que están disponibles en el menú.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Cargar Menú
router.get("/consultarMenu", (req, res) => {
    const sql = `SELECT p.*, c.nombre as nombre_categoria 
                 FROM productos p 
                 JOIN categorias c ON p.id_categoria = c.id_categoria
                 WHERE p.disponible = 1`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error en la consulta" });
        }
        res.json(results);
    });
});

/**
 * Registra un nuevo cliente en el sistema.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de the petición.
 * @param {string} req.body.nombre - Nombre del cliente.
 * @param {string} req.body.telefono - Teléfono del cliente.
 * @param {string} req.body.direccion - Dirección de entrega del cliente.
 * @param {string} req.body.correo - Correo electrónico del cliente.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Registar cliente
router.post("/clientes/agregar" , (req, res) => {
  const {nombre, telefono, direccion, correo} = req.body;
  const fecha_registro = new Date ();

  const sql = "INSERT INTO clientes (nombre, telefono, direccion, correo, fecha_registro) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, telefono, direccion, correo, fecha_registro], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al registrar cliente"});
    }
    res.json({ id_cliente: results.insertId });
  });
});

/**
 * Registra un nuevo pedido y genera automáticamente su factura correspondiente.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_cliente - ID del cliente que realiza el pedido.
 * @param {string} req.body.tipo_entrega - Tipo de entrega.
 * @param {string} req.body.metodo_pago - Método de pago utilizado.
 * @param {number} req.body.total - Total a pagar del pedido.
 * @param {string} [req.body.notas] - Notas o comentarios adicionales.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Registrar pedido
router.post("/pedidos/agregar" , (req, res) => {
  console.log("Body pedido:", req.body);
  const {id_cliente, tipo_entrega, metodo_pago, total, notas} = req.body;
  console.log("id_cliente:", id_cliente);
  const fecha_pedido = new Date ();
  const estado = "pendiente";

  const sql = "INSERT INTO pedidos (id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [id_cliente, fecha_pedido, estado, tipo_entrega, metodo_pago, total, notas], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al registrar pedido"});
    }
    const id_pedido = results.insertId;

    //Generar factura automáticamente
    const numero_factura = `FAC-${Date.now()}`;
    const subtotal = total / 1.19; //Calcula sin IVA
    const impuesto = total - subtotal; //IVA 19%
    const fecha_emision = new Date();
    const estadoFactura = "emitida";

  const sqlFactura  = "INSERT INTO facturas (id_pedido, numero_factura, fecha_emision, subtotal, impuesto, total, estado) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sqlFactura, [id_pedido, numero_factura, fecha_emision, subtotal.toFixed(2), impuesto.toFixed(2), total, estadoFactura], (errorF) => {
    if (errorF) {
      console.log(errorF);
    }
     });
    res.json({ id_pedido});
  });
});

/**
 * Registra el detalle de un producto específico dentro de un pedido.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_pedido - ID del pedido al que pertenece.
 * @param {string} req.body.id_producto - ID del producto en el detalle.
 * @param {number} req.body.cantidad - Cantidad de productos.
 * @param {number} req.body.precio_unitario - Precio unitario del producto.
 * @param {number} req.body.subtotal - Subtotal para esta línea de detalle.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Registrar detalle pedido
router.post("/detalle/agregar" , (req, res) => {
  const {id_pedido, id_producto, cantidad, precio_unitario, subtotal} = req.body;

  const sql = "INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [id_pedido, id_producto, cantidad, precio_unitario, subtotal], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al registrar detalle"});
    }
    res.json({ mensaje: "Detalle registrado" });
  });
});

/**
 * Consulta y retorna todos los pedidos ordenados de forma descendente por fecha.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Consultar pedidos
router.get("/pedidos/consultar", (req, res) => {
    const sql = `SELECT p.*, c.nombre as nombre_cliente, c.telefono 
                 FROM pedidos p 
                 JOIN clientes c ON p.id_cliente = c.id_cliente
                 ORDER BY p.fecha_pedido DESC`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al consultar pedidos" });
        }
        res.json(results);
    });
});

/**
 * Cambia el estado de un pedido por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID del pedido a actualizar.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.estado - Nuevo estado del pedido (e.g., 'pendiente', 'entregado', 'cancelado').
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Cambiar estado
router.put("/pedidos/estado/:id", (req, res) => {
  console.log(req.body);
    const { id } = req.params;
    const { estado } = req.body;
    const sql = "UPDATE pedidos SET estado = ? WHERE id_pedido = ?";
    db.query(sql, [estado, id], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar estado" });
        }
        res.json({ mensaje: "Estado actualizado" });
    });
});

/**
 * Consulta y retorna la información detallada de un pedido y sus productos asociados.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID del pedido a consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Ver detalle pedido
router.get("/pedidos/detalle/:id", (req, res) => {
    const { id } = req.params;
    
    const sqlPedido = `SELECT p.*, c.nombre as nombre_cliente, c.telefono 
                       FROM pedidos p 
                       JOIN clientes c ON p.id_cliente = c.id_cliente
                       WHERE p.id_pedido = ?`;
    
    const sqlDetalle = `SELECT d.*, pr.nombre as nombre_producto 
                        FROM detalle_pedidos d
                        JOIN productos pr ON d.id_producto = pr.id_producto
                        WHERE d.id_pedido = ?`;

    db.query(sqlPedido, [id], (error, pedido) => {
        if (error) return res.status(500).json({ error: "Error" });
        
        db.query(sqlDetalle, [id], (error, detalle) => {
            if (error) return res.status(500).json({ error: "Error" });
            
            res.json({ pedido: pedido[0], detalle });
        });
    });
});

/**
 * Descuenta del inventario los insumos de cada producto incluido en un pedido.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_pedido - ID del pedido del cual descontar los insumos.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Descontar inventario
router.post("/inventario/descontar", (req, res) => {
    const { id_pedido } = req.body;

    // 1. Obtener productos del pedido
    const sqlDetalle = `SELECT id_producto, cantidad FROM detalle_pedidos WHERE id_pedido = ?`;
    
    db.query(sqlDetalle, [id_pedido], (error, detalle) => {
        if (error) return res.status(500).json({ error: "Error" });

        // 2. Por cada producto, obtener sus insumos y descontarlos
        detalle.forEach(producto => {
            const sqlInsumos = `SELECT id_insumo, cantidad_requerida 
                               FROM producto_insumos 
                               WHERE id_producto = ?`;

            db.query(sqlInsumos, [producto.id_producto], (error, insumos) => {
                if (error) return;

                insumos.forEach(insumo => {
                    const cantidadDescontar = insumo.cantidad_requerida * producto.cantidad;
                    
                    const sqlDescontar = `UPDATE insumos 
                                         SET cantidad_disponible = cantidad_disponible - ? 
                                         WHERE id_insumo = ?`;
                    
                    db.query(sqlDescontar, [cantidadDescontar, insumo.id_insumo], (error) => {
                        if (error) console.log("Error descontando insumo:", error);
                    });
                });
            });
        });

        res.json({ mensaje: "Inventario actualizado correctamente" });
    });
});

/**
 * Registra una entrada de insumos al inventario, validando el token JWT y guardando el movimiento.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.headers - Cabeceras de la petición.
 * @param {string} req.headers.authorization - Token de autorización JWT.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_insumo - ID del insumo a aumentar.
 * @param {number} req.body.cantidad - Cantidad de entrada.
 * @param {string} req.body.motivo - Motivo de la entrada.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Registrar entrada de insumos
router.post("/insumos/entrada", (req, res) => {

  console.log("Entró a la función");
  console.log("BODY:",req.body);
  const {id_insumo, cantidad, motivo} = req.body;
  

  //1. Validar que el usuario esté logueado
  const authHeader = req.headers.authorization;

  if (!authHeader){
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, "secreto_antojitos");
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const idUsuario = decoded.id;

  //2. Sumar cantidad al insumo
  const sqlActualizarInsumo = "UPDATE insumos SET cantidad_disponible = cantidad_disponible + ? WHERE id_insumo = ?";
  db.query(sqlActualizarInsumo, [cantidad, id_insumo], (error, resultado) => {
    if (error) {
      console.error("Error actualizando insumo: ", error);
      return res.status(500).json({ error: "Error al actualizar inventario" });
    }

    //3. Registrar movimiento
    const sqlMovimiento = "INSERT INTO movimientos_inventario (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlMovimiento, [id_insumo, "entrada", cantidad, motivo, idUsuario], (error) => {
    if (error) {
      console.error("Error registrando movimiento: ", error);
      return res.status(500).json({ error: "Error al registrar entrada", error });
    }
    res.json({ mensaje: "Entrada registrada exitosamente" });

    });
  });
});

/**
 * Registra una salida de insumos del inventario, validando el token JWT y guardando el movimiento.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.headers - Cabeceras de la petición.
 * @param {string} req.headers.authorization - Token de autorización JWT.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.id_insumo - ID del insumo a disminuir.
 * @param {number} req.body.cantidad - Cantidad de salida.
 * @param {string} req.body.motivo - Motivo de la salida.
 * @param {Object} res - Objeto de respuesta de Express.
 */
//Registrar salida de insumos
router.post("/insumos/salida", (req, res) => {

  console.log("Entró a la función");
  console.log("BODY:",req.body);
  const {id_insumo, cantidad, motivo} = req.body;
  

  //1. Validar que el usuario esté logueado
  const authHeader = req.headers.authorization;

  if (!authHeader){
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, "secreto_antojitos");
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }

  const idUsuario = decoded.id;

  //2. Restar cantidad al insumo
  const sqlActualizarInsumo = "UPDATE insumos SET cantidad_disponible = cantidad_disponible - ? WHERE id_insumo = ?";
  db.query(sqlActualizarInsumo, [cantidad, id_insumo], (error, resultado) => {
    if (error) {
      console.error("Error actualizando insumo: ", error);
      return res.status(500).json({ error: "Error al actualizar inventario" });
    }

    //3. Registrar movimiento
    const sqlMovimiento = "INSERT INTO movimientos_inventario (id_insumo, tipo_movimiento, cantidad, motivo, id_usuario) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlMovimiento, [id_insumo, "salida", cantidad, motivo, idUsuario], (error) => {
    if (error) {
      console.error("Error registrando movimiento: ", error);
      return res.status(500).json({ error: "Error al registrar salida", error });
    }
    res.json({ mensaje: "Salida registrada exitosamente" });

    });
  });
});

/**
 * RUTA PÚBLICA: Consulta y retorna únicamente el ID y estado de un pedido por su ID.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id_pedido - ID del pedido a consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// RUTA PÚBLICA: Consultar el estado de un pedido por ID
router.get("/pedidos/consultar/:id_pedido", (req, res) => {
    const id_pedido = req.params.id_pedido;

    // Consulta SQL para traer solo el ID y el Estado (lo único que el cliente necesita ver)
    const query = 'SELECT id_pedido, estado FROM pedidos WHERE id_pedido = ?';

    db.query(query, [id_pedido], (err, result) => {
        if (err) {
            console.error("Error al consultar el pedido:", err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Si no se encuentra el pedido
        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        // Si todo está bien, enviamos el pedido encontrado al frontend
        return res.status(200).json(result[0]);
    });
});

/**
 * Obtiene las estadísticas generales para el dashboard (pedidos de hoy, pendientes, ingresos y populares).
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Estadísticas dashboard
router.get("/dashboard/estadisticas", (req, res) => {
    const sqlPedidosHoy = `SELECT COUNT(*) as total FROM pedidos 
                           WHERE DATE(fecha_pedido) = CURDATE()`;
    
    const sqlPendientes = `SELECT COUNT(*) as total FROM pedidos 
                           WHERE estado = 'pendiente'`;
    
    const sqlIngresos = `SELECT SUM(total) as total FROM pedidos 
                         WHERE DATE(fecha_pedido) = CURDATE()
                         AND estado != 'cancelado'`;
    
    const sqlPopulares = `SELECT pr.nombre, SUM(d.cantidad) as total_vendido
                          FROM detalle_pedidos d
                          JOIN productos pr ON d.id_producto = pr.id_producto
                          GROUP BY d.id_producto
                          ORDER BY total_vendido DESC
                          LIMIT 5`;

    db.query(sqlPedidosHoy, (error, pedidosHoy) => {
        if (error) return res.status(500).json({ error: "Error" });
        
        db.query(sqlPendientes, (error, pendientes) => {
            if (error) return res.status(500).json({ error: "Error" });
            
            db.query(sqlIngresos, (error, ingresos) => {
                if (error) return res.status(500).json({ error: "Error" });
                
                db.query(sqlPopulares, (error, populares) => {
                    if (error) return res.status(500).json({ error: "Error" });
                    
                    res.json({
                        pedidosHoy: pedidosHoy[0].total,
                        pendientes: pendientes[0].total,
                        ingresos: ingresos[0].total || 0,
                        populares
                    });
                });
            });
        });
    });
});

/**
 * Carga y retorna los 5 productos más populares (vendidos) para la página principal.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Cargar productos populares para la página principal
router.get("/dashboard/estadisticasmenu", (req, res) => {
    const sqlPopulares = `SELECT pr.nombre, pr.imagen, pr.precio, pr.descripcion,
                      SUM(d.cantidad) as total_vendido
                      FROM detalle_pedidos d
                      JOIN productos pr ON d.id_producto = pr.id_producto
                      GROUP BY d.id_producto
                      ORDER BY total_vendido DESC
                      LIMIT 5`; // Trae los 5 más vendidos
    
    db.query(sqlPopulares, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al cargar productos" });
        }
        res.json( {productosmenu:results});
    });
});

/**
 * Consulta y obtiene la lista de insumos que se encuentran por debajo del stock mínimo.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Ruta para obtener insumos con bajo stock comparando con su mínimo
router.get("/insumos/alertas", (req, res) => {
    // Traemos los insumos donde el stock actual sea menor o igual al mínimo
    const sqlAlertas = `
        SELECT id_insumo, nombre, cantidad_disponible, stock_minimo 
        FROM insumos 
        WHERE cantidad_disponible <= stock_minimo
    `; 
    
    db.query(sqlAlertas, (error, results) => {
        if (error) {
            console.error("Error al consultar stock crítico:", error);
            return res.status(500).json({ error: 'Error al consultar el stock' });
        }
        res.json(results); // Devuelve la lista exacta de lo que se está agotando
    });
});

/**
 * Consulta y retorna los ajustes generales de configuración del negocio.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Consultar configuración
router.get("/configuracion/consultar", (req, res) => {
    const sql = "SELECT * FROM configuracion LIMIT 1";
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al consultar" });
        }
        res.json(results[0]);
    });
});

/**
 * Actualiza los ajustes generales de configuración del negocio.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre_negocio - Nombre del negocio.
 * @param {string} req.body.nit - NIT del negocio.
 * @param {string} req.body.telefono - Teléfono de contacto.
 * @param {string} req.body.direccion - Dirección física.
 * @param {string} req.body.horario_apertura - Horario de apertura.
 * @param {string} req.body.horario_cierre - Horario de cierre.
 * @param {string} req.body.dias_atencion - Días de atención al público.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Actualizar configuración
router.put("/configuracion/actualizar", (req, res) => {
    const { nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion } = req.body;
    const sql = `UPDATE configuracion SET 
        nombre_negocio = ?,
        nit = ?, 
        telefono = ?, 
        direccion = ?, 
        horario_apertura = ?, 
        horario_cierre = ?, 
        dias_atencion = ? 
        WHERE id_config = 1`;
    db.query(sql, [nombre_negocio, nit, telefono, direccion, horario_apertura, horario_cierre, dias_atencion], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al actualizar" });
        }
        res.json({ mensaje: "Configuración actualizada correctamente" });
    });
});

/**
 * Cambia la contraseña del usuario logueado después de validar su token JWT y su contraseña actual.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.headers - Cabeceras de la petición.
 * @param {string} req.headers.authorization - Token de autorización JWT.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.password_actual - Contraseña actual del usuario.
 * @param {string} req.body.password_nueva - Nueva contraseña a establecer.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Cambiar contraseña
router.put("/configuracion/password", (req, res) => {
    const { password_actual, password_nueva } = req.body;

    const authHeader = req.headers.authorization;

    if(!authHeader){
      return res.status(401).json({ error: "Token no proporcionado"});
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try{
      decoded = jwt.verify(token, "secreto_antojitos");
    }catch (error) {
      return res.status(401).json({ error: "Token inválido"});
    }

    const idUsuario = decoded.id;


    // Primero verificamos la contraseña actual
    const sqlBuscar = "SELECT * FROM usuarios WHERE id_usuario = ?";
    db.query(sqlBuscar, [idUsuario], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        
        const usuario = results[0];
        //const bcrypt = require('bcrypt');
        console.log(usuario.contrasena);
        console.log(password_actual);
        bcrypt.compare(password_actual, usuario.contrasena, (err, match) => {
            if (!match) return res.status(401).json({ error: "Contraseña actual incorrecta" });
            
            bcrypt.hash(password_nueva, 10, (err, hash) => {
                const sqlUpdate = "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?";
                db.query(sqlUpdate, [hash, usuario.id_usuario], (error) => {
                    if (error) return res.status(500).json({ error: "Error al actualizar" });
                    res.json({ mensaje: "Contraseña actualizada correctamente. Inicie sesión nuevamente" });

                });
            });
        });
    });
});

/**
 * Consulta y obtiene todas las facturas registradas en orden cronológico descendente.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Consultar facturas
router.get("/facturas/consultar", (req, res) => {
    const sql = `SELECT f.*, c.nombre as nombre_cliente, c.telefono
                 FROM facturas f
                 JOIN pedidos p ON f.id_pedido = p.id_pedido
                 JOIN clientes c ON p.id_cliente = c.id_cliente
                 ORDER BY f.fecha_emision DESC`;
    db.query(sql, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al consultar" });
        }
        res.json(results);
    });
});

/**
 * Obtiene la información detallada de una factura y el desglose de productos de su pedido asociado.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID de la factura a consultar.
 * @param {Object} res - Objeto de respuesta de Express.
 */
// Ver factura detallada
router.get("/facturas/ver/:id", (req, res) => {
    const { id } = req.params;
    
    const sqlFactura = `SELECT f.*, c.nombre as nombre_cliente, c.telefono,
                        p.tipo_entrega, p.notas
                        FROM facturas f
                        JOIN pedidos p ON f.id_pedido = p.id_pedido
                        JOIN clientes c ON p.id_cliente = c.id_cliente
                        WHERE f.id_factura = ?`;

    const sqlDetalle = `SELECT d.*, pr.nombre as nombre_producto
                        FROM detalle_pedidos d
                        JOIN productos pr ON d.id_producto = pr.id_producto
                        WHERE d.id_pedido = (SELECT id_pedido FROM facturas WHERE id_factura = ?)`;

    db.query(sqlFactura, [id], (error, factura) => {
        if (error) return res.status(500).json({ error: "Error" });

        db.query(sqlDetalle, [id], (error, detalle) => {
            if (error) return res.status(500).json({ error: "Error" });

            res.json({ factura: factura[0], detalle });
        });
    });
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo electrónico con los datos de contacto ingresados en el formulario web.
 * 
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} req.body - Cuerpo de la petición.
 * @param {string} req.body.nombre - Nombre de la persona que contacta.
 * @param {string} req.body.email - Correo de la persona que contacta.
 * @param {string} req.body.telefono - Teléfono de contacto.
 * @param {string} req.body.mensaje - Contenido del mensaje.
 * @param {string} req.body.terminos - Indicador de aceptación de términos.
 * @param {Object} res - Objeto de respuesta de Express.
 */
router.post("/contacto/enviar", (req, res) => {
    const { nombre, email, telefono, mensaje, terminos } = req.body;

    const mailOptions = {
        from: email,
        to: '[EMAIL_ADDRESS]', // ← correo del administrador
        subject: `Contacto Antojitos - ${terminos}`,
        html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${telefono}</p>
            <p><strong>Terminos y condiciones:</strong> ${terminos}</p>
            <p><strong>Mensaje:</strong> ${mensaje}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al enviar el correo" });
        }
        res.json({ mensaje: "Mensaje enviado correctamente" });
    });
});

module.exports = router;