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
    destination: (req, file, cb) => {
        cb(null, 'C:/Xampp/htdocs/Antojitos_Pagina_Web/public/img'); // carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        // El nombre del archivo será: fecha + nombre original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
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

// Agregar insumo a producto
router.post("/producto-insumos/agregar", (req, res) => {
    const { id_producto, id_insumo, cantidad_requerida } = req.body;
    const sql = "INSERT INTO producto_insumos (id_producto, id_insumo, cantidad_requerida) VALUES (?, ?, ?)";
    db.query(sql, [id_producto, id_insumo, cantidad_requerida], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        res.json({ mensaje: "Insumo agregado" });
    });
});

// Eliminar insumo de producto
router.delete("/producto-insumos/eliminar", (req, res) => {
    const { id_producto, id_insumo } = req.body;
    const sql = "DELETE FROM producto_insumos WHERE id_producto = ? AND id_insumo = ?";
    db.query(sql, [id_producto, id_insumo], (error, results) => {
        if (error) return res.status(500).json({ error: "Error" });
        res.json({ mensaje: "Insumo eliminado" });
    });
});

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