<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

if (!$auth->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(array('success' => false, 'message' => 'Необходимо авторизоваться'));
    exit;
}

try {
    $user = $auth->getUser();
    $user_id = $user['id'];
    
    $stmt = $pdo->prepare("SELECT * FROM `orders` WHERE `user_id` = ? ORDER BY `created_at` DESC LIMIT 50");
    $stmt->execute(array($user_id));
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($orders as &$order) {
        if ($order['order_data']) {
            $order['order_data'] = json_decode($order['order_data'], true);
        }
    }
    
    echo json_encode(array(
        'success' => true,
        'orders' => $orders
    ), JSON_UNESCAPED_UNICODE);
    
} catch (PDOException $e) {
    error_log("Get orders error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'Ошибка получения заказов'));
}
?>