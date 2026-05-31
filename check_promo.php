<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Очищаем буфер
while (ob_get_level()) ob_end_clean();

// ПОДКЛЮЧАЕМ config.php (без ../, так как файлы в одной папке)
require_once 'config.php';

function sendResponse($valid, $message, $discount = 0) {
    echo json_encode(['valid' => $valid, 'discount' => $discount, 'message' => $message]);
    exit;
}

// Проверяем авторизацию
if (!isset($auth) || !$auth->isLoggedIn()) {
    sendResponse(false, 'Требуется авторизация');
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Метод не поддерживается');
}

// Получаем данные
$input = json_decode(file_get_contents('php://input'), true);
$promoCode = isset($input['promo_code']) ? trim($input['promo_code']) : '';

if (empty($promoCode)) {
    sendResponse(false, 'Введите промокод');
}

try {
    // Проверяем соединение с БД
    if (!isset($pdo) || !$pdo) {
        sendResponse(false, 'Ошибка подключения к базе данных');
    }
    
    // Ищем активный промокод
    $stmt = $pdo->prepare("SELECT * FROM wheel_prizes WHERE promo_code = ? AND user_id = ? AND used = 0");
    $stmt->execute([$promoCode, $_SESSION['user_id']]);
    $promo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($promo) {
        sendResponse(true, "Промокод активирован! Скидка {$promo['discount']}%", (int)$promo['discount']);
    } else {
        // Проверяем, может быть уже использован
        $stmt = $pdo->prepare("SELECT used FROM wheel_prizes WHERE promo_code = ? AND user_id = ?");
        $stmt->execute([$promoCode, $_SESSION['user_id']]);
        $usedPromo = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($usedPromo && $usedPromo['used'] == 1) {
            sendResponse(false, 'Промокод уже использован');
        } else {
            sendResponse(false, 'Промокод не найден');
        }
    }
} catch (PDOException $e) {
    error_log("Promo error: " . $e->getMessage());
    sendResponse(false, 'Ошибка проверки промокода');
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    sendResponse(false, 'Внутренняя ошибка сервера');
}
?>