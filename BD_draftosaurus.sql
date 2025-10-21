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
    FOREIGN KEY (ganador) REFERENCES Usuario(id_usuario)
);

# Consultar la tabla Partida
SELECT * FROM Partida;


# Ingresar datos a la tabla Partida
#INSERT INTO Partida(fecha, cant_jugadores, puntaje_final, ganador) VALUES (curdate(), 3, 30, 1);


# ================================
# Tabla de tableros: Tablero(id_tablero, id_partida)
# ================================
CREATE TABLE Tablero(
    id_tablero INT AUTO_INCREMENT PRIMARY KEY,
    id_partida INT NOT NULL,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida)
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
#INSERT INTO Recinto(nombre, id_tablero) VALUES ("parejas", 1);


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

# Ingresar datos a la tabla Juega
#INSERT INTO Juega(id_usuario, id_partida) VALUES (1, 1);

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

# Eliminar los datos previos de la tabla Colocacion y reiniciar auto_increment
#DELETE FROM Colocacion where id_recinto >0;
#ALTER TABLE Dinosaurio AUTO_INCREMENT = 1;

# Consultar la tabla Colocacion
SELECT * FROM Colocacion;

# Ingresar datos a la tabla Colocacion
#INSERT INTO Colocacion(id_recinto, id_dinosaurio) VALUES (1, 1);

