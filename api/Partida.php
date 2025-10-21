<?php
class Partida
{
    private $conn;
    // constructor recibe la conexión a la BD
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function insertarPartida($fecha, $jugadores, $puntaje, $ganador)
    {
        $query = "INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) VALUES (:fecha, :jugadores, :puntaje, :ganador);";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":fecha", $fecha, PDO::PARAM_STR);

        $stmt->bindParam(":jugadores", $jugadores, PDO::PARAM_INT);

        $stmt->bindParam(":puntaje", $puntaje, PDO::PARAM_INT);

        $stmt->bindParam(":ganador", $ganador, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function crearTablero($idPartida)
    {
        # Creamos la consulta
        $query = "INSERT INTO Tablero(id_partida) VALUES (:idPartida)";
        # Preparamos la consulta
        $stmt = $this->conn->prepare($query);
        # Reemplazamos la etiqueta por el parametro dado a la función
        $stmt->bindParam(":idPartida", $idPartida, PDO::PARAM_INT);
        # Ejecutamos la consulta preparada
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }
}
