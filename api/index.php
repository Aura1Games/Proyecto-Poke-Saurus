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
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $tipo = $data['tipo'] ?? '';

        switch ($tipo) {
            case "ingresar_partida":
                funcionPartidaPOST($partida, $data);
                break;
            case "registrar_usuario":
                funcionRegistrarUsuarioPOST($usuarios, $data);
                break;
            case "verificar_login":
                funcionVerificarLoginPOST($usuarios, $db, $data);
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

// ============= FUNCIONES AUXILIARES =============

/**
 * Hashea una contraseña usando bcrypt
 */
function prepararContraseña($contraseña)
{
    return password_hash($contraseña, PASSWORD_BCRYPT);
}

/**
 * Verifica contraseña contra hash o texto plano (legacy)
 * @param string $contraseñaIngresada - Contraseña en texto plano del usuario
 * @param string $contraseñaAlmacenada - Hash o texto plano de la BD
 * @return bool
 */
function verificarContraseña($contraseñaIngresada, $contraseñaAlmacenada)
{
    // Detectar si es hash bcrypt (comienza con $2y$, $2a$ o $2b$)
    if (preg_match('/^\$2[ayb]\$/', $contraseñaAlmacenada)) {
        // Usar password_verify para hashes
        return password_verify($contraseñaIngresada, $contraseñaAlmacenada);
    } else {
        // Comparación directa para contraseñas sin hashear (legacy)
        return $contraseñaIngresada === $contraseñaAlmacenada;
    }
}

/**
 * Detecta si una contraseña está hasheada
 */
function esContraseñaHasheada($contraseña)
{
    return preg_match('/^\$2[ayb]\$/', $contraseña);
}

/**
 * Actualiza la contraseña en la base de datos
 */
function actualizarHashContraseña($db, $nombre, $nuevaContraseñaHash)
{
    try {
        $stmt = $db->prepare("UPDATE Usuario SET contraseña = ? WHERE nombre = ?");
        $stmt->execute([$nuevaContraseñaHash, $nombre]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        error_log("Error actualizando contraseña: " . $e->getMessage());
        return false;
    }
}

// ============= FUNCIONES DE ENDPOINTS =============

function funcionGet($usuarios)
{
    if (isset($_GET['nombre'])) {
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

function funcionPartidaPOST($partida, $data)
{
    if ($data === null) {
        http_response_code(400);
        echo json_encode(["mensaje" => "JSON inválido"]);
        return;
    }

    $requiredFields = ["fecha", "jugadores", "puntaje", "ganador"];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Campo '$field' es requerido"]);
            return;
        }
    }

    if (!is_numeric($data["jugadores"]) || !is_numeric($data["puntaje"]) || !is_numeric($data["ganador"])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Campos numéricos inválidos"]);
        return;
    }

    $fecha = $data["fecha"];
    $jugadores = intval($data["jugadores"]);
    $puntaje = intval($data["puntaje"]);
    $ganador = intval($data["ganador"]);

    if (!DateTime::createFromFormat('Y-m-d H:i:s', $fecha)) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Formato de fecha inválido. Use Y-m-d H:i:s"]);
        return;
    }

    try {
        $result = $partida->insertarPartida($fecha, $jugadores, $puntaje, $ganador);
        if ($result) {
            http_response_code(201);
            echo json_encode([
                "mensaje" => "Partida ingresada exitosamente",
                "id" => $result
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["mensaje" => "Error al ingresar partida"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "mensaje" => "Error interno del servidor",
            "error" => $e->getMessage()
        ]);
    }
}

function funcionRegistrarUsuarioPOST($usuarios, $data)
{
    if ($data === null) {
        http_response_code(400);
        echo json_encode(["mensaje" => "JSON inválido"]);
        return;
    }

    $requiredFields = ['nombre', 'contraseña', 'edad', 'correo'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(["mensaje" => "Campo '$field' es requerido"]);
            exit();
        }
    }

    if (!is_numeric($data["edad"])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Campo 'edad' debe ser numérico"]);
        return;
    }

    $nombre = htmlspecialchars($data['nombre'], ENT_QUOTES, 'UTF-8');
    $contra_no_preparada = htmlspecialchars($data['contraseña'], ENT_QUOTES, 'UTF-8');
    $edad = intval($data['edad']);
    $correo = filter_var($data['correo'], FILTER_SANITIZE_EMAIL);
    $contraseña = prepararContraseña($contra_no_preparada);

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Correo inválido"]);
        exit();
    }

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
            "error" => $e->getMessage()
        ]);
    }
}

/**
 * ========== NUEVA API: VERIFICAR LOGIN ==========
 * Valida credenciales y migra contraseñas antiguas automáticamente
 */
function funcionVerificarLoginPOST($usuarios, $db, $data)
{
    // Validar JSON
    if ($data === null) {
        http_response_code(400);
        echo json_encode(["mensaje" => "JSON inválido", "exito" => false]);
        return;
    }

    // Validar campos requeridos
    if (empty($data['nombre']) || empty($data['contraseña'])) {
        http_response_code(400);
        echo json_encode(["mensaje" => "Nombre y contraseña son requeridos", "exito" => false]);
        return;
    }

    // Sanitizar inputs
    $nombre = htmlspecialchars($data['nombre'], ENT_QUOTES, 'UTF-8');
    $contraseñaIngresada = $data['contraseña']; // No sanitizar contraseña para mantener integridad

    try {
        // Obtener usuario de la base de datos
        $usuario = $usuarios->getByName($nombre);

        if (!$usuario || !isset($usuario['contraseña'])) {
            http_response_code(401);
            echo json_encode(["mensaje" => "Usuario no encontrado", "exito" => false]);
            return;
        }

        $contraseñaAlmacenada = $usuario['contraseña'];

        // Verificar contraseña (hasheada o sin hashear)
        $esValida = verificarContraseña($contraseñaIngresada, $contraseñaAlmacenada);

        if (!$esValida) {
            http_response_code(401);
            echo json_encode(["mensaje" => "Contraseña incorrecta", "exito" => false]);
            return;
        }

        // Login exitoso
        $respuesta = [
            "mensaje" => "Login exitoso",
            "exito" => true,
            "usuario" => [
                "nombre" => $usuario['nombre'],
                "correo" => $usuario['correo'] ?? null,
                "edad" => $usuario['edad'] ?? null
            ]
        ];

        // Si la contraseña NO está hasheada, migrarla automáticamente
        if (!esContraseñaHasheada($contraseñaAlmacenada)) {
            $nuevoHash = prepararContraseña($contraseñaIngresada);
            $actualizado = actualizarHashContraseña($db, $nombre, $nuevoHash);

            if ($actualizado) {
                $respuesta["mensaje"] .= " (Seguridad mejorada)";
                $respuesta["migracion"] = true;
            }
        }

        http_response_code(200);
        echo json_encode($respuesta);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "mensaje" => "Error interno del servidor",
            "exito" => false,
            "error" => $e->getMessage()
        ]);
    }
}
