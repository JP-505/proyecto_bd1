const mysql = require("mysql2");

// Configuración de la conexion a MySql
const conexion = mysql.createConnection({
    host: "localhost",   // Servidor local
    user: "root",       // Usuario de MySQL (Por defecto en XAMPP)
    database: "tienda",  // Nombre de nuestra BD
    port: 3307
});

// Comprobar si la conexion fue exitosa

conexion.connect((error) =>{
    if (error){
        console.error("Error al conectar con MySQL:", error);
    }
    console.log("Conexion exitosa con MySQL");
});

// Exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;