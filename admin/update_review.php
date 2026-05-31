<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

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
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к БД']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['reviewId']) || !isset($data['status'])) {
        echo json_encode(['success' => false, 'message' => 'Неверные данные']);
        exit;
    }
    
    $reviewId = (int)$data['reviewId'];
    $status = trim($data['status']);
    
    $validStatuses = ['pending', 'approved', 'rejected'];
    if (!in_array($status, $validStatuses)) {
        echo json_encode(['success' => false, 'message' => 'Неверный статус']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE reviews SET status = ? WHERE id = ?");
        $stmt->execute([$status, $reviewId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Статус отзыва обновлен',
            'reviewId' => $reviewId,
            'status' => $status
        ], JSON_UNESCAPED_UNICODE);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Ошибка обновления: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
}
?>