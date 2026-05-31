<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../config.php';

if (!$auth->isLoggedIn()) {
    echo json_encode(['hasSpun' => false]);
    exit;
}

$userId = $_SESSION['user_id'];
$weekKey = date('Y-W');

try {
    $stmt = $pdo->prepare("SELECT id FROM wheel_prizes WHERE user_id = ? AND week_key = ?");
    $stmt->execute([$userId, $weekKey]);
    $hasSpun = $stmt->fetch() ? true : false;
    
    echo json_encode(['hasSpun' => $hasSpun]);
} catch(PDOException $e) {
    echo json_encode(['hasSpun' => false]);
}
?>