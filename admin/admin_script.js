document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupNavigation();
    initLogoutButton();
});

function setupNavigation() {
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.sidebar-menu a').forEach(l => {
                l.classList.remove('active');
            });
            
            this.classList.add('active');
            
            let section = 'dashboard';
            const text = this.textContent.trim();
            
            if (text.includes('Заказы') && !text.includes('Индивидуальные')) {
                section = 'orders';
            } else if (text.includes('Индивидуальные')) {
                section = 'custom-orders';
            } else if (text.includes('Пользователи')) {
                section = 'users';
            } else if (text.includes('Отзывы')) {
                section = 'reviews';
            }
            
            loadSection(section);
        });
    });
}

function initLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Вы уверены, что хотите выйти?')) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', '../logout.php', true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                window.location.href = '../index.html';
                            } else {
                                window.location.href = '../index.html';
                            }
                        } catch(e) {
                            window.location.href = '../index.html';
                        }
                    } else {
                        window.location.href = '../index.html';
                    }
                };
                
                xhr.onerror = function() {
                    window.location.href = '../index.html';
                };
                
                xhr.send();
            }
        });
    }
}

function loadSection(section) {
    const content = document.getElementById('admin-content');
    content.innerHTML = '<div class="loading">Загрузка...</div>';
    
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'custom-orders':
            loadCustomOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'reviews':
            loadReviews();
            break;
        default:
            loadDashboard();
    }
}

async function loadDashboard() {
    try {
        const content = document.getElementById('admin-content');
        
        const [ordersData, customData, reviewsData] = await Promise.allSettled([
            fetchJSON('admin_orders.php'),
            fetchJSON('api/custom_orders.php'),
            fetchJSON('reviews.php')
        ]);
        
        let orders = [], customOrders = [], reviews = [];
        
        if (ordersData.status === 'fulfilled' && ordersData.value.success) {
            orders = ordersData.value.orders || [];
        }
        
        if (customData.status === 'fulfilled' && customData.value.success) {
            customOrders = customData.value.orders || [];
        }
        
        if (reviewsData.status === 'fulfilled' && reviewsData.value.success) {
            reviews = reviewsData.value.reviews || [];
        }
        
        const newOrders = orders.filter(o => o.status === 'new').length;
        const newCustom = customOrders.filter(o => o.status === 'new').length;
        const pendingReviews = reviews.filter(r => r.status === 'pending').length;
        const totalIncome = orders
            .filter(o => o.status === 'confirmed' || o.status === 'in_progress' || o.status === 'delivered')
            .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
        
        content.innerHTML = `
            <div class="admin-section">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/1924/1924311.png" 
                         class="header-icon">
                    Дашборд
                </h1>
                <p class="section-description">Обзорная панель управления магазином</p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>
                            <img src="https://cdn-icons-png.flaticon.com/128/10135/10135838.png" 
                                 class="stat-icon">
                            Все заказы
                        </h3>
                        <div class="stat-value">${orders.length}</div>
                        <div class="stat-change ${newOrders > 0 ? 'positive' : ''}">
                            ${newOrders} ${newOrders > 0 ? 'новых!' : 'новых'}
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>
                            <img src="https://cdn-icons-png.flaticon.com/128/17292/17292473.png" 
                                 class="stat-icon">
                            Инд. заявки
                        </h3>
                        <div class="stat-value">${customOrders.length}</div>
                        <div class="stat-change ${newCustom > 0 ? 'positive' : ''}">
                            ${newCustom} ${newCustom > 0 ? 'новых!' : 'новых'}
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>
                            <img src="https://cdn-icons-png.flaticon.com/128/1101/1101624.png" 
                                 class="stat-icon">
                            Общий доход
                        </h3>
                        <div class="stat-value">${totalIncome.toFixed(0)} ₽</div>
                        <div class="stat-change neutral">Общая сумма</div>
                    </div>
                    
                    <div class="stat-card">
                        <h3>
                            <img src="https://cdn-icons-png.flaticon.com/128/2560/2560789.png" 
                                 class="stat-icon">
                            Отзывы
                        </h3>
                        <div class="stat-value">${reviews.length}</div>
                        <div class="stat-change ${pendingReviews > 0 ? 'positive' : ''}">
                            ${pendingReviews} ${pendingReviews > 0 ? 'на модерации!' : 'на модерации'}
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-actions">
                    <button onclick="loadSection('orders')" class="dashboard-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/10135/10135838.png" 
                             class="btn-icon">
                        Управление заказами (${orders.length})
                    </button>
                    <button onclick="loadSection('custom-orders')" class="dashboard-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/17292/17292473.png" 
                             class="btn-icon">
                        Инд. заказы (${customOrders.length})
                    </button>
                    <button onclick="loadSection('reviews')" class="dashboard-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/2560/2560789.png" 
                             class="btn-icon">
                        Управление отзываыи (${pendingReviews} на модерации)
                    </button>
                </div>
            </div>
            
            <div class="admin-section">
                <h3>
                    <img src="https://cdn-icons-png.flaticon.com/128/16767/16767952.png" 
                         class="header-icon" style="width: 24px; height: 24px;">
                    Последние заказы
                </h3>
                ${orders.length > 0 ? `
                    <div class="table-container">
                        <table class="simple-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Клиент</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.slice(0, 5).map(order => `
                                    <tr onclick="viewOrder(${order.id})" style="cursor: pointer;">
                                        <td>${order.id}</td>
                                        <td>${order.customer_name}</td>
                                        <td><strong>${order.total_amount} ₽</strong></td>
                                        <td>
                                            <span class="status-${order.status}">
                                                ${getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>${order.created_at_formatted || ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${orders.length > 5 ? `
                        <div class="text-center mt-2">
                            <button onclick="loadSection('orders')" class="action-btn">
                                Показать все заказы (${orders.length})
                            </button>
                        </div>
                    ` : ''}
                ` : `
                    <div class="empty-state">
                        <p>Заказов пока нет</p>
                    </div>
                `}
            </div>
        `;
        
    } catch (error) {
        console.error('Dashboard error:', error);
        document.getElementById('admin-content').innerHTML = `
            <div class="admin-section error-state">
                <h2>
                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711656.png" 
                         class="header-icon">
                    Ошибка загрузки дашборда
                </h2>
                <p>${error.message}</p>
                <button onclick="loadDashboard()" class="dashboard-btn">
                    <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                         class="btn-icon">
                    Повторить
                </button>
            </div>
        `;
    }
}

async function loadOrders() {
    try {
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="loading">Загрузка заказов...</div>';
        
        const data = await fetchJSON('admin_orders.php');
        
        if (!data.success) {
            throw new Error(data.error || 'Ошибка загрузки данных');
        }
        
        const orders = data.orders || [];
        
        content.innerHTML = `
            <div class="admin-section">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/10135/10135838.png" 
                         class="header-icon">
                    Управление заказами
                </h1>
                <p class="section-description">Всего заказов: ${orders.length}</p>
                
                ${orders.length > 0 ? `
                    <div class="table-container">
                        <table id="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>№ заказа</th>
                                    <th>Клиент</th>
                                    <th>Телефон</th>
                                    <th>Сумма</th>
                                    <th>Доставка</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr data-id="${order.id}">
                                        <td>${order.id}</td>
                                        <td><strong>${order.order_number || order.id}</strong></td>
                                        <td>${order.customer_name || 'Не указан'}</td>
                                        <td>${order.customer_phone || 'Не указан'}</td>
                                        <td><strong>${order.total_amount || 0} ₽</strong></td>
                                        <td>
                                            <span class="delivery-type">
                                                ${order.delivery_type === 'delivery' ? 
                                                    '<img src="https://cdn-icons-png.flaticon.com/128/3806/3806012.png" class="delivery-icon"> Доставка' : 
                                                    '<img src="https://cdn-icons-png.flaticon.com/128/11651/11651621.png" class="delivery-icon"> Самовывоз'}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-${order.status || 'new'}">
                                                ${getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>${order.created_at_formatted || order.created_at || ''}</td>
                                        <td>
                                            <div class="action-buttons">
                                                <select onchange="updateOrderStatus(${order.id}, this.value)" 
                                                        class="status-select">
                                                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>Новый</option>
                                                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Подтвержден</option>
                                                    <option value="in_progress" ${order.status === 'in_progress' ? 'selected' : ''}>В работе</option>
                                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Доставлен</option>
                                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Отменен</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-footer">
                        <div class="table-info">
                            Показано ${orders.length} заказов
                        </div>
                        <div class="table-actions">
                            <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">
                                ← Назад в дашборд
                            </button>
                            <button onclick="refreshOrders()" class="dashboard-btn">
                                <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                                     class="btn-icon">
                                Обновить
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>Заказов пока нет</p>
                        <button onclick="loadSection('dashboard')" class="dashboard-btn">
                            ← Назад в дашборд
                        </button>
                    </div>
                `}
            </div>
        `;
        
    } catch (error) {
        console.error('Orders error:', error);
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="admin-section error-state">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711656.png" 
                         class="header-icon">
                    Ошибка загрузки заказов
                </h1>
                <div class="error-message">
                    <p><strong>Ошибка:</strong> ${error.message}</p>
                </div>
                <div class="error-actions">
                    <button onclick="loadOrders()" class="dashboard-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                             class="btn-icon">
                        Повторить
                    </button>
                    <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">← Назад в дашборд</button>
                </div>
            </div>
        `;
    }
}

async function loadCustomOrders() {
    try {
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="loading">Загрузка индивидуальных заказов...</div>';
        
        const data = await fetchJSON('api/custom_orders.php');
        
        if (!data.success) {
            throw new Error(data.error || 'Ошибка загрузки данных');
        }
        
        const orders = data.orders || [];
        
        content.innerHTML = `
            <div class="admin-section">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/17292/17292473.png" 
                         class="header-icon">
                    Индивидуальные заказы
                </h1>
                <p class="section-description">Заявки на создание уникальных букетов</p>
                
                ${orders.length > 0 ? `
                    <div class="table-container">
                        <table id="custom-orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя</th>
                                    <th>Телефон</th>
                                    <th>Email</th>
                                    <th>Бюджет</th>
                                    <th>Описание</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr data-id="${order.id}">
                                        <td>${order.id}</td>
                                        <td><strong>${order.name || 'Не указано'}</strong></td>
                                        <td>${order.phone || 'Не указан'}</td>
                                        <td>${order.email || 'Не указан'}</td>
                                        <td><strong>${order.budget || 0} ₽</strong></td>
                                        <td title="${order.description || ''}">
                                            <div class="description-preview">
                                                ${order.short_description || order.description || 'Нет описания'}
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status-${order.status || 'new'}">
                                                ${getCustomStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td>${order.created_at_formatted || order.created_at || ''}</td>
                                        <td>
                                            <div class="action-buttons">
                                                <select onchange="updateCustomOrderStatus(${order.id}, this.value)" 
                                                        class="status-select">
                                                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>Новый</option>
                                                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В работе</option>
                                                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Выполнен</option>
                                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Отменен</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-footer">
                        <div class="table-info">
                            Показано ${orders.length} заявок
                        </div>
                        <div class="table-actions">
                            <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">
                                ← Назад в дашборд
                            </button>
                            <button onclick="refreshCustomOrders()" class="dashboard-btn">
                                <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                                     class="btn-icon">
                                Обновить
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>Индивидуальных заказов пока нет</p>
                        <button onclick="loadSection('dashboard')" class="dashboard-btn">
                            ← Назад в дашборд
                        </button>
                    </div>
                `}
            </div>
        `;
        
    } catch (error) {
        console.error('Custom orders error:', error);
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="admin-section error-state">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711656.png" 
                         class="header-icon">
                    Ошибка загрузки заказов
                </h1>
                <div class="error-message">
                    <p><strong>Ошибка:</strong> ${error.message}</p>
                </div>
                <div class="error-actions">
                    <button onclick="loadCustomOrders()" class="dashboard-btn">Повторить</button>
                    <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">← Назад в дашборд</button>
                </div>
            </div>
        `;
    }
}

async function loadUsers() {
    try {
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="loading">Загрузка пользователей...</div>';
        
        const data = await fetchJSON('api/users.php');
        
        if (!data.success) {
            throw new Error(data.error || 'Ошибка загрузки данных');
        }
        
        const users = data.users || [];
        
        content.innerHTML = `
            <div class="admin-section">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/1307/1307714.png" 
                         class="header-icon">
                    Управление пользователями
                </h1>
                <p class="section-description">Всего пользователей: ${users.length}</p>
                
                ${users.length > 0 ? `
                    <div class="table-container">
                        <table id="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя пользователя</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Телефон</th>
                                    <th>Дата регистрации</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr data-id="${user.id}">
                                        <td>${user.id}</td>
                                        <td><strong>${user.username}</strong></td>
                                        <td>${user.email}</td>
                                        <td>
                                            <span class="role-${user.role}">
                                                ${user.role === 'admin' ? 
                                                    '<img src="https://cdn-icons-png.flaticon.com/128/2830/2830487.png" class="role-icon"> Админ' : 
                                                    '<img src="https://cdn-icons-png.flaticon.com/128/8870/8870434.png" class="role-icon"> Пользователь'}
                                            </span>
                                        </td>
                                        <td>${user.phone || 'Не указан'}</td>
                                        <td>${user.created_at_formatted || user.created_at}</td>
                                        <td>
                                            <div class="action-buttons">
                                                <select onchange="updateUserRole(${user.id}, this.value)" 
                                                        class="role-select">
                                                    <option value="user" ${user.role === 'user' ? 'selected' : ''}>Пользователь</option>
                                                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Администратор</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-footer">
                        <div class="table-info">
                            Показано ${users.length} пользователей
                        </div>
                        <div class="table-actions">
                            <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">
                                ← Назад в дашборд
                            </button>
                            <button onclick="refreshUsers()" class="dashboard-btn">
                                <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                                     class="btn-icon">
                                Обновить
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>Пользователей пока нет</p>
                        <button onclick="loadSection('dashboard')" class="dashboard-btn">
                            ← Назад в дашборд
                        </button>
                    </div>
                `}
            </div>
        `;
        
    } catch (error) {
        console.error('Users error:', error);
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="admin-section error-state">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711656.png" 
                         class="header-icon">
                    Ошибка загрузки пользователей
                </h1>
                <div class="error-message">
                    <p><strong>Ошибка:</strong> ${error.message}</p>
                </div>
                <div class="error-actions">
                    <button onclick="loadUsers()" class="dashboard-btn">
                        <img src="https://cdn-icons-png.flaticon.com/128/1082/1082454.png" 
                             class="btn-icon">
                        Повторить
                    </button>
                    <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">← Назад в дашборд</button>
                </div>
            </div>
        `;
    }
}

async function loadReviews() {
    try {
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="loading">Загрузка отзывов...</div>';
        
        const data = await fetchJSON('reviews.php');
        
        if (!data.success) {
            throw new Error(data.error || 'Ошибка загрузки данных');
        }
        
        const reviews = data.reviews || [];
        const pendingCount = reviews.filter(r => r.status === 'pending').length;
        
        content.innerHTML = `
            <div class="admin-section">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/2560/2560789.png" 
                         class="header-icon">
                    Управление отзывами
                </h1>
                <p class="section-description">
                    Всего отзывов: ${reviews.length} | 
                    На модерации: ${pendingCount}
                </p>
                
                ${reviews.length > 0 ? `
                    <div class="table-container">
                        <table id="reviews-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Пользователь</th>
                                    <th>Заказ</th>
                                    <th>Оценка</th>
                                    <th>Отзыв</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reviews.map(review => `
                                    <tr data-id="${review.id}">
                                        <td>${review.id}</td>
                                        <td>
                                            <strong>${escapeHtml(review.username)}</strong><br>
                                            <small>${escapeHtml(review.email)}</small>
                                        </td>
                                        <td>${review.order_number}</td>
                                        <td>
                                            <div class="rating-stars">
                                                ${generateRatingStars(review.rating)}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="review-comment-preview" title="${escapeHtml(review.comment)}">
                                                ${escapeHtml(review.comment.substring(0, 100))}${review.comment.length > 100 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status-badge status-${review.status}">
                                                ${getReviewStatusText(review.status)}
                                            </span>
                                        </td>
                                        <td>${review.created_at_formatted}</td>
                                        <td>
                                            <div class="action-buttons">
                                                ${review.status === 'pending' ? `
                                                    <button class="action-btn approve-btn" onclick="updateReviewStatus(${review.id}, 'approved')">
                                                        Одобрить
                                                    </button>
                                                    <button class="action-btn reject-btn" onclick="updateReviewStatus(${review.id}, 'rejected')">
                                                        Отклонить
                                                    </button>
                                                ` : `
                                                    <span class="review-status-info">
                                                        ${review.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                                                    </span>
                                                    <button class="action-btn small-btn" onclick="updateReviewStatus(${review.id}, 'pending')">
                                                        Вернуть на модерацию
                                                    </button>
                                                `}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-footer">
                        <div class="table-info">
                            Показано ${reviews.length} отзывов
                        </div>
                        <div class="table-actions">
                            <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">
                                ← Назад в дашборд
                            </button>
                            <button onclick="refreshReviews()" class="dashboard-btn">
                                Обновить
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="empty-state">
                        <p>Отзывов пока нет</p>
                        <button onclick="loadSection('dashboard')" class="dashboard-btn">
                            ← Назад в дашборд
                        </button>
                    </div>
                `}
            </div>
        `;
        
    } catch (error) {
        console.error('Reviews error:', error);
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="admin-section error-state">
                <h1>
                    <img src="https://cdn-icons-png.flaticon.com/128/6711/6711656.png" 
                         class="header-icon">
                    Ошибка загрузки отзывов
                </h1>
                <div class="error-message">
                    <p><strong>Ошибка:</strong> ${error.message}</p>
                </div>
                <div class="error-actions">
                    <button onclick="loadReviews()" class="dashboard-btn">Повторить</button>
                    <button onclick="loadSection('dashboard')" class="dashboard-btn secondary">← Назад в дашборд</button>
                </div>
            </div>
        `;
    }
}

function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">☆</span>';
        }
    }
    return stars;
}

function getReviewStatusText(status) {
    const statuses = {
        'pending': 'На модерации',
        'approved': 'Одобрен',
        'rejected': 'Отклонен'
    };
    return statuses[status] || status;
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function updateReviewStatus(reviewId, status) {
    if (!confirm(`Изменить статус отзыва #${reviewId} на "${getReviewStatusText(status)}"?`)) {
        return;
    }
    
    try {
        const response = await fetch('update_review.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                reviewId: reviewId, 
                status: status 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Статус отзыва #${reviewId} изменен на "${getReviewStatusText(status)}"`, 'success');
            loadReviews();
        } else {
            showNotification(`${result.message || 'Ошибка обновления'}`, 'error');
        }
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        showNotification('Ошибка обновления статуса', 'error');
    }
}

function refreshReviews() {
    loadReviews();
    showNotification('Список отзывов обновляется...', 'info');
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        if (!text.trim()) {
            return {
                success: false,
                error: 'Пустой ответ от сервера',
                orders: [],
                count: 0
            };
        }
        
        const data = JSON.parse(text);
        return data;
        
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        
        return {
            success: false,
            error: error.message,
            orders: [],
            count: 0
        };
    }
}

function getStatusText(status) {
    const statuses = {
        'new': 'Новый',
        'confirmed': 'Подтвержден',
        'in_progress': 'В работе',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status || 'Новый';
}

function getCustomStatusText(status) {
    const statuses = {
        'new': 'Новый',
        'processing': 'В работе',
        'completed': 'Выполнен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status || 'Новый';
}

async function updateOrderStatus(orderId, status) {
    if (!confirm(`Изменить статус заказа #${orderId} на "${getStatusText(status)}"?`)) {
        return;
    }
    
    const select = event.target;
    const previousStatus = select.value;
    
    try {
        const response = await fetch('update_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                orderId: orderId, 
                status: status 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const row = document.querySelector(`tr[data-id="${orderId}"]`);
            if (row) {
                const statusCell = row.querySelector('td:nth-child(7)');
                if (statusCell) {
                    statusCell.innerHTML = `
                        <span class="status-${status}">
                            ${getStatusText(status)}
                        </span>
                    `;
                }
            }
            
            showNotification(`Статус заказа #${orderId} изменен на "${getStatusText(status)}"`, 'success');
        } else {
            showNotification(`${result.message || 'Ошибка обновления'}`, 'error');
            select.value = previousStatus;
        }
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        showNotification('Ошибка обновления статуса', 'error');
        select.value = previousStatus;
    }
}

async function updateCustomOrderStatus(orderId, status) {
    if (!confirm(`Изменить статус заявки #${orderId} на "${getCustomStatusText(status)}"?`)) {
        return;
    }
    
    const select = event.target;
    const previousStatus = select.value;
    
    try {
        const response = await fetch('api/update_custom_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                orderId: orderId, 
                status: status 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const row = document.querySelector(`tr[data-id="${orderId}"]`);
            if (row) {
                const statusCell = row.querySelector('td:nth-child(7)');
                if (statusCell) {
                    statusCell.innerHTML = `
                        <span class="status-${status}">
                            ${getCustomStatusText(status)}
                        </span>
                    `;
                }
            }
            
            showNotification(`Статус заявки #${orderId} изменен на "${getCustomStatusText(status)}"`, 'success');
        } else {
            showNotification(`${result.message || 'Ошибка обновления'}`, 'error');
            select.value = previousStatus;
        }
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        showNotification('Ошибка обновления статуса', 'error');
        select.value = previousStatus;
    }
}

async function updateUserRole(userId, role) {
    if (!confirm(`Изменить роль пользователя #${userId} на "${role === 'admin' ? 'Администратор' : 'Пользователь'}"?`)) {
        return;
    }
    
    const select = event.target;
    const previousRole = select.value;
    
    try {
        const response = await fetch('api/update_user_role.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userId: userId, 
                role: role 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const row = document.querySelector(`tr[data-id="${userId}"]`);
            if (row) {
                const roleCell = row.querySelector('td:nth-child(4)');
                if (roleCell) {
                    roleCell.innerHTML = `
                        <span class="role-${role}">
                            ${role === 'admin' ? 
                                '<img src="https://cdn-icons-png.flaticon.com/128/2830/2830487.png" class="role-icon"> Админ' : 
                                '<img src="https://cdn-icons-png.flaticon.com/128/8870/8870434.png" class="role-icon"> Пользователь'}
                        </span>
                    `;
                }
            }
            
            showNotification(`Роль пользователя #${userId} изменена на "${role === 'admin' ? 'Администратор' : 'Пользователь'}"`, 'success');
        } else {
            showNotification(`${result.message || 'Ошибка обновления'}`, 'error');
            select.value = previousRole;
        }
    } catch (error) {
        console.error('Ошибка обновления роли:', error);
        showNotification('Ошибка обновления роли', 'error');
        select.value = previousRole;
    }
}


function refreshOrders() {
    loadOrders();
    showNotification('Список заказов обновляется...', 'info');
}

function refreshCustomOrders() {
    loadCustomOrders();
    showNotification('Список индивидуальных заказов обновляется...', 'info');
}

function refreshUsers() {
    loadUsers();
    showNotification(' Список пользователей обновляется...', 'info');
}

function viewOrder(orderId) {
    alert(`Просмотр заказа #${orderId}\n\nВ реальной системе здесь будут детали заказа.`);
}

function viewCustomOrder(orderId) {
    alert(`Просмотр заявки #${orderId}\n\nВ реальной системе здесь будут детали индивидуального заказа.`);
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            ×
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}