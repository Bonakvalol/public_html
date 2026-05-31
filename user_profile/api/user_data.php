<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешен']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Требуется авторизация']);
    exit;
}

// ВНИМАНИЕ: Рабочие параметры подключения удалены для защиты данных.
// Демонстрация работы сайта производится с устройства владельца.

$host = 'localhost';
$dbname = '';           // пусто — подключения не будет
$username = '';         // пусто — подключения не будет
$password = '';         // пусто — подключения не будет

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка подключения к БД']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Пользователь не найден']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent
        FROM orders WHERE user_id = ?");
    $stmt->execute([$userId]);
    $stats = $stmt->fetch();
    
    $createdAtFormatted = '';
    if (!empty($user['created_at'])) {
        try {
            $date = new DateTime($user['created_at']);
            $createdAtFormatted = $date->format('d.m.Y H:i');
        } catch (Exception $e) {
            $createdAtFormatted = $user['created_at'];
        }
    }
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'phone' => $user['phone'] ?? '',
            'role' => $user['role'],
            'created_at_formatted' => $createdAtFormatted,
            'total_orders' => (int)($stats['total_orders'] ?? 0),
            'total_spent' => (int)($stats['total_spent'] ?? 0)
        ]
    ], JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Ошибка получения данных']);
}
?>