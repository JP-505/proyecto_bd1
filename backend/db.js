require("dotenv").config();
const mysql = require("mysql2");
const { use } = require("react");

// Configuración de la conexion a MySql
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || ""; 
const database = process.env.DB_NAME || "tienda";

// Opciones ded configuracion
const configuracion = {
    host,
    port,
    user,
    password,
    database,
};

// Si el host es remoto (TiDB Cloud), habilitar el SSL automatica
if (host !== "localhost" && host !=="127.0.0.1") {
    configuracion.ssl= {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
    };
}

// Crear la conexion con MySQL o TIDB Cloud
const conexion = mysql.createConnection(configuracion)

// Comprobamos si la conexion fue exitosa
conexion.connect((error) => {
    if (error) {
        console.error("error al conectar con la Base de datos", error.message);
        return;
    }
    console.log(`Conexion exitosa con la base de datos (${host}:${port})`);
})

// Comprobar si la conexion fue exitosa

// Exportar la conexion para reutilizarla en las rutas del servidor
module.exports = conexion;