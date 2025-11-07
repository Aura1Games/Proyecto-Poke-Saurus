CREATE DATABASE IF NOT exists BDDS;
use BDDS;
# La siguiente línea de código establece que la BD soporte caracteres utf-8
 ALTER DATABASE BDDS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# ================================
# Tabla de usuarios: Usuario(id_usuario, nombre, contraseña, edad, correo)
# ================================
CREATE TABLE Usuario(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL unique,
    contraseña VARCHAR(60) NOT NULL,  
    edad INT NOT NULL,
    correo VARCHAR(50) NOT NULL UNIQUE
);

# Consultar la tabla Usuario
SELECT * FROM Usuario;

# el registro de usuarios se debe de hacer mediante la pagina de registro de usuarios

# ================================
# Tabla de partidas: Partida(id_partida, fecha, cant_jugadores, puntaje_final, ganador)
# ================================
CREATE TABLE Partida(
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    cant_jugadores INT NOT NULL,
    puntaje_final INT,
    ganador INT,
    estado boolean default false,
    FOREIGN KEY (ganador) REFERENCES Usuario(id_usuario)
);

# Eliminar los datos de partida
#DELETE FROM Partida where id_partida >0;
#ALTER TABLE Partida AUTO_INCREMENT = 1;

select * from Partida;

# Ingresar datos a la tabla Partida
#INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) VALUES (curdate(), 3, 30, 1);


# ================================
# Tabla de tableros: Tablero(id_tablero, id_partida)
# ================================
CREATE TABLE Tablero(
    id_tablero INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    id_usuario INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

# Consultar la tabla Tablero
SELECT * FROM Tablero;


# ================================
# Tabla de recintos: Recinto(id_recinto, nombre, id_tablero)
# ================================
CREATE TABLE Recinto(
    id_recinto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_tablero INT NOT NULL,
    FOREIGN KEY (id_tablero) REFERENCES Tablero(id_tablero)
);
# Consultar la tabla Recinto
SELECT * FROM Recinto;

# ================================
# Tabla de dinosaurios: Dinosaurio(id_dinosaurio, especie)
# ================================
CREATE TABLE Dinosaurio(
    id_dinosaurio INT AUTO_INCREMENT PRIMARY KEY,
    color enum("rojo","verde","amarillo","naranja","rosado","celeste") NOT NULL
);

# Eliminar datos previos de la tabla Dinosaurio y reiniciar auto_increment
#DELETE FROM Dinosaurio where id_dinosaurio >0;
#ALTER TABLE Dinosaurio AUTO_INCREMENT = 1;
# Ingresar datos a la tabla Dinosaurio
INSERT INTO Dinosaurio(color) VALUES ("rojo"),("verde"),("amarillo"),("naranja"),("rosado"),("celeste");

# Consultar la tabla Dinosaurio
SELECT * FROM Dinosaurio;

# ================================
# Relación Usuario- Partida: Juega(id_usuario, id_partida)
# ================================
CREATE TABLE Juega(
    id_usuario INT NOT NULL,
    id_partida INT NOT NULL,
    PRIMARY KEY (id_usuario, id_partida),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida)
);

# Consultar la tabla Juega
SELECT * FROM Juega;


# Consultar de ranking
# Ranking 1: versión con columnas repetidas en caso de un usuario ganar mas de una vez
-- SELECT  
--     u.nombre AS Nombre,
--     u.edad AS Edad,
--     p.puntaje_final AS Puntos,
-- 	CASE 
--         WHEN p.estado = 1 THEN 'Completada'
--         WHEN p.estado = 0 THEN 'Incompleta'
--         ELSE 'Desconocido'
--     END AS Estado
-- FROM Partida p
-- JOIN Usuario u ON p.ganador = u.id_usuario
-- WHERE p.puntaje_final IS NOT NULL and Estado is not FALSE
-- ORDER BY p.puntaje_final DESC LIMIT 7;
# Ranking 2: versión con la vez que el usuario ganó por mas puntos una partida
-- WITH ranking AS (
--     SELECT
--         u.nombre AS Nombre,
--         u.edad AS Edad,
--         p.puntaje_final AS Puntos,
--         CASE 
--             WHEN p.estado = 1 THEN 'Completada'
--             WHEN p.estado = 0 THEN 'Incompleta'
--             ELSE 'Desconocido'
--         END AS Estado,
--         ROW_NUMBER() OVER (PARTITION BY p.ganador ORDER BY p.puntaje_final DESC) AS rn
--     FROM Partida p
--     JOIN Usuario u ON p.ganador = u.id_usuario
--     WHERE p.puntaje_final IS NOT NULL AND p.estado IS TRUE
-- )
-- SELECT Nombre, Edad, Puntos, Estado
-- FROM ranking
-- WHERE rn = 1 
-- ORDER BY Puntos DESC
-- LIMIT 7;











