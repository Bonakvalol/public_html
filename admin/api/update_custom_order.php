<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'p92675cc_auth';
$username = 'p92675cc_auth';
$password = 'Zefirax123@';

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
    
    if (!$data || !isset($data['orderId']) || !isset($data['status'])) {
        echo json_encode(['success' => false, 'message' => 'Неверные данные']);
        exit;
    }
    
    $orderId = (int)$data['orderId'];
    $status = trim($data['status']);
    
    $validStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if (!in_array($status, $validStatuses)) {
        echo json_encode(['success' => false, 'message' => 'Неверный статус']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE custom_orders SET status = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$status, $orderId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Статус обновлен',
            'orderId' => $orderId,
            'status' => $status
        ], JSON_UNESCAPED_UNICODE);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Ошибка обновления: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
}
?>