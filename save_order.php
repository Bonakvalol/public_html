<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(array('success' => false, 'message' => 'Нет данных'));
    exit;
}

try {
    $pdo->beginTransaction();
    
    $user = $auth->getUser();
    $user_id = $user['id'];
    
    // Получаем промокод из запроса
    $promoCode = isset($input['promo_code']) ? trim($input['promo_code']) : '';
    $discountPercent = isset($input['discount']) ? (int)$input['discount'] : 0;
    $appliedPromoId = null;
    
    // ПРОВЕРЯЕМ И ОТМЕЧАЕМ ПРОМОКОД КАК ИСПОЛЬЗОВАННЫЙ
    if (!empty($promoCode)) {
        // Ищем НЕ использованный промокод
        $stmt = $pdo->prepare("
            SELECT id, discount FROM wheel_prizes 
            WHERE promo_code = ? AND user_id = ? AND used = 0
        ");
        $stmt->execute([$promoCode, $user_id]);
        $promo = $stmt->fetch();
        
        if ($promo) {
            $appliedPromoId = $promo['id'];
            $discountPercent = (int)$promo['discount'];
            
            // ОТМЕЧАЕМ КАК ИСПОЛЬЗОВАННЫЙ
            $stmt = $pdo->prepare("UPDATE wheel_prizes SET used = 1, used_at = NOW() WHERE id = ?");
            $result = $stmt->execute([$appliedPromoId]);
            
            // Логируем для отладки
            error_log("Промокод {$promoCode} обновлен. used=1, affected rows: " . $stmt->rowCount());
        } else {
            error_log("Промокод {$promoCode} не найден или уже использован для user_id={$user_id}");
        }
    }
    
    $order_number = 'FC-' . date('Ymd') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
    
    $delivery_address = '';
    if ($input['delivery']['type'] === 'delivery') {
        $address_parts = array();
        if (!empty($input['delivery']['address'])) $address_parts[] = $input['delivery']['address'];
        if (!empty($input['delivery']['apartment'])) $address_parts[] = 'кв.' . $input['delivery']['apartment'];
        if (!empty($input['delivery']['entrance'])) $address_parts[] = 'под.' . $input['delivery']['entrance'];
        if (!empty($input['delivery']['floor'])) $address_parts[] = 'эт.' . $input['delivery']['floor'];
        $delivery_address = implode(', ', $address_parts);
    } else {
        $store_names = array(
            'merzlyakovsky-8' => 'Мерзляковский переулок, 8с5',
            'merzlyakovsky-22' => 'Мерзляковский переулок, 22'
        );
        $store_name = isset($store_names[$input['delivery']['store']]) ? $store_names[$input['delivery']['store']] : $input['delivery']['store'];
        $delivery_address = 'Самовывоз: ' . $store_name;
    }
    
    // Добавляем информацию о промокоде в order_data
    $order_data_json = json_encode(array(
        'items' => $input['items'],
        'receiver' => isset($input['receiver']) ? $input['receiver'] : null,
        'sender' => $input['sender'],
        'card_text' => isset($input['card_text']) ? $input['card_text'] : '',
        'comment' => isset($input['comment']) ? $input['comment'] : '',
        'promo_code' => $promoCode ?: null,
        'discount_percent' => $discountPercent ?: null,
        'promo_applied' => ($appliedPromoId !== null)
    ), JSON_UNESCAPED_UNICODE);
    
    $sql = "INSERT INTO `orders` (
        `user_id`, `order_number`, `order_data`, `total_amount`, `status`, 
        `delivery_type`, `delivery_address`, `customer_name`, `customer_phone`, `customer_email`,
        `delivery_date`, `delivery_time`, `card_message`, `comments`, `created_at`, `updated_at`
    ) VALUES (
        :user_id, :order_number, :order_data, :total_amount, 'new',
        :delivery_type, :delivery_address, :customer_name, :customer_phone, :customer_email,
        :delivery_date, :delivery_time, :card_message, :comments, NOW(), NOW()
    )";
    
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute(array(
        ':user_id' => $user_id,
        ':order_number' => $order_number,
        ':order_data' => $order_data_json,
        ':total_amount' => $input['total_amount'],
        ':delivery_type' => $input['delivery']['type'],
        ':delivery_address' => $delivery_address,
        ':customer_name' => $input['sender']['name'],
        ':customer_phone' => $input['sender']['phone'],
        ':customer_email' => isset($input['sender']['email']) ? $input['sender']['email'] : '',
        ':delivery_date' => $input['delivery']['date'],
        ':delivery_time' => $input['delivery']['time'],
        ':card_message' => isset($input['card_text']) ? $input['card_text'] : '',
        ':comments' => isset($input['comment']) ? $input['comment'] : ''
    ));
    
    $order_id = $pdo->lastInsertId();
    
    $pdo->commit();
    
    $response = array(
        'success' => true,
        'message' => 'Заказ успешно оформлен!',
        'order_id' => $order_id,
        'order_number' => $order_number,
        'total_amount' => $input['total_amount']
    );
    
    if ($appliedPromoId) {
        $response['promo_applied'] = true;
        $response['discount_percent'] = $discountPercent;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Order save error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => 'Ошибка сохранения заказа: ' . $e->getMessage()));
}
?>