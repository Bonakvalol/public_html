<?php
require_once dirname(__DIR__) . '/../config.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Требуется авторизация']);
    exit;
}

$user_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);

$order_number = isset($input['order_number']) ? trim($input['order_number']) : '';
$rating = isset($input['rating']) ? intval($input['rating']) : 0;
$comment = isset($input['comment']) ? trim($input['comment']) : '';

if (empty($order_number)) {
    echo json_encode(['success' => false, 'message' => 'Номер заказа не указан']);
    exit;
}

if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'message' => 'Оценка должна быть от 1 до 5']);
    exit;
}

if (empty($comment)) {
    echo json_encode(['success' => false, 'message' => 'Введите текст отзыва']);
    exit;
}

if (strlen($comment) < 10) {
    echo json_encode(['success' => false, 'message' => 'Отзыв должен содержать минимум 10 символов']);
    exit;
}

try {
    // Проверяем, существует ли заказ у этого пользователя
    $stmt = $pdo->prepare("SELECT id FROM orders WHERE order_number = ? AND user_id = ?");
    $stmt->execute([$order_number, $user_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Заказ не найден']);
        exit;
    }
    
    // Проверяем, есть ли уже отзыв
    $stmt = $pdo->prepare("SELECT id FROM reviews WHERE order_number = ? AND user_id = ?");
    $stmt->execute([$order_number, $user_id]);
    $existing_review = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_review) {
        // Обновляем отзыв
        $stmt = $pdo->prepare("UPDATE reviews SET rating = ?, comment = ?, created_at = NOW() WHERE order_number = ? AND user_id = ?");
        $stmt->execute([$rating, $comment, $order_number, $user_id]);
        echo json_encode(['success' => true, 'message' => 'Отзыв обновлен! Спасибо!', 'action' => 'updated']);
    } else {
        // Сохраняем новый отзыв
        $stmt = $pdo->prepare("INSERT INTO reviews (user_id, order_number, rating, comment) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $order_number, $rating, $comment]);
        echo json_encode(['success' => true, 'message' => 'Спасибо за ваш отзыв!', 'action' => 'created']);
    }
} catch (PDOException $e) {
    error_log("Save review error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка сохранения отзыва']);
}
?>