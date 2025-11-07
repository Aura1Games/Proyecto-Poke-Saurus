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

    public function generarRecintosBD($idTablero)
    {

        # Creamos la consulta
        $query = 'INSERT INTO Recinto(nombre, id_tablero) VALUES ("El Bosque de la Semejanza", :idTablero),("El Prado de la Diferencia", :idTablero),("La Pradera del Amor", :idTablero),("El Trío Frondoso", :idTablero),("El Rey de la Selva", :idTablero),("La Isla Solitaria", :idTablero),("El Rio", :idTablero);';
        # Preparamos a consuta
        $stmt = $this->conn->prepare($query);
        # reemplazamos las etiquetas :idTablero
        $stmt->bindParam(":idTablero", $idTablero, PDO::PARAM_INT);
        # ejecutamos la consulta
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function generarRelacionJuega($idUsuario, $idPartida)
    {
        # Creamos la consulta
        $query = 'INSERT INTO Juega(id_usuario, id_partida) VALUES (:idUsuario, :idPartida);';
        # Premaramos la consulta
        $stmt = $this->conn->prepare($query);
        # Reemplazamos las etiquetas :idUsuario y :idPartida
        $stmt->bindParam(":idUsuario", $idUsuario, PDO::PARAM_INT);
        $stmt->bindParam(":idPartida", $idPartida, PDO::PARAM_INT);
        # Ejecutamos la consulta
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function consultarUltimaPartida()
    {
        # Creamos la consulta
        $query = 'SELECT id_partida FROM Juega ORDER BY id_partida DESC LIMIT 1;';
        # Preparamos la consulta
        $stmt = $this->conn->prepare($query);
        # Ejecutamos la consulta
        if ($stmt->execute()) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
    public function insertarColocacion($idRecinto, $idDinosaurio)
    {
        # Creamos la consulta
        $query = 'INSERT INTO Colocacion(idRecinto,idDinosaurio) values (:idRecinto,:idDinosaurio);';
        # Preparamos la consulta
        $stmt = $this->conn->prepare($query);
        # Reemplazamos las etiquetas :idRecinto y :idDinosaurio
        $stmt->bindParam(":idRecinto", $idRecinto, PDO::PARAM_INT);
        $stmt->bindParam(":idDinosaurio", $idDinosaurio, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function cambiarEstadoPuntosPartida($idPartida, $puntaje)
    {
        # Crear la consulta sql
        $query = 'UPDATE Partida 
              SET estado = TRUE, puntaje_final = :puntaje 
              WHERE id_partida = :id_partida';
        # Preparamos la consulta
        $stmt = $this->conn->prepare($query);
        # Reemplazamos las etiquetas 
        $stmt->bindParam(":id_partida", $idPartida, PDO::PARAM_INT);
        $stmt->bindParam(":puntaje", $puntaje, PDO::PARAM_INT);
        # Ejecutamos la consulta
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
