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
    estado bool default false,
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

#DELETE FROM Tablero where id_tablero >0;
#ALTER TABLE Dinosaurio AUTO_INCREMENT = 1;

# Consultar la tabla Tablero
SELECT * FROM Tablero;

# Ingresar datos a la tabla Tablero
#INSERT INTO Tablero(id_partida) VALUES (1);


# ================================
# Tabla de recintos: Recinto(id_recinto, nombre, id_tablero)
# ================================
CREATE TABLE Recinto(
    id_recinto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_tablero INT NOT NULL,
    FOREIGN KEY (id_tablero) REFERENCES Tablero(id_tablero)
);

# eliminar datos anteriores de la tabla
#DELETE FROM Recinto where id_recinto >0;
#ALTER TABLE Recinto AUTO_INCREMENT = 1;

# Consultar la tabla Recinto
SELECT * FROM Recinto;
# Ingresar datos a la tabla Recinto
#INSERT INTO Recinto(nombre, id_tablero) VALUES ("El Bosque de la Semejanza", 2),("El Prado de la Diferencia",2),("La Pradera del Amor",2),("El Trío Frondoso",2),("El Rey de la Selva",2),("La Isla Solitaria",2),("El Rio",2);


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

# eliminar datos existentes de la tabla
#DELETE FROM Juega where id_usuario >0;

# Consultar la tabla Juega
SELECT * FROM Juega;
#select id_partida from Juega order by id_partida desc limit 1;

# Ingresar datos a la tabla Juega
# INSERT INTO Juega(id_usuario, id_partida) VALUES (2, 7);

# ================================
# Relación Recinto - Dinosaurio: Colocacion(id_recinto, id_dinosaurio)
# ================================
CREATE TABLE Colocacion(
    id_recinto INT NOT NULL,
    id_dinosaurio INT NOT NULL,
    id_tablero INT NOT NULL,
    PRIMARY KEY (id_recinto, id_tablero),
    FOREIGN KEY (id_recinto) REFERENCES Recinto(id_recinto),
    FOREIGN KEY (id_dinosaurio) REFERENCES Dinosaurio(id_dinosaurio),
    FOREIGN KEY (id_tablero) REFERENCES Tablero(id_tablero)
);



# Ingresar datos a la tabla Colocacion
INSERT INTO Colocacion(id_recinto,id_dinosaurio) values (2,1);

# Eliminar los datos previos de la tabla Colocacion y reiniciar auto_increment
#DELETE FROM Colocacion where id_recinto >0;
#ALTER TABLE Dinosaurio AUTO_INCREMENT = 1;

# Consultar la tabla Colocacion
SELECT * FROM Colocacion ;



# Consultar de ranking
SELECT  
    u.nombre AS Nombre,
    u.edad AS Edad,
    p.puntaje_final AS Puntos,
    CASE 
        WHEN p.estado = 1 THEN 'Completada'
        WHEN p.estado = 0 THEN 'Incompleta'
        ELSE 'Desconocido'
    END AS Estado
FROM Partida p
JOIN Usuario u ON p.ganador = u.id_usuario
WHERE p.puntaje_final IS NOT NULL and Estado is not FALSE
ORDER BY p.puntaje_final DESC LIMIT 7;

# Obtener el estado de una partida
select estado from Partida where id_partida = 1; 

select * from Partida;

# Cambiar el estado de la partida
UPDATE Partida
SET estado = TRUE, puntaje_final = 35
WHERE id_partida = 1;

SELECT * FROM Partida;














