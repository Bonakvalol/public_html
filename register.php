<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $raw_input = file_get_contents('php://input');
    $input = json_decode($raw_input, true);
    
    if (!$input || !isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
        echo json_encode(array('success' => false, 'message' => 'Все обязательные поля должны быть заполнены'));
        exit;
    }
    
    $username = trim($input['username']);
    $email = trim($input['email']);
    $password = trim($input['password']);
    $phone = isset($input['phone']) ? trim($input['phone']) : null;
    
    if (strlen($password) < 6) {
        echo json_encode(array('success' => false, 'message' => 'Пароль должен быть не менее 6 символов'));
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(array('success' => false, 'message' => 'Некорректный email адрес'));
        exit;
    }
    
    $result = $auth->register($username, $email, $password, $phone);
    
    if ($result['success']) {
        $user = $auth->getUser();
        $result['user'] = $user;
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    
} else {
    echo json_encode(array('success' => false, 'message' => 'Метод не разрешен'));
}
?>