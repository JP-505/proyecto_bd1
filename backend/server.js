const express = require("express");
const cors = require("cors");
const db = require('./db'); // Importamos la conexión una sola vez
const app = express();

// Middlewares globales (¡OBLIGATORIO que estén antes de las rutas!)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  db.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

// Ruta única para procesar y guardar el mensaje de contacto
app.post('/enviar-mensaje', (req, res) => {
  console.log("Datos Recibidos:", req.body); // Debería imprimir el objeto con nombre, correo, etc.

  const { nombre, correo, asunto, mensaje } = req.body;

  if (!correo) {
    return res.status(400).json({ exito: false, mensaje: "El correo es obligatorio" });
  }

  const query = 'INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)';
  
  db.query(query, [nombre, correo, asunto, mensaje], (err, resultado) => {
    if (err) {
      console.error('ERROR DE MYSQL:', err);
      return res.status(500).json({ exito: false, mensaje: 'Error en el servidor: ' + err.sqlMessage });
    }
    
    res.json({ exito: true, mensaje: '¡Mensaje guardado correctamente!' });
  });
});

// 3. Actualizar un producto existente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE ID = ?"; 
  const valores = [nombre, precio, stock, id];

  db.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 4. Eliminar un producto (DELETE)
app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE ID = ?"; 

  db.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});