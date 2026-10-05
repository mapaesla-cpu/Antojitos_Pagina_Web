-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para antojitos_db
CREATE DATABASE IF NOT EXISTS `antojitos_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `antojitos_db`;

-- Volcando estructura para tabla antojitos_db.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `uq_nombre_categoria` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.categorias: ~7 rows (aproximadamente)
INSERT IGNORE INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `estado`) VALUES
	(1, 'Hamburguesas', 'Hamburguesas clásicas y especiales', 'activa'),
	(2, 'Perros Calientes', 'Hot dogs con variedad de toppings', 'activa'),
	(3, 'Salchipapas', 'Papas fritas con salchicha', 'activa'),
	(4, 'Pizzas', 'Pizzas personales y familiares', 'activa'),
	(5, 'Pollo', 'Pollo broaster y apanado', 'activa'),
	(6, 'Bebidas', 'Gaseosas, jugos y agua', 'activa'),
	(7, 'Helados', 'Bolas de helado sencilla y doble.', 'activa');

-- Volcando estructura para tabla antojitos_db.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.clientes: ~12 rows (aproximadamente)
INSERT IGNORE INTO `clientes` (`id_cliente`, `nombre`, `telefono`, `direccion`, `correo`, `fecha_registro`) VALUES
	(1, 'Paula Escobar', '32423443', 'Hormiguero', 'paula@correo.com', '2026-06-10 16:18:12'),
	(2, 'Adriana Lopez', '6473647', '', 'hjefjfje@hhde.com', '2026-07-15 14:11:32'),
	(3, 'diana soto', '64874875', '', 'bsdvsh@hbsdjs.com', '2026-07-27 21:03:40'),
	(4, 'maria lopez', '0208327', '', 'teukhew@jksdb.com', '2026-07-27 21:09:39'),
	(5, 'santiago gomez', '986747346', 'Calle 12', 'fsdwhds@hdcd.com', '2026-08-01 00:43:45'),
	(6, 'miriham', 'gonzalez', '', 'mcjldhfdkhkg@ddlkljd.com', '2026-08-06 09:07:39'),
	(7, 'soledad castro', '23232323', '', 'kagsjhaq@djk.com', '2026-08-06 09:20:06'),
	(8, 'Carlos perea', '27472892', 'Casa 24', 'carsjhdb@kldhfde.com', '2026-08-06 10:20:24'),
	(9, 'Carlos perea', '27472892', 'Casa 24', 'carsjhdb@kldhfde.com', '2026-08-06 10:28:11'),
	(10, 'Carlos perea', '27472892', 'Casa 24', 'carsjhdb@kldhfde.com', '2026-08-06 10:31:36'),
	(11, 'Arturo Calle', '989612515', 'Calle 1', 'artgxdbnvbd@bdxxgdyhd.com', '2026-08-06 10:43:39'),
	(12, 'Andres Perez', '9879623', '', 'wfdgwdd@dghkee.com', '2026-08-06 10:45:29');

-- Volcando estructura para tabla antojitos_db.configuracion
CREATE TABLE IF NOT EXISTS `configuracion` (
  `id_config` int NOT NULL AUTO_INCREMENT,
  `nombre_negocio` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `nit` int DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `horario_apertura` time DEFAULT NULL,
  `horario_cierre` time DEFAULT NULL,
  `dias_atencion` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla antojitos_db.configuracion: ~1 rows (aproximadamente)
INSERT IGNORE INTO `configuracion` (`id_config`, `nombre_negocio`, `nit`, `telefono`, `direccion`, `horario_apertura`, `horario_cierre`, `dias_atencion`) VALUES
	(1, 'Antojitos', 123456789, '987654321', 'Sur de Cali', '18:00:00', '22:30:00', 'Martes a Domingo');

-- Volcando estructura para tabla antojitos_db.detalle_pedidos
CREATE TABLE IF NOT EXISTS `detalle_pedidos` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_pedido` (`id_pedido`),
  KEY `fk_detalle_producto` (`id_producto`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.detalle_pedidos: ~13 rows (aproximadamente)
INSERT IGNORE INTO `detalle_pedidos` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
	(1, 1, 1, 1, 15000.00, 15000.00),
	(2, 1, 3, 1, 17000.00, 17000.00),
	(3, 2, 4, 2, 27000.00, 54000.00),
	(4, 3, 4, 1, 27000.00, 27000.00),
	(5, 4, 4, 1, 27000.00, 27000.00),
	(6, 5, 4, 3, 27000.00, 81000.00),
	(7, 6, 4, 2, 27000.00, 54000.00),
	(8, 7, 4, 1, 27000.00, 27000.00),
	(9, 8, 2, 3, 7500.00, 22500.00),
	(10, 9, 2, 2, 7500.00, 15000.00),
	(11, 10, 2, 1, 7500.00, 7500.00),
	(12, 11, 1, 1, 15000.00, 15000.00),
	(13, 12, 2, 1, 7500.00, 7500.00);

-- Volcando estructura para tabla antojitos_db.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `id_factura` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `numero_factura` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subtotal` decimal(10,2) NOT NULL,
  `impuesto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'emitida',
  PRIMARY KEY (`id_factura`),
  UNIQUE KEY `uq_numero_factura` (`numero_factura`),
  UNIQUE KEY `uq_pedido_factura` (`id_pedido`),
  CONSTRAINT `fk_factura_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.facturas: ~11 rows (aproximadamente)
INSERT IGNORE INTO `facturas` (`id_factura`, `id_pedido`, `numero_factura`, `fecha_emision`, `subtotal`, `impuesto`, `total`, `estado`) VALUES
	(1, 2, 'FAC-1784142692314', '2026-07-15 14:11:32', 45378.15, 8621.85, 54000.00, 'emitida'),
	(2, 3, 'FAC-1785204220563', '2026-07-27 21:03:40', 22689.08, 4310.92, 27000.00, 'emitida'),
	(3, 4, 'FAC-1785204579363', '2026-07-27 21:09:39', 22689.08, 4310.92, 27000.00, 'emitida'),
	(4, 5, 'FAC-1785563024931', '2026-08-01 00:43:45', 68067.23, 12932.77, 81000.00, 'emitida'),
	(5, 6, 'FAC-1786025258967', '2026-08-06 09:07:39', 45378.15, 8621.85, 54000.00, 'emitida'),
	(6, 7, 'FAC-1786026005837', '2026-08-06 09:20:06', 22689.08, 4310.92, 27000.00, 'emitida'),
	(7, 8, 'FAC-1786029624476', '2026-08-06 10:20:24', 18907.56, 3592.44, 22500.00, 'emitida'),
	(8, 9, 'FAC-1786030090794', '2026-08-06 10:28:11', 12605.04, 2394.96, 15000.00, 'emitida'),
	(9, 10, 'FAC-1786030296576', '2026-08-06 10:31:37', 6302.52, 1197.48, 7500.00, 'emitida'),
	(10, 11, 'FAC-1786031019498', '2026-08-06 10:43:39', 12605.04, 2394.96, 15000.00, 'emitida'),
	(11, 12, 'FAC-1786031128642', '2026-08-06 10:45:29', 6302.52, 1197.48, 7500.00, 'emitida');

-- Volcando estructura para tabla antojitos_db.insumos
CREATE TABLE IF NOT EXISTS `insumos` (
  `id_insumo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `unidad_medida` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad_disponible` int DEFAULT NULL,
  `stock_minimo` int DEFAULT NULL,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_insumo`),
  UNIQUE KEY `uq_nombre_insumo` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.insumos: ~14 rows (aproximadamente)
INSERT IGNORE INTO `insumos` (`id_insumo`, `nombre`, `unidad_medida`, `cantidad_disponible`, `stock_minimo`, `fecha_actualizacion`) VALUES
	(1, 'Pan de hamburguesa', 'unidades', 92, 20, '2026-08-06 10:43:41'),
	(2, 'Carne de hamburguesa', 'unidades', 42, 10, '2026-08-10 19:18:02'),
	(3, 'Queso tajado', 'unidades', 92, 20, '2026-08-06 10:43:41'),
	(4, 'Salchicha', 'unidades', 80, 20, '2026-04-07 12:32:21'),
	(5, 'Papa', 'kg', 16, 5, '2026-08-10 19:39:33'),
	(6, 'Masa de pizza', 'unidades', 30, 10, '2026-04-07 12:32:21'),
	(7, 'Pollo entero', 'kg', 15, 3, '2026-04-07 12:32:21'),
	(8, 'Lechuga', 'kg', 3, 1, '2026-04-07 12:32:21'),
	(9, 'Tomate', 'unidades', 2, 5, '2026-08-06 10:43:41'),
	(10, 'Salsa de tomate', 'litros', 5, 1, '2026-04-07 12:32:21'),
	(14, 'Pan perro', 'unidades', 55, 10, '2026-08-10 19:41:13'),
	(15, 'Muslo de pollo', 'unidad', 39, 10, '2026-08-06 10:45:30'),
	(16, 'Ala de pollo', 'unidad', 40, 10, '2026-08-06 10:11:06'),
	(17, 'Pechuga de pollo', 'unidad', 30, 5, '2026-08-06 10:11:25');

-- Volcando estructura para tabla antojitos_db.movimientos_inventario
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `id_insumo` int NOT NULL,
  `tipo_movimiento` enum('entrada','salida','ajuste') COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `motivo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_movimiento`),
  KEY `fk_mov_insumo` (`id_insumo`),
  KEY `fk_mov_usuario` (`id_usuario`),
  CONSTRAINT `fk_mov_insumo` FOREIGN KEY (`id_insumo`) REFERENCES `insumos` (`id_insumo`) ON UPDATE CASCADE,
  CONSTRAINT `fk_mov_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.movimientos_inventario: ~5 rows (aproximadamente)
INSERT IGNORE INTO `movimientos_inventario` (`id_movimiento`, `id_insumo`, `tipo_movimiento`, `cantidad`, `motivo`, `id_usuario`, `fecha`) VALUES
	(1, 2, 'entrada', 40.000, 'Compra a proveedor', 4, '2026-08-10 19:18:02'),
	(2, 5, 'salida', 8.000, 'Papa en mal estado', 4, '2026-08-10 19:38:59'),
	(3, 5, 'entrada', 11.000, 'Compra a proveedor', 4, '2026-08-10 19:39:33'),
	(4, 14, 'salida', 45.000, 'Producto vencido', 4, '2026-08-10 19:40:46'),
	(5, 14, 'entrada', 50.000, 'Compra a proveedor', 4, '2026-08-10 19:41:17');

-- Volcando estructura para tabla antojitos_db.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','en preparacion','listo','entregado','cancelado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendiente',
  `tipo_entrega` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `metodo_pago` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `notas` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedido_cliente` (`id_cliente`),
  CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.pedidos: ~12 rows (aproximadamente)
INSERT IGNORE INTO `pedidos` (`id_pedido`, `id_cliente`, `fecha_pedido`, `estado`, `tipo_entrega`, `metodo_pago`, `total`, `notas`) VALUES
	(1, 1, '2026-06-10 16:18:12', 'entregado', 'domicilio', 'efectivo', 32000.00, 'Ninguna'),
	(2, 2, '2026-07-15 14:11:32', 'entregado', 'local', 'efectivo', 54000.00, 'Ninguna'),
	(3, 3, '2026-07-27 21:03:40', 'entregado', 'local', 'efectivo', 27000.00, 'Sin salsa bbq'),
	(4, 4, '2026-07-27 21:09:39', 'entregado', 'local', 'efectivo', 27000.00, 'Ninguna'),
	(5, 5, '2026-08-01 00:43:45', 'en preparacion', 'domicilio', 'efectivo', 81000.00, 'Sin cebolla'),
	(6, 6, '2026-08-06 09:07:39', 'pendiente', 'para llevar', 'efectivo', 54000.00, 'Ninguna'),
	(7, 7, '2026-08-06 09:20:06', 'pendiente', 'local', 'efectivo', 27000.00, 'Ninguna'),
	(8, 8, '2026-08-06 10:20:24', 'listo', 'domicilio', 'efectivo', 22500.00, 'Agregar miel'),
	(9, 9, '2026-08-06 10:28:11', 'entregado', 'domicilio', 'efectivo', 15000.00, 'Agregar miel'),
	(10, 10, '2026-08-06 10:31:37', 'listo', 'domicilio', 'efectivo', 7500.00, 'Agregar miel'),
	(11, 11, '2026-08-06 10:43:39', 'entregado', 'domicilio', 'efectivo', 15000.00, 'Niguna'),
	(12, 12, '2026-08-06 10:45:29', 'listo', 'para llevar', 'efectivo', 7500.00, 'Ninguna');

-- Volcando estructura para tabla antojitos_db.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_categoria` int NOT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_producto`),
  KEY `fk_producto_categoria` (`id_categoria`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.productos: ~4 rows (aproximadamente)
INSERT IGNORE INTO `productos` (`id_producto`, `id_categoria`, `nombre`, `descripcion`, `precio`, `imagen`, `disponible`) VALUES
	(1, 1, 'Hamburguesa sencilla', 'Hamburguesa sencilla, con pan brioch, carne artesanal, lechuga, tomate, cebolla, queso, ripio de papa y salsas.', 15000.00, '1780376739478.png', 1),
	(2, 5, 'Muslo con papas', 'Muslo de pollo apanado', 7500.00, '1780450020494.png', 1),
	(3, 1, 'Hamburguesa doble', 'Hamburguesa doble, con pan brioch, doble carne artesanal, lechuga, tomate, cebolla, queso, ripio de papa y salsas.', 17000.00, '1781024005081.png', 1),
	(4, 1, 'Hamburguesa angus', 'Hamburguesa con carne angus, con pan brioch, lechuga, tomate, cebolla, queso, ripio de papa y salsas.', 27000.00, '1781024068333.png', 1);

-- Volcando estructura para tabla antojitos_db.producto_insumos
CREATE TABLE IF NOT EXISTS `producto_insumos` (
  `id_producto` int NOT NULL,
  `id_insumo` int NOT NULL,
  `cantidad_requerida` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`,`id_insumo`),
  KEY `fk_pi_insumo` (`id_insumo`),
  CONSTRAINT `fk_pi_insumo` FOREIGN KEY (`id_insumo`) REFERENCES `insumos` (`id_insumo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pi_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.producto_insumos: ~15 rows (aproximadamente)
INSERT IGNORE INTO `producto_insumos` (`id_producto`, `id_insumo`, `cantidad_requerida`) VALUES
	(1, 1, 1),
	(1, 2, 1),
	(1, 3, 1),
	(1, 9, 1),
	(2, 5, 1),
	(2, 15, 1),
	(3, 1, 1),
	(3, 2, 2),
	(3, 3, 2),
	(3, 8, 1),
	(3, 9, 1),
	(4, 1, 1),
	(4, 2, 1),
	(4, 3, 1),
	(4, 9, 1);

-- Volcando estructura para tabla antojitos_db.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'administrador',
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_correo_usuario` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla antojitos_db.usuarios: ~6 rows (aproximadamente)
INSERT IGNORE INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `rol`, `fecha_registro`) VALUES
	(1, 'Administrador Antojitos', 'admin@antojitos.com', '$2y$10$ejemploHashBcrypt', 'administrador', '2026-04-07 12:32:21'),
	(3, 'Administrador Dos', 'admindos@antojitos.com', 'usuario1234', 'administrador', '2026-05-07 20:03:54'),
	(4, 'Admin', 'admintres@antojitos.com', '$2b$10$D0DjG8MwV8zbHSABdkRi6uL/ZGePVnyx.ltsVhrqpFarZCTcpybFi', 'administrador', '2026-05-07 21:37:15'),
	(5, 'Administrador oficial', 'adminprincipal@antojitos.com', 'Admin12345', 'administrador', '2026-06-02 20:58:05'),
	(6, 'prueba', 'prueba@antojitos.com', '$2b$10$vKQ20XYpkb63/ZIhBEhDuO4lbn6ocGr6UAigWZcVQwkLoWFWGwL0a', 'Trabajador', '2026-08-26 16:55:40'),
	(10, 'prueba2', 'prueba2@antojitos.com', '$2b$10$8oMEuwmuMPgGAZFlLZDI3eSXvcBdz4rH7DeDpiBsbmRSAygHtgOlC', 'Trabajador', '2026-08-26 19:20:14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
