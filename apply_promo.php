<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Убрал ../ так как файлы в одной папке
require_once 'config.php';

if (!$auth->isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$promoCode = isset($input['promo_code']) ? trim($input['promo_code']) : '';

if (empty($promoCode)) {
    echo json_encode(['success' => false, 'message' => 'Введите промокод']);
    exit;
}

try {
    $stmt = $pdo->prepare("
    UPDATE wheel_prizes 
    SET used = 1, used_at = NOW() 
    WHERE promo_code = ? AND user_id = ? AND used = 0
");
    $stmt->execute([$promoCode, $_SESSION['user_id']]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Промокод успешно применён'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Промокод не найден или уже использован'
        ]);
    }
} catch(PDOException $e) {
    error_log("Apply promo error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка применения промокода']);
}
?>