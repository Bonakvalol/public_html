<?php
while (ob_get_level()) {
    ob_end_clean();
}

ini_set('display_errors', 0);
error_reporting(E_ALL);

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

// ВНИМАНИЕ: Рабочие параметры подключения удалены для защиты данных.
// Демонстрация работы сайта производится с устройства владельца.

$host = 'localhost';
$dbname = '';           // пусто — подключения не будет
$username = '';         // пусто — подключения не будет
$password = '';         // пусто — подключения не будет

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false, 
        'error' => 'Database connection failed'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();
        
        $result = [];
        foreach ($orders as $order) {
            $date = '';
            if (!empty($order['created_at'])) {
                try {
                    $dateObj = new DateTime($order['created_at']);
                    $date = $dateObj->format('d.m.Y H:i');
                } catch (Exception $e) {
                    $date = $order['created_at'];
                }
            }
            
            $result[] = [
                'id' => (int)$order['id'],
                'order_number' => $order['order_number'] ?: 'N/A',
                'customer_name' => $order['customer_name'] ?: 'Не указан',
                'customer_phone' => $order['customer_phone'] ?: 'Не указан',
                'customer_email' => $order['customer_email'] ?: '',
                'total_amount' => $order['total_amount'] ? (float)$order['total_amount'] : 0,
                'delivery_type' => $order['delivery_type'] ?: 'pickup',
                'status' => $order['status'] ?: 'new',
                'created_at' => $order['created_at'],
                'created_at_formatted' => $date,
                'delivery_address' => $order['delivery_address'] ?: '',
                'card_message' => $order['card_message'] ?: '',
                'comments' => $order['comments'] ?: ''
            ];
        }
        
        $statusCounts = [
            'new' => 0,
            'confirmed' => 0,
            'in_progress' => 0,
            'delivered' => 0,
            'cancelled' => 0
        ];
        
        foreach ($result as $order) {
            if (isset($statusCounts[$order['status']])) {
                $statusCounts[$order['status']]++;
            }
        }
        
        $response = [
            'success' => true,
            'orders' => $result,
            'count' => count($result),
            'status_counts' => $statusCounts
        ];
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        
    } catch(PDOException $e) {
        error_log("Orders API Error: " . $e->getMessage());
        
        echo json_encode([
            'success' => false, 
            'error' => 'Ошибка при получении заказов',
            'count' => 0,
            'orders' => [],
            'status_counts' => []
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode([
        'success' => false, 
        'error' => 'Метод не поддерживается'
    ], JSON_UNESCAPED_UNICODE);
}

exit;
?>