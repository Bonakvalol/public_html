<?php
require_once dirname(__DIR__) . '/config.php';

if (!$auth->isLoggedIn()) {
    header('Location: ' . BASE_URL . '/index.html');
    exit;
}

$userId = $auth->getUserId();

$stmt = $pdo->prepare("
    SELECT id, username, email, phone, created_at
    FROM users
    WHERE id = ?
");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    session_destroy();
    header('Location: ' . BASE_URL . '/index.html');
    exit;
}

$stmt = $pdo->prepare("
    SELECT order_number, total_amount, status, created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$userId]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("
    SELECT 
        COUNT(*) as total_orders, 
        COALESCE(SUM(total_amount), 0) as total_spent 
    FROM orders 
    WHERE user_id = ?
");
$stmt->execute([$userId]);
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

function getInitials($username) {
    if (empty($username)) return '?';
    $words = explode(' ', trim($username));
    $initials = '';
    foreach ($words as $word) {
        if (!empty($word) && strlen($initials) < 2) {
            $initials .= mb_strtoupper(mb_substr($word, 0, 1));
        }
    }
    return $initials ?: '?';
}

function getStatusText($status) {
    $statuses = [
        'new' => 'Новый',
        'confirmed' => 'Подтвержден',
        'in_progress' => 'В работе',
        'delivered' => 'Доставлен',
        'cancelled' => 'Отменен'
    ];
    return $statuses[$status] ?? $status;
}
?>
