USE BDDS;

-- Desactivar las restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

select * from Partida;

-- Eliminar datos de las tablas dependientes
DELETE FROM Colocacion where id_recinto >= 1;
DELETE FROM Juega where id_usuario >= 1;
DELETE FROM Recinto where id_recinto >= 1;
DELETE FROM Tablero where id_tablero >= 1;
DELETE FROM Partida where id_partida >= 1;

-- Reiniciar los autoincrementos
ALTER TABLE Partida AUTO_INCREMENT = 1;
ALTER TABLE Tablero AUTO_INCREMENT = 1;
ALTER TABLE Recinto AUTO_INCREMENT = 1;

-- Reactivar las restricciones
SET FOREIGN_KEY_CHECKS = 1;

-- Confirmación (opcional)
SELECT COUNT(*) AS total_usuarios FROM Usuario;
SELECT COUNT(*) AS total_dinosaurios FROM Dinosaurio;
SELECT COUNT(*) AS total_partidas FROM Partida;

#20:56:26	DELETE FROM Juega where 1 = 1	Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.  To disable safe mode, toggle the option in Preferences -> SQL Editor and reconnect.	0.015 sec

