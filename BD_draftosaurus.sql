use BDDS;
# La siguiente línea de código establece que la BD soporte caracteres utf-8
 ALTER DATABASE BDDS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# ================================
# Tabla de usuarios: Usuario(id_usuario, nombre, contraseña, edad, correo)
# ================================
CREATE TABLE Usuario(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    contraseña VARCHAR(60) NOT NULL,  
    edad INT NOT NULL,
    correo VARCHAR(50) NOT NULL UNIQUE
);
alter table Usuario change nombre nombre varchar(40) not null unique;

# Consultar la tabla Usuario
SELECT * FROM Usuario;

# Ingresar datos a la tabla Usuario
INSERT INTO Usuario(nombre, contraseña, edad, correo) 
VALUES ("Emiliano", "contra123", 18, "emi@gmail.com");

# ================================
# Tabla de partidas: Partida(id_partida, fecha, cant_jugadores, puntaje_final, ganador)
# ================================
CREATE TABLE Partida(
    id_partida INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    cant_jugadores INT NOT NULL,
    puntaje_final INT,
    ganador INT,
    FOREIGN KEY (ganador) REFERENCES Usuario(id_usuario)
);

# Consultar la tabla Partida
SELECT * FROM Partida;

INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) VALUES (curdate(), 3, 30, 1);

# Ingresar datos a la tabla Partida
INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) 
VALUES ("2025-09-05 15:30:00", 4, 40, 2);


# ================================
# Tabla de tableros: Tablero(id_tablero, id_partida)
# ================================
CREATE TABLE Tablero(
    id_tablero INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida)
);

# Consultar la tabla Tablero
SELECT * FROM Tablero;

# Ingresar datos a la tabla Tablero
INSERT INTO Tablero(id_partida) VALUES (1);


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
update Recinto set nombre="Bosque de la semejanza" where id_recinto = 1; 
# Ingresar datos a la tabla Recinto
INSERT INTO Recinto(nombre, id_tablero) VALUES ("parejas", 1);


# ================================
# Tabla de dinosaurios: Dinosaurio(id_dinosaurio, especie)
# ================================
CREATE TABLE Dinosaurio(
    id_dinosaurio INT AUTO_INCREMENT PRIMARY KEY,
    especie VARCHAR(100) NOT NULL
);

# Consultar la tabla Dinosaurio
SELECT * FROM Dinosaurio;

# Ingresar datos a la tabla Dinosaurio
INSERT INTO Dinosaurio(color) VALUES ("verde");

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

# Ingresar datos a la tabla Juega
INSERT INTO Juega(id_usuario, id_partida) VALUES (1, 1);


# ================================
# Relación Recinto - Dinosaurio: Colocacion(id_recinto, id_dinosaurio)
# ================================
CREATE TABLE Colocacion(
    id_recinto INT NOT NULL,
    id_dinosaurio INT NOT NULL,
    PRIMARY KEY (id_recinto, id_dinosaurio),
    FOREIGN KEY (id_recinto) REFERENCES Recinto(id_recinto),
    FOREIGN KEY (id_dinosaurio) REFERENCES Dinosaurio(id_dinosaurio)
);

# Consultar la tabla Colocacion
SELECT * FROM Colocacion;

# Ingresar datos a la tabla Colocacion
INSERT INTO Colocacion(id_recinto, id_dinosaurio) VALUES (1, 1);

