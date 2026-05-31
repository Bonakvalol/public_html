<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'p92675cc_auth';
$username = 'p92675cc_auth';
$password = 'Zefirax123@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к БД']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['userId']) || !isset($data['role'])) {
        echo json_encode(['success' => false, 'message' => 'Неверные данные']);
        exit;
    }
    
    $userId = (int)$data['userId'];
    $role = trim($data['role']);
    
    $validRoles = ['user', 'admin'];
    if (!in_array($role, $validRoles)) {
        echo json_encode(['success' => false, 'message' => 'Неверная роль']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
        $stmt->execute([$role, $userId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Роль обновлена',
            'userId' => $userId,
            'role' => $role
        ], JSON_UNESCAPED_UNICODE);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Ошибка обновления: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается']);
}
?>