<?php
// Definimos la clase Animal, que nos permitirá interactuar con la tabla 'animales' de la base de datos
class Usuarios
{
    // Propiedad privada para almacenar la conexión a la base de datos
    private $conn;
    // Propiedad privada que contiene el nombre de la tabla a usar
    private $table = "usuario";

    // El constructor recibe una conexión a la base de datos y la guarda en la propiedad $conn
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Método para obtener todos los registros de animales de la base de datos
    public function getAll()
    {
        // Creamos la consulta SQL para seleccionar los campos deseados de la tabla 'animales'
        $query = "SELECT id_usuario, nombre, contraseña, edad, correo FROM {$this->table}";
        // Preparamos la consulta usando la conexión a la base de datos para evitar inyecciones SQL
        $stmt = $this->conn->prepare($query);
        // Ejecutamos la consulta preparada
        $stmt->execute();
        // Obtenemos todos los resultados como un array asociativo y lo devolvemos
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Método para obtener un animal específico por su ID
    public function getByName($nombre)
    {
        // Creamos la consulta SQL con un marcador de posición para el ID
        $query = "SELECT id_usuario,nombre,contraseña FROM {$this->table} WHERE nombre = :nombre";
        // Preparamos la consulta usando la conexión a la base de datos
        $stmt = $this->conn->prepare($query);
        // Asociamos el valor recibido en $id al marcador ':id' en la consulta, asegurando que sea un entero
        $stmt->bindParam(":nombre", $nombre, PDO::PARAM_STR);
        // Ejecutamos la consulta preparada
        $stmt->execute();
        // Obtenemos el resultado como un array asociativo (solo un registro) y lo devolvemos
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
