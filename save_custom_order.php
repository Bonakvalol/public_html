<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['phone']) || !isset($input['description'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Неверные данные']);
        exit;
    }
    
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    try {
        $name = trim(strip_tags($input['name']));
        $phone = trim(strip_tags($input['phone']));
        $email = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';
        $description = trim(strip_tags($input['description']));
        $budget = isset($input['budget']) ? floatval($input['budget']) : 5000;
        
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $email = '';
        }
        
        $stmt = $pdo->prepare("INSERT INTO custom_orders 
            (user_id, name, phone, email, description, budget, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        
        $stmt->execute([
            $userId,
            $name,
            $phone,
            $email,
            $description,
            $budget,
            'new'
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Заявка на индивидуальный заказ сохранена! Мы свяжемся с вами в ближайшее время.', 
            'orderId' => $orderId
        ]);
        
    } catch(PDOException $e) {
        error_log("Custom order save error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Ошибка сохранения заявки: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
}
?>