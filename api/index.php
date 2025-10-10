<?php
// Headers CORS completos
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivos necesarios
require_once "database.php";
require_once "Usuarios.php";
require_once "Partida.php";

// Crear instancias
$database = new Database();
$db = $database->connect();
$usuarios = new Usuarios($db);
$partida = new Partida($db);

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];



// Manejar diferentes métodos
switch ($method) {
    case 'GET':
        funcionGet($usuarios);
        break;

    case 'POST':
        // Lee todo del JSON
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $tipo = $data['tipo'] ?? '';

        switch ($tipo) {
            case "ingresar_partida":
                funcionPartidaPOST($partida);
                break;
            case "registrar_usuario":
                // Validar campos necesarios
                $requiredFields = ['nombre', 'contraseña', 'edad', 'correo'];
                foreach ($requiredFields as $field) {
                    if (empty($data[$field])) {
                        http_response_code(400);
                        echo json_encode(["mensaje" => "Campo '$field' es requerido"]);
                        exit();
                    }
                }

                // Sanitizar y asignar variables
                $nombre = htmlspecialchars($data['nombre'], ENT_QUOTES, 'UTF-8');
                $contraseña = htmlspecialchars($data['contraseña'], ENT_QUOTES, 'UTF-8');
                $edad = intval($data['edad']);
                $correo = filter_var($data['correo'], FILTER_SANITIZE_EMAIL);

                // Validar correo
                if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                    http_response_code(400);
                    echo json_encode(["mensaje" => "Correo inválido"]);
                    exit();
                }

                // Intentar registrar el usuario
                try {
                    $result = $usuarios->registerNewUser($nombre, $contraseña, $edad, $correo);
                    if ($result) {
                        http_response_code(201);
                        echo json_encode(["mensaje" => "Usuario registrado exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["mensaje" => "Error al registrar usuario"]);
                    }
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode([
                        "mensaje" => "Error interno del servidor",
                        "error" => $e->getMessage() // Solo en desarrollo, quitar en producción
                    ]);
                }
                break;
            default:
                http_response_code(400);
                echo json_encode(["mensaje" => "Tipo de acción no especificado o inválido"]);
                break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["mensaje" => "Método no permitido"]);
        break;
}

// Función para manejar GET
function funcionGet($usuarios)
{
    if (isset($_GET['nombre'])) {
        // Sanitiza el input para prevenir ataques XSS. La protección contra SQLi ya está en la consulta preparada.
        $nombre = htmlspecialchars($_GET['nombre'] ?? '', ENT_QUOTES, 'UTF-8');
        if (empty($nombre)) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Nombre inválido"]);
            return;
        }

        $data = $usuarios->getByName($nombre);
        echo json_encode($data ? $data : ["mensaje" => "Usuario no encontrado"]);
    } else {
        $data = $usuarios->getAll();
        echo json_encode($data);
    }
}

// Función para manejar POST
function funcionPartidaPOST($partida)
{
    // Lee el cuerpo de la solicitud POST, que se espera que sea un JSON
    $json = file_get_contents('php://input');
    // Decodifica el JSON en un array asociativo de PHP (el 'true' es para que sea asociativo)
    $data = json_decode($json, true);

    // Validaciones exhaustivas
    if ($data === null) {
        http_response_code(400);
        echo json_encode(["mensaje" => "JSON inválido"]);
        return;
    }

    // Campos requeridos
    $requiredFields = ["fecha", "jugadores", "puntaje", "ganador"];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Campo '$field' es requerido"]);
            return;
        }
    }

    // Validar tipos de datos
    if (!is_numeric($data["jugadores"]) || !is_numeric($data["puntaje"]) || !is_numeric($data["ganador"])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Campos numéricos inválidos"]);
        return;
    }

    // Sanitizar datos
    $fecha = $data["fecha"];
    $jugadores = intval($data["jugadores"]);
    $puntaje = intval($data["puntaje"]);
    $ganador = intval($data["ganador"]);

    // Validar fecha
    if (!DateTime::createFromFormat('Y-m-d H:i:s', $fecha)) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Formato de fecha inválido. Use Y-m-d H:i:s"]);
        return;
    }

    // Insertar con manejo de errores
    try {
        $result = $partida->insertarPartida($fecha, $jugadores, $puntaje, $ganador);
        if ($result) {
            // si está todo bien ...
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Partida ingresada exitosamente",
                "id" => $result // Asumiendo que retorna el ID insertado
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al ingresar partida"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "mensaje" => "Error interno del servidor",
            "error" => $e->getMessage() // Solo en desarrollo, quitar en producción
        ]);
    }
}
