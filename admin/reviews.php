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
    
    $stmt = $pdo->query("
        SELECT r.*, u.username, u.email 
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    ");
    $reviews = $stmt->fetchAll();
    
    $result = [];
    foreach ($reviews as $review) {
        $result[] = [
            'id' => (int)$review['id'],
            'user_id' => (int)$review['user_id'],
            'username' => $review['username'] ?: 'Неизвестен',
            'email' => $review['email'] ?: '',
            'order_number' => $review['order_number'],
            'rating' => (int)$review['rating'],
            'comment' => $review['comment'],
            'status' => $review['status'],
            'created_at' => $review['created_at'],
            'created_at_formatted' => date('d.m.Y H:i', strtotime($review['created_at']))
        ];
    }
    
    echo json_encode([
        'success' => true,
        'reviews' => $result,
        'count' => count($result)
    ], JSON_UNESCAPED_UNICODE);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'reviews' => [],
        'count' => 0
    ], JSON_UNESCAPED_UNICODE);
}
?>