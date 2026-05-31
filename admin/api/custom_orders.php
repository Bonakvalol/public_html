<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'p92675cc_auth';
$username = 'p92675cc_auth';
$password = 'Zefirax123@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT * FROM custom_orders ORDER BY created_at DESC");
    $orders = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'orders' => $orders,
        'count' => count($orders),
        'message' => 'Данные загружены успешно'
    ], JSON_UNESCAPED_UNICODE);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'orders' => [],
        'count' => 0
    ], JSON_UNESCAPED_UNICODE);
}
?>