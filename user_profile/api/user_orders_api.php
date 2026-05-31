<?php
require_once dirname(__DIR__) . '/user_config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешен']);
    exit;
}

if (!$auth->isLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'Требуется авторизация']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT * FROM orders 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ");
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll();
    
    $result = [];
    foreach ($orders as $order) {
        $date = !empty($order['created_at']) 
            ? date('d.m.Y H:i', strtotime($order['created_at'])) 
            : '';
        
        $result[] = [
            'id' => (int)$order['id'],
            'order_number' => $order['order_number'] ?: 'N/A',
            'total_amount' => number_format($order['total_amount'], 0, '', ' ') . ' ₽',
            'status' => $order['status'] ?: 'new',
            'status_text' => getStatusText($order['status']),
            'delivery_type' => $order['delivery_type'] ?: 'pickup',
            'delivery_address' => $order['delivery_address'] ?: '',
            'customer_name' => $order['customer_name'] ?? '',
            'customer_phone' => $order['customer_phone'] ?? '',
            'customer_email' => $order['customer_email'] ?? '',
            'card_message' => $order['card_message'] ?? '',
            'comments' => $order['comments'] ?? '',
            'created_at_formatted' => $date
        ];
    }
    
    echo json_encode([
        'success' => true,
        'orders' => $result,
        'count' => count($result)
    ], JSON_UNESCAPED_UNICODE);
    
} catch(PDOException $e) {
    error_log("Orders API error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка получения заказов',
        'orders' => [],
        'count' => 0
    ], JSON_UNESCAPED_UNICODE);
}
?>