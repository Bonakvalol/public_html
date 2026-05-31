<?php

require_once dirname(__DIR__) . '/user_config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

if (!$auth->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Неверный формат данных']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    $orderNumber = 'FC-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    $orderData = $input['orderData'] ?? $input;
    $totalAmount = $input['total_amount'] ?? ($input['totalAmount'] ?? 0);
    
    $deliveryType = $orderData['delivery']['type'] ?? 'delivery';
    $deliveryAddress = '';
    
    if ($deliveryType === 'delivery') {
        $deliveryAddress = $orderData['delivery']['address'] ?? '';
        $apartment = $orderData['delivery']['apartment'] ?? '';
        $entrance = $orderData['delivery']['entrance'] ?? '';
        $floor = $orderData['delivery']['floor'] ?? '';
        
        if ($apartment) $deliveryAddress .= ", кв. $apartment";
        if ($entrance) $deliveryAddress .= ", подъезд $entrance";
        if ($floor) $deliveryAddress .= ", этаж $floor";
    } else {
        $deliveryAddress = 'Самовывоз: ' . ($orderData['delivery']['store'] ?? 'Не указан');
    }
    
    $customerName = $orderData['receiver']['name'] ?? $orderData['sender']['name'] ?? '';
    $customerPhone = $orderData['receiver']['phone'] ?? $orderData['sender']['phone'] ?? '';
    $customerEmail = $orderData['sender']['email'] ?? $_SESSION['user_email'] ?? '';
    $deliveryDate = $orderData['delivery']['date'] ?? null;
    $deliveryTime = $orderData['delivery']['time'] ?? null;
    $cardMessage = $orderData['card_text'] ?? ($orderData['cardText'] ?? '');
    $comments = $orderData['comment'] ?? '';
    
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            user_id, order_number, order_data, total_amount, 
            delivery_type, delivery_address, 
            customer_name, customer_phone, customer_email,
            delivery_date, delivery_time, 
            card_message, comments, 
            status, created_at
        ) VALUES (
            :user_id, :order_number, :order_data, :total_amount,
            :delivery_type, :delivery_address,
            :customer_name, :customer_phone, :customer_email,
            :delivery_date, :delivery_time,
            :card_message, :comments,
            'new', NOW()
        )
    ");
    
    $stmt->execute([
        ':user_id' => $userId,
        ':order_number' => $orderNumber,
        ':order_data' => json_encode($orderData, JSON_UNESCAPED_UNICODE),
        ':total_amount' => $totalAmount,
        ':delivery_type' => $deliveryType,
        ':delivery_address' => $deliveryAddress,
        ':customer_name' => $customerName,
        ':customer_phone' => $customerPhone,
        ':customer_email' => $customerEmail,
        ':delivery_date' => $deliveryDate,
        ':delivery_time' => $deliveryTime,
        ':card_message' => $cardMessage,
        ':comments' => $comments
    ]);
    
    $orderId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'order_number' => $orderNumber,
        'message' => 'Заказ успешно оформлен! Номер заказа: ' . $orderNumber
    ], JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    error_log("Save order error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Ошибка при сохранении заказа',
        'debug' => $e->getMessage() 
    ]);
}
?>