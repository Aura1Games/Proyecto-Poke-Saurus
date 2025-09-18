<?php // api/test.php
// Archivo de prueba para insertar una partida directamente

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "database.php";
require_once "Partida.php";

$database = new Database();
$db = $database->connect(); 
$partida = new Partida($db);

// Test directo
$result = $partida->insertarPartida("2024-01-01 12:00:00", 2, 40, 1);

if ($result) {
    echo json_encode(["success" => true, "id" => $result]);
} else {
    echo json_encode(["success" => false, "error" => "Inserción falló"]);
}
