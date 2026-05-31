<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../config.php';

if (!$auth->isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['prize']) || !isset($input['promo_code'])) {
    echo json_encode(['success' => false, 'message' => 'Неверные данные']);
    exit;
}

$userId = $_SESSION['user_id'];
$prize = $input['prize'];
$prizeName = $input['prize_name'] ?? "Скидка {$prize}%";
$promoCode = $input['promo_code'];
$discount = (int)$prize;

try {
    // Проверяем, не использовал ли пользователь уже промокод на этой неделе
    $weekKey = date('Y-W');
    $stmt = $pdo->prepare("SELECT id FROM wheel_prizes WHERE user_id = ? AND week_key = ?");
    $stmt->execute([$userId, $weekKey]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Вы уже получали промокод на этой неделе']);
        exit;
    }
    
    // Сохраняем промокод
    $stmt = $pdo->prepare("
        INSERT INTO wheel_prizes (user_id, prize, prize_name, promo_code, discount, week_key, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$userId, $prize, $prizeName, $promoCode, $discount, $weekKey]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Промокод сохранен',
        'promo_code' => $promoCode
    ]);
    
} catch(PDOException $e) {
    error_log("Wheel prize save error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка сохранения промокода']);
}
?>