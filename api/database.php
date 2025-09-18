<?php // api/database.php
// Configuración y conexión a la base de datos

// Definimos constantes para los datos de conexión a la base de datos
const DB_HOST = 'localhost'; // Dirección del servidor de base de datos (normalmente 'localhost')
const DB_NAME = 'BDDS'; // Nombre de la base de datos a la que queremos conectarnos
const DB_USER = 'root'; // Usuario de la base de datos (por defecto en XAMPP suele ser 'root')
const DB_PASS = 'vegetta777'; // Contraseña del usuario de la base de datos (en XAMPP suele estar vacía)

// Definimos una clase llamada Database para manejar la conexión a la base de datos
class Database
{
    // Propiedades privadas para almacenar los datos de conexión
    private $host = DB_HOST; // Almacena el host de la base de datos
    private $db_name = DB_NAME; // Almacena el nombre de la base de datos
    private $username = DB_USER; // Almacena el nombre de usuario
    private $password = DB_PASS; // Almacena la contraseña
    private $conn; // Aquí se guardará el objeto de conexión PDO

    // Método público para establecer la conexión a la base de datos
    public function connect()
    {
        $this->conn = null; // Inicializamos la conexión como null

        try {
            // Intentamos crear una nueva instancia de PDO para conectarnos a MySQL
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name, // Cadena de conexión con host y nombre de la base
                $this->username, // Usuario
                $this->password  // Contraseña
            );
            // Configuramos PDO para que lance excepciones en caso de error
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Establecemos el conjunto de caracteres a UTF-8 para soportar caracteres especiales
            $this->conn->exec("SET NAMES utf8");
        } catch (PDOException $e) {
            // Si ocurre un error, mostramos un mensaje con la descripción
            echo "Error de conexión: " . $e->getMessage();
        }
        // Devolvemos el objeto de conexión (o null si falló)
        return $this->conn;
    }
}
