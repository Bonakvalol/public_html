<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode(array('success' => false, 'message' => 'Только POST запросы'));
    exit;
}

require_once 'config.php';

$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(array(
        'success' => false, 
        'message' => 'Неверные данные. Требуется email и пароль.'
    ));
    exit;
}

$email = trim($data['email']);
$password = trim($data['password']);

$result = $auth->login($email, $password);

if ($result['success']) {
    $user = $auth->getUser();
    $result['user'] = $user;
    $result['role'] = isset($user['role']) ? $user['role'] : 'user';
    $result['isAdmin'] = ($result['role'] === 'admin');
}

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>