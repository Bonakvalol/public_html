<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require_once __DIR__ . '/../config.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("
    SELECT id, username, email, phone, created_at 
    FROM users 
    WHERE id = ?
");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo "Пользователь не найден.";
    exit();
}

$stmt = $pdo->prepare("
    SELECT id, order_number, total_amount, status, created_at 
    FROM orders 
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$user_id]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Для каждого заказа проверяем наличие отзыва
foreach ($orders as &$order) {
    $stmt_review = $pdo->prepare("SELECT id, rating, comment, status FROM reviews WHERE order_number = ? AND user_id = ?");
    $stmt_review->execute([$order['order_number'], $user_id]);
    $order['review'] = $stmt_review->fetch(PDO::FETCH_ASSOC);
}

// Функции
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

// ========== НОВАЯ ЛОГИКА ПОДСЧЁТА ==========
// Считаем подтвержденные (confirmed), в работе (in_progress) и доставленные (delivered) заказы
$total_spent = 0;
$completed_orders_count = 0;

foreach ($orders as $order) {
    $status = $order['status'];
    // Учитываем confirmed, in_progress и delivered
    if ($status == 'confirmed' || $status == 'in_progress' || $status == 'delivered') {
        $amount = isset($order['total_amount']) ? floatval($order['total_amount']) : 0;
        $total_spent += $amount;
        $completed_orders_count++;
    }
}
// ==========================================

$initials = getInitials($user['username']);

$success_message = '';
$error_message = '';

if (isset($_GET['success'])) {
    if ($_GET['success'] == 'profile') {
        $success_message = 'Профиль успешно обновлен!';
    } elseif ($_GET['success'] == 'password') {
        $success_message = 'Пароль успешно изменен!';
    } elseif ($_GET['success'] == 'review') {
        $success_message = 'Спасибо за ваш отзыв!';
    }
}

if (isset($_GET['error'])) {
    if ($_GET['error'] == 'old_password') {
        $error_message = 'Неверный текущий пароль!';
    } elseif ($_GET['error'] == 'password_match') {
        $error_message = 'Новые пароли не совпадают!';
    } elseif ($_GET['error'] == 'empty') {
        $error_message = 'Заполните все поля!';
    } elseif ($_GET['error'] == 'db') {
        $error_message = 'Ошибка базы данных!';
    } elseif ($_GET['error'] == 'email_exists') {
        $error_message = 'Email уже используется!';
    } elseif ($_GET['error'] == 'review') {
        $error_message = 'Ошибка при сохранении отзыва';
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/128/2560/2560789.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль пользователя - Цветочный шарм</title>
    <link rel="stylesheet" href="user_style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Шапка профиля -->
    <div class="user_profile-header">
        <div class="user_container">
            <a href="../index.html" class="user_back-to-shop">
                <i class="fas fa-arrow-left"></i> Назад в магазин
            </a>
            <h1>Мой профиль</h1>
        </div>
    </div>

    <!-- Основное содержимое -->
    <div class="user_container">
        <!-- Сообщения об успехе/ошибке -->
        <?php if (!empty($success_message)): ?>
        <div class="user_alert user_alert-success">
            <i class="fas fa-check-circle"></i>
            <?php echo $success_message; ?>
        </div>
        <?php endif; ?>
        
        <?php if (!empty($error_message)): ?>
        <div class="user_alert user_alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <?php echo $error_message; ?>
        </div>
        <?php endif; ?>
        
        <div class="user_profile-container">
            <!-- Левая колонка -->
            <div class="user_profile-sidebar">
                <!-- Карточка профиля -->
                <div class="user_profile-card">
                    <div class="user_profile-avatar">
                        <?php echo $initials; ?>
                    </div>
                    <h2 class="user_profile-name">
                        <?php echo htmlspecialchars($user['username']); ?>
                    </h2>
                    <div class="user_profile-role">
                        <span class="user_role-badge user_role-user">
                            Пользователь
                        </span>
                    </div>
                    
                    <div class="user_profile-stats">
                        <div class="user_stat-item">
                            <div class="user_stat-number">
                                <?php echo $completed_orders_count; ?>
                            </div>
                            <div class="user_stat-label">Заказов</div>
                        </div>
                        <div class="user_stat-item">
                            <div class="user_stat-number">
                                <?php echo number_format($total_spent, 0, '', ' '); ?> ₽
                            </div>
                            <div class="user_stat-label">Всего потрачено</div>
                        </div>
                    </div>
                </div>

                <!-- Информация -->
                <div class="user_info-card">
                    <h3><i class="fas fa-info-circle"></i> Информация</h3>
                    <div class="user_info-list">
                        <div class="user_info-item">
                            <span class="user_info-label">ID:</span>
                            <span class="user_info-value"><?php echo htmlspecialchars($user['id']); ?></span>
                        </div>
                        <div class="user_info-item">
                            <span class="user_info-label">Email:</span>
                            <span class="user_info-value"><?php echo htmlspecialchars($user['email']); ?></span>
                        </div>
                        <div class="user_info-item">
                            <span class="user_info-label">Телефон:</span>
                            <span class="user_info-value"><?php echo htmlspecialchars(isset($user['phone']) && $user['phone'] ? $user['phone'] : 'Не указан'); ?></span>
                        </div>
                        <div class="user_info-item">
                            <span class="user_info-label">Дата регистрации:</span>
                            <span class="user_info-value"><?php echo date('d.m.Y', strtotime($user['created_at'])); ?></span>
                        </div>
                    </div>
                </div>

                <!-- Действия -->
                <div class="user_actions-card">
                    <h3><i class="fas fa-cog"></i> Действия</h3>
                    <div class="user_actions-list">
                        <a href="#" class="user_action-btn" onclick="openEditModal(); return false;">
                            <i class="fas fa-edit"></i> Редактировать профиль
                        </a>
                        <a href="#" class="user_action-btn" onclick="openPasswordModal(); return false;">
                            <i class="fas fa-key"></i> Сменить пароль
                        </a>
                        <a href="../logout.php" class="user_action-btn user_logout-btn" onclick="return confirm('Вы уверены, что хотите выйти?');">
                            <i class="fas fa-sign-out-alt"></i> Выйти
                        </a>
                    </div>
                </div>
            </div>

            <!-- Правая колонка -->
            <div class="user_profile-content">
                <!-- История заказов -->
                <div class="user_orders-section">
                    <div class="user_section-header">
                        <h2><i class="fas fa-shopping-bag"></i> История заказов</h2>
                    </div>
                    
                    <div class="user_orders-list">
                        <?php if (!empty($orders)): ?>
                            <?php foreach ($orders as $order): ?>
                            <div class="user_order-card">
                                <div class="user_order-header">
                                    <div>
                                        <h3>Заказ #<?php echo htmlspecialchars($order['order_number']); ?></h3>
                                        <p class="user_order-date">
                                            <i class="far fa-calendar"></i>
                                            <?php echo date('d.m.Y H:i', strtotime($order['created_at'])); ?>
                                        </p>
                                    </div>
                                    <div class="user_order-status user_status-<?php echo htmlspecialchars($order['status']); ?>">
                                        <?php echo htmlspecialchars(getStatusText($order['status'])); ?>
                                    </div>
                                </div>
                                
                                <div class="user_order-details">
                                    <div class="user_detail-item">
                                        <span class="user_detail-label">Сумма:</span>
                                        <span class="user_detail-value"><?php echo number_format($order['total_amount'], 0, '', ' '); ?> ₽</span>
                                    </div>
                                </div>
                                
                                <!-- Кнопка отзыва -->
                                <div class="user_order-review">
                                    <?php if (isset($order['review']) && $order['review']): ?>
                                        <button class="user_review-btn user_review-view" 
                                                onclick="viewReview('<?php echo htmlspecialchars($order['order_number']); ?>', <?php echo $order['review']['rating']; ?>, '<?php echo addslashes($order['review']['comment']); ?>')">
                                            <i class="fas fa-star"></i> Посмотреть отзыв
                                        </button>
                                    <?php else: ?>
                                        <button class="user_review-btn" 
                                                onclick="openReviewModal('<?php echo htmlspecialchars($order['order_number']); ?>')">
                                            <i class="fas fa-pen"></i> Оставить отзыв
                                        </button>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                        <div class="user_empty-state">
                            <i class="fas fa-shopping-bag fa-3x"></i>
                            <h3>Заказов пока нет</h3>
                            <p>Сделайте свой первый заказ!</p>
                            <a href="../index.html#catalog" class="user_cta-button">Перейти в каталог</a>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Подвал -->
    <footer class="user_footer">
        <div class="user_container">
            <div class="user_footer-bottom">
                <div class="user_footer-copyright">
                    <p>&copy; 2025. Интернет-магазин Цветочный шарм</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Модальное окно редактирования профиля -->
    <div id="editProfileModal" class="user_modal">
        <div class="user_modal-content">
            <div class="user_modal-header">
                <h3><i class="fas fa-edit"></i> Редактирование профиля</h3>
                <span class="user_modal-close" onclick="closeEditModal()">&times;</span>
            </div>
            <form action="api/update_profile.php" method="POST">
                <div class="user_modal-body">
                    <div class="user_form-group">
                        <label><i class="fas fa-user"></i> Имя пользователя:</label>
                        <input type="text" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" required>
                    </div>
                    <div class="user_form-group">
                        <label><i class="fas fa-envelope"></i> Email:</label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
                    </div>
                    <div class="user_form-group">
                        <label><i class="fas fa-phone"></i> Телефон:</label>
                        <input type="text" name="phone" value="<?php echo htmlspecialchars(isset($user['phone']) ? $user['phone'] : ''); ?>" placeholder="+7 (999) 999-99-99">
                    </div>
                </div>
                <div class="user_modal-footer">
                    <button type="button" class="user_btn-cancel" onclick="closeEditModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                    <button type="submit" class="user_btn-save">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Модальное окно смены пароля -->
    <div id="changePasswordModal" class="user_modal">
        <div class="user_modal-content">
            <div class="user_modal-header">
                <h3><i class="fas fa-key"></i> Смена пароля</h3>
                <span class="user_modal-close" onclick="closePasswordModal()">&times;</span>
            </div>
            <form action="api/change_password.php" method="POST" onsubmit="return validatePasswordForm()">
                <div class="user_modal-body">
                    <div class="user_form-group">
                        <label><i class="fas fa-lock"></i> Текущий пароль:</label>
                        <input type="password" name="old_password" id="old_password" required>
                    </div>
                    <div class="user_form-group">
                        <label><i class="fas fa-key"></i> Новый пароль:</label>
                        <input type="password" name="new_password" id="new_password" required>
                    </div>
                    <div class="user_form-group">
                        <label><i class="fas fa-check-circle"></i> Подтверждение пароля:</label>
                        <input type="password" name="confirm_password" id="confirm_password" required>
                    </div>
                    <div class="user_password-requirements" id="passwordRequirements">
                        <p><i class="fas fa-info-circle"></i> Требования к паролю:</p>
                        <p id="lengthCheck"><i class="fas fa-times"></i> Минимум 6 символов</p>
                        <p id="matchCheck"><i class="fas fa-times"></i> Пароли совпадают</p>
                    </div>
                </div>
                <div class="user_modal-footer">
                    <button type="button" class="user_btn-cancel" onclick="closePasswordModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                    <button type="submit" class="user_btn-save" id="submitPasswordBtn">
                        <i class="fas fa-save"></i> Сменить пароль
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Модальное окно для отзыва -->
    <div id="reviewModal" class="user_modal">
        <div class="user_modal-content" style="max-width: 550px;">
            <div class="user_modal-header">
                <h3><i class="fas fa-star"></i> Оставить отзыв</h3>
                <span class="user_modal-close" onclick="closeReviewModal()">&times;</span>
            </div>
            <form id="reviewForm" onsubmit="submitReview(event)">
                <div class="user_modal-body">
                    <p style="margin-bottom: 15px; color: #666;">
                        Заказ #<span id="reviewOrderNumber"></span>
                    </p>
                    
                    <div class="user_form-group">
                        <label><i class="fas fa-star"></i> Ваша оценка:</label>
                        <div class="user_rating-stars" id="ratingStars">
                            <i class="far fa-star" data-rating="1"></i>
                            <i class="far fa-star" data-rating="2"></i>
                            <i class="far fa-star" data-rating="3"></i>
                            <i class="far fa-star" data-rating="4"></i>
                            <i class="far fa-star" data-rating="5"></i>
                        </div>
                        <input type="hidden" id="reviewRating" name="rating" value="0">
                    </div>
                    
                    <div class="user_form-group">
                        <label><i class="fas fa-comment"></i> Ваш отзыв:</label>
                        <textarea id="reviewComment" name="comment" rows="5" placeholder="Расскажите о своих впечатлениях..." style="width: 100%; padding: 12px; border: 2px solid #e8ecef; border-radius: 10px; font-family: 'Inter', sans-serif; resize: vertical;"></textarea>
                        <small style="color: #666; display: block; margin-top: 5px;">Минимум 10 символов</small>
                    </div>
                </div>
                <div class="user_modal-footer">
                    <button type="button" class="user_btn-cancel" onclick="closeReviewModal()">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                    <button type="submit" class="user_btn-save" id="submitReviewBtn">
                        <i class="fas fa-paper-plane"></i> Отправить отзыв
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Модальное окно для просмотра отзыва -->
    <div id="viewReviewModal" class="user_modal">
        <div class="user_modal-content" style="max-width: 550px;">
            <div class="user_modal-header">
                <h3><i class="fas fa-star"></i> Ваш отзыв</h3>
                <span class="user_modal-close" onclick="closeViewReviewModal()">&times;</span>
            </div>
            <div class="user_modal-body">
                <p style="margin-bottom: 15px; color: #666;">
                    Заказ #<span id="viewOrderNumber"></span>
                </p>
                <div class="user_form-group">
                    <label><i class="fas fa-star"></i> Оценка:</label>
                    <div class="user_rating-stars view-mode" id="viewRatingStars"></div>
                </div>
                <div class="user_form-group">
                    <label><i class="fas fa-comment"></i> Отзыв:</label>
                    <div id="viewComment" style="background: #f8f9fa; padding: 15px; border-radius: 10px; line-height: 1.5; color: #333;"></div>
                </div>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #999;">
                    <i class="fas fa-info-circle"></i> Отзыв будет опубликован после модерации
                </p>
            </div>
            <div class="user_modal-footer">
                <button type="button" class="user_btn-cancel" onclick="closeViewReviewModal()">
                    <i class="fas fa-times"></i> Закрыть
                </button>
                <button type="button" class="user_btn-save" onclick="openEditReviewFromView()">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
            </div>
        </div>
    </div>

    <script>
        function openEditModal() {
            document.getElementById('editProfileModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        function closeEditModal() {
            document.getElementById('editProfileModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function openPasswordModal() {
            document.getElementById('changePasswordModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.getElementById('old_password').value = '';
            document.getElementById('new_password').value = '';
            document.getElementById('confirm_password').value = '';
            resetPasswordChecks();
        }
        
        function closePasswordModal() {
            document.getElementById('changePasswordModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function validatePasswordForm() {
            var old_pass = document.getElementById('old_password').value;
            var new_pass = document.getElementById('new_password').value;
            var confirm_pass = document.getElementById('confirm_password').value;
            
            if (old_pass == '' || new_pass == '' || confirm_pass == '') {
                alert('Пожалуйста, заполните все поля!');
                return false;
            }
            
            if (new_pass.length < 6) {
                alert('Новый пароль должен содержать минимум 6 символов!');
                return false;
            }
            
            if (new_pass != confirm_pass) {
                alert('Новые пароли не совпадают!');
                return false;
            }
            
            return true;
        }
        
        function checkPasswordStrength() {
            var new_pass = document.getElementById('new_password').value;
            var confirm_pass = document.getElementById('confirm_password').value;
            
            var lengthCheck = document.getElementById('lengthCheck');
            if (new_pass.length >= 6) {
                lengthCheck.innerHTML = '<i class="fas fa-check"></i> Минимум 6 символов';
                lengthCheck.className = 'user_requirement-valid';
            } else {
                lengthCheck.innerHTML = '<i class="fas fa-times"></i> Минимум 6 символов';
                lengthCheck.className = 'user_requirement-invalid';
            }
            
            var matchCheck = document.getElementById('matchCheck');
            if (new_pass != '' && confirm_pass != '' && new_pass === confirm_pass) {
                matchCheck.innerHTML = '<i class="fas fa-check"></i> Пароли совпадают';
                matchCheck.className = 'user_requirement-valid';
            } else {
                matchCheck.innerHTML = '<i class="fas fa-times"></i> Пароли совпадают';
                matchCheck.className = 'user_requirement-invalid';
            }
        }
        
        function resetPasswordChecks() {
            var lengthCheck = document.getElementById('lengthCheck');
            lengthCheck.innerHTML = '<i class="fas fa-times"></i> Минимум 6 символов';
            lengthCheck.className = 'user_requirement-invalid';
            
            var matchCheck = document.getElementById('matchCheck');
            matchCheck.innerHTML = '<i class="fas fa-times"></i> Пароли совпадают';
            matchCheck.className = 'user_requirement-invalid';
        }
        
        // Переменные для отзывов
        let currentOrderNumber = null;
        let currentReviewRating = 0;
        let currentReviewComment = '';
        
        // Инициализация звезд рейтинга
        function initRatingStars() {
            const stars = document.querySelectorAll('#ratingStars i');
            const ratingInput = document.getElementById('reviewRating');
            
            stars.forEach(star => {
                star.addEventListener('mouseenter', function() {
                    const rating = parseInt(this.dataset.rating);
                    stars.forEach(s => {
                        if (parseInt(s.dataset.rating) <= rating) {
                            s.classList.add('hover');
                        } else {
                            s.classList.remove('hover');
                        }
                    });
                });
                
                star.addEventListener('mouseleave', function() {
                    stars.forEach(s => s.classList.remove('hover'));
                    const currentRating = parseInt(ratingInput.value);
                    stars.forEach(s => {
                        if (parseInt(s.dataset.rating) <= currentRating) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
                
                star.addEventListener('click', function() {
                    const rating = parseInt(this.dataset.rating);
                    ratingInput.value = rating;
                    stars.forEach(s => {
                        if (parseInt(s.dataset.rating) <= rating) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
            });
        }
        
        // Открыть модальное окно для нового отзыва
        function openReviewModal(orderNumber) {
            currentOrderNumber = orderNumber;
            document.getElementById('reviewOrderNumber').textContent = orderNumber;
            document.getElementById('reviewRating').value = 0;
            document.getElementById('reviewComment').value = '';
            
            const stars = document.querySelectorAll('#ratingStars i');
            stars.forEach(s => s.classList.remove('active', 'hover'));
            
            document.getElementById('reviewModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        // Открыть модальное окно для просмотра отзыва
        function viewReview(orderNumber, rating, comment) {
            currentOrderNumber = orderNumber;
            currentReviewRating = rating;
            currentReviewComment = comment;
            
            document.getElementById('viewOrderNumber').textContent = orderNumber;
            document.getElementById('viewComment').textContent = comment;
            
            const viewStars = document.getElementById('viewRatingStars');
            viewStars.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = i <= rating ? 'fas fa-star active' : 'far fa-star';
                viewStars.appendChild(star);
            }
            
            document.getElementById('viewReviewModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        function closeReviewModal() {
            document.getElementById('reviewModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function closeViewReviewModal() {
            document.getElementById('viewReviewModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function openEditReviewFromView() {
            closeViewReviewModal();
            openReviewModal(currentOrderNumber);
            document.getElementById('reviewRating').value = currentReviewRating;
            document.getElementById('reviewComment').value = currentReviewComment;
            
            const stars = document.querySelectorAll('#ratingStars i');
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= currentReviewRating) {
                    s.classList.add('active');
                }
            });
        }
        
        // Отправка отзыва
        async function submitReview(event) {
            event.preventDefault();
            
            const rating = parseInt(document.getElementById('reviewRating').value);
            const comment = document.getElementById('reviewComment').value.trim();
            
            if (rating === 0) {
                alert('Пожалуйста, поставьте оценку');
                return;
            }
            
            if (comment.length < 10) {
                alert('Отзыв должен содержать минимум 10 символов');
                return;
            }
            
            const submitBtn = document.getElementById('submitReviewBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('api/save_review.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        order_number: currentOrderNumber,
                        rating: rating,
                        comment: comment
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert(result.message);
                    closeReviewModal();
                    location.reload();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ошибка при отправке отзыва');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            var newPass = document.getElementById('new_password');
            var confirmPass = document.getElementById('confirm_password');
            
            if (newPass) {
                newPass.addEventListener('keyup', checkPasswordStrength);
            }
            if (confirmPass) {
                confirmPass.addEventListener('keyup', checkPasswordStrength);
            }
            
            initRatingStars();
        });
        
        window.onclick = function(event) {
            var editModal = document.getElementById('editProfileModal');
            var passModal = document.getElementById('changePasswordModal');
            var reviewModal = document.getElementById('reviewModal');
            var viewReviewModal = document.getElementById('viewReviewModal');
            
            if (event.target == editModal) closeEditModal();
            if (event.target == passModal) closePasswordModal();
            if (event.target == reviewModal) closeReviewModal();
            if (event.target == viewReviewModal) closeViewReviewModal();
        }
        
        setTimeout(function() {
            var alerts = document.querySelectorAll('.user_alert');
            for (var i = 0; i < alerts.length; i++) {
                alerts[i].style.transition = 'opacity 0.5s';
                alerts[i].style.opacity = '0';
                setTimeout(function(alert) {
                    alert.style.display = 'none';
                }, 500, alerts[i]);
            }
        }, 5000);
    </script>
</body>
</html>