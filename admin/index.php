<?php
require_once 'config_admin.php';

if (!$auth->isLoggedIn() || !$auth->isAdmin()) {
    header('Location: ../index.html');
    exit;
}

$user = $auth->getUser();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/128/2560/2560789.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ панель - Цветочный шарм</title>
    <link rel="stylesheet" href="admin_style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="admin-header">
        <div class="admin-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Цветочный шарм Admin</span>
        </div>
        
        <div class="admin-user">
            <span>Вы зашли как <?php echo htmlspecialchars($user['username']); ?></span>
            <button class="logout-btn" onclick="logout()">Выйти</button>
        </div>
    </header>
    
    <div class="admin-container">
        <aside class="admin-sidebar">
            <ul class="sidebar-menu">
                <li><a href="#" onclick="loadSection('dashboard')" class="active">
                    <img src="https://cdn-icons-png.flaticon.com/128/1924/1924311.png" 
                    class="sidebar-icon" 
                    alt="Дашборд"
                    style="width: 20px; height: 20px;">
                    <span>Дашборд</span>
                </a></li>
                <li><a href="#" onclick="loadSection('orders')">
                    <img src="https://cdn-icons-png.flaticon.com/128/10135/10135838.png" 
                    class="sidebar-icon" 
                    alt="Заказы"
                    style="width: 20px; height: 20px;">
                    <span>Заказы</span>
                </a></li>
                <li><a href="#" onclick="loadSection('custom-orders')">
                    <img src="https://cdn-icons-png.flaticon.com/128/17292/17292473.png" 
                    class="sidebar-icon" 
                    alt="Индивидуальные заказы"
                    style="width: 20px; height: 20px;">
                    <span>Индивидуальные заказы</span>
                </a></li>
                <li><a href="#" onclick="loadSection('users')">
                    <img src="https://cdn-icons-png.flaticon.com/128/18900/18900419.png" 
                    class="sidebar-icon" 
                    alt="Пользователи"
                    style="width: 20px; height: 20px;">
                    <span>Пользователи</span>
                </a></li>
                <li><a href="#" onclick="loadSection('reviews')">
                    <img src="https://cdn-icons-png.flaticon.com/128/2560/2560789.png" 
                    class="sidebar-icon" 
                    alt="Отзывы"
                    style="width: 20px; height: 20px;">
                    <span>Отзывы</span>
                </a></li>
            </ul>
        </aside>
        
        <main class="admin-content" id="admin-content">
            <!-- Заглушка для загрузки -->
            <div class="admin-section">
                <h1>Дашборд</h1>
                <p class="section-description">Загружается...</p>
            </div>
        </main>
    </div>

    <script src="admin_script.js"></script>
</body>
</html>