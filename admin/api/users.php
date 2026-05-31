<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'p92675cc_auth';
$username = 'p92675cc_auth';
$password = 'Zefirax123@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    $stmt = $pdo->query("SELECT id, username, email, role, phone, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    
    $result = [];
    foreach ($users as $user) {
        $result[] = [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'] ?: 'user',
            'phone' => $user['phone'] ?: '',
            'created_at' => $user['created_at'],
            'created_at_formatted' => date('d.m.Y H:i', strtotime($user['created_at']))
        ];
    }
    
    echo json_encode([
        'success' => true,
        'users' => $result,
        'count' => count($result)
    ], JSON_UNESCAPED_UNICODE);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'users' => [],
        'count' => 0
    ], JSON_UNESCAPED_UNICODE);
}
?>