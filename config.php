<?php
// Включаем сессию только если она не активна
if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.cookie_lifetime', 86400);
    ini_set('session.gc_maxlifetime', 86400);
    ini_set('session.cookie_samesite', 'Lax');
    session_set_cookie_params(86400, '/', $_SERVER['HTTP_HOST'], false, true);
    session_start();
}
// ВНИМАНИЕ: Рабочие параметры подключения удалены для защиты данных.
// Демонстрация работы сайта производится с устройства владельца.

$host = 'localhost';
$dbname = '';           // пусто — подключения не будет
$username = '';         // пусто — подключения не будет
$password = '';         // пусто — подключения не будет

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    // НЕ выводим JSON здесь, просто логируем ошибку
    die('Database connection error');
}

class Auth {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function register($username, $email, $password, $phone = null) {
    try {
        // Проверка: если телефон не передан, null или пустая строка
        if (empty($phone)) {
            return array('success' => false, 'message' => 'Пожалуйста, введите номер телефона');
        }
        
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute(array($email));
        if ($stmt->fetch()) {
            return array('success' => false, 'message' => 'Email уже используется');
        }
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $this->pdo->prepare("
            INSERT INTO users (username, email, password, role, phone, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        if ($stmt->execute(array($username, $email, $hashedPassword, 'user', $phone))) {
            $userId = $this->pdo->lastInsertId();
            
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute(array($userId));
            $user = $stmt->fetch();
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = isset($user['role']) ? $user['role'] : 'user';
            $_SESSION['phone'] = $user['phone'];
            
            return array(
                'success' => true,
                'message' => 'Регистрация успешна',
                'user' => array(
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'phone' => $user['phone'],
                    'created_at' => $user['created_at']
                )
            );
        } else {
            return array('success' => false, 'message' => 'Ошибка регистрации');
        }
    } catch(PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        return array('success' => false, 'message' => 'Ошибка базы данных');
    }
}
    
    public function login($email, $password) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute(array($email));
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role'] = isset($user['role']) ? $user['role'] : 'user';
                
                return array(
                    'success' => true,
                    'username' => $user['username'],
                    'role' => isset($user['role']) ? $user['role'] : 'user',
                    'isAdmin' => (isset($user['role']) && $user['role'] === 'admin')
                );
            }
            
            return array('success' => false, 'message' => 'Неверный email или пароль');
        } catch(PDOException $e) {
            error_log("Database error in login: " . $e->getMessage());
            return array('success' => false, 'message' => 'Ошибка базы данных');
        }
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public function isAdmin() {
        return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
    }
    
    public function logout() {
        session_destroy();
        return array('success' => true, 'message' => 'Выход выполнен');
    }
    
    public function getUserId() {
        return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    }
    
    public function getUser() {
        if ($this->isLoggedIn()) {
            return array(
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'email' => $_SESSION['email'],
                'role' => isset($_SESSION['role']) ? $_SESSION['role'] : 'user'
            );
        }
        return null;
    }
}

$auth = new Auth($pdo);
?>