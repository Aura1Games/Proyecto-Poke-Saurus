<?php
class Ranking
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function consultaRanking()
    {
        $query = "WITH ranking AS (
    SELECT
        u.nombre AS Nombre,
        u.edad AS Edad,
        p.puntaje_final AS Puntos,
        CASE 
            WHEN p.estado = 1 THEN 'Completada'
            WHEN p.estado = 0 THEN 'Incompleta'
            ELSE 'Desconocido'
        END AS Estado,
        ROW_NUMBER() OVER (PARTITION BY p.ganador ORDER BY p.puntaje_final DESC) AS rn
    FROM Partida p
    JOIN Usuario u ON p.ganador = u.id_usuario
    WHERE p.puntaje_final IS NOT NULL AND p.estado IS TRUE
)
SELECT Nombre, Edad, Puntos, Estado
FROM ranking
WHERE rn = 1 
ORDER BY Puntos DESC
LIMIT 7;
        ";

        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            // Devuelve todas las filas
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
}
