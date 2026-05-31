<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['action'])) {
        switch ($input['action']) {
            case 'register':
                if (!isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
                    echo json_encode(array('success' => false, 'message' => 'Все поля обязательны'));
                    exit;
                }
                
                $phone = isset($input['phone']) ? $input['phone'] : null;
                $result = $auth->register($input['username'], $input['email'], $input['password'], $phone);
                
                if ($result['success']) {
                    $user = $auth->getUser();
                    $result['user'] = $user;
                }
                
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                break;
                
            case 'login':
                if (!isset($input['email']) || !isset($input['password'])) {
                    echo json_encode(array('success' => false, 'message' => 'Все поля обязательны'));
                    exit;
                }
                $result = $auth->login($input['email'], $input['password']);
                
                if ($result['success']) {
                    $user = $auth->getUser();
                    $result['user'] = $user;
                }
                
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                break;
                
            case 'logout':
                $result = $auth->logout();
                echo json_encode($result, JSON_UNESCAPED_UNICODE);
                break;
                
            case 'check':
                echo json_encode(array(
                    'loggedIn' => $auth->isLoggedIn(),
                    'user' => $auth->getUser()
                ), JSON_UNESCAPED_UNICODE);
                break;
                
            default:
                echo json_encode(array('success' => false, 'message' => 'Неизвестное действие'));
        }
    }
    exit;
}
?>