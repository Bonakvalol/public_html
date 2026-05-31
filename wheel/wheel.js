// ========== НАСТРОЙКИ АКЦИЙ ==========
const SEGMENTS = [
    { id: 0, name: "Скидка 3%",    value: "3",      color: "#ca35b5" },
    { id: 1, name: "Скидка 5%",    value: "5",      color: "#9438c7" },
    { id: 2, name: "Скидка 10%",   value: "10",     color: "#6633cc" },
    { id: 3, name: "Скидка 12%",   value: "12",     color: "#ee1162" },
    { id: 4, name: "Скидка 15%",   value: "15",     color: "#193be6" },
    { id: 5, name: "Скидка 17%",   value: "17",     color: "#13d7ec" },
    { id: 6, name: "Скидка 20%",   value: "20",     color: "#21de90" },
    { id: 7, name: "Скидка 25%",   value: "25",     color: "#e4e51a" }
];

const SEGMENT_COUNT = SEGMENTS.length;
const ANGLE_PER_SEGMENT = 360 / SEGMENT_COUNT;

// Настройки анимации
let currentAngle = 0;
let spinning = false;
let animationFrameId = null;
let isLoggedIn = false;
let countdownInterval = null;

// Элементы DOM
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const prizesList = document.getElementById('prizesList');

// Размеры канваса
const size = canvas.width;
const centerX = size / 2;
const centerY = size / 2;
const radius = size / 2 - 10;

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
function checkAuth() {
    return fetch('../check_auth.php')
        .then(response => response.json())
        .then(data => {
            isLoggedIn = data.loggedIn || false;
            return isLoggedIn;
        })
        .catch(() => {
            isLoggedIn = false;
            return false;
        });
}

// ========== ПРОВЕРКА ЛИМИТА ЧЕРЕЗ БД ==========
async function hasSpunThisWeek() {
    if (!isLoggedIn) return false;
    try {
        const response = await fetch('check_spin_limit.php');
        const data = await response.json();
        return data.hasSpun === true;
    } catch(e) {
        console.error('Ошибка проверки лимита:', e);
        return false;
    }
}

// ========== ГЕНЕРАЦИЯ ПРОМОКОДА ==========
function generatePromoCode(discount) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SPIN${discount}-${randomPart}`;
}

// ========== СОХРАНЕНИЕ В БД ==========
function savePrizeToServer(prize, promoCode) {
    return fetch('save_prize.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prize: prize.value,
            prize_name: prize.name,
            promo_code: promoCode,
            discount: prize.value
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            console.log('Приз сохранен:', promoCode);
            return { success: true, promoCode: promoCode };
        }
        return { success: false, error: result.message };
    })
    .catch(err => ({ success: false, error: err.message }));
}

// ========== ОТРИСОВКА КОЛЕСА ==========
function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    
    for (let i = 0; i < SEGMENT_COUNT; i++) {
        const startAngle = (i * ANGLE_PER_SEGMENT + currentAngle) * Math.PI / 180;
        const endAngle = ((i + 1) * ANGLE_PER_SEGMENT + currentAngle) * Math.PI / 180;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = SEGMENTS[i].color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + (ANGLE_PER_SEGMENT / 2) * Math.PI / 180);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.font = "bold 13px 'Inter', sans-serif";
        ctx.fillText(SEGMENTS[i].name, radius * 0.65, 5);
        ctx.restore();
    }
    
    // Белый круг в центре
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
    ctx.strokeStyle = "#ca35b5";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Стрелка НАВЕРХУ (12 часов)
    ctx.beginPath();
    ctx.moveTo(centerX - 12, 12);
    ctx.lineTo(centerX, 2);
    ctx.lineTo(centerX + 12, 12);
    ctx.fillStyle = "#ee1162";
    ctx.fill();
}

// ========== ПОЛУЧЕНИЕ СЕКТОРА ПО УГЛУ (СТРЕЛКА ВВЕРХУ) ==========
function getSegmentAtAngle(angle) {
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) normalizedAngle += 360;
    
    // Стрелка находится вверху (12 часов)
    // В canvas: 0° = 3 часа (право), 90° = 6 часов (низ), 180° = 9 часов (лево), 270° = 12 часов (верх)
    const pointerAngle = 270;
    
    // Вычисляем угол от стрелки (какой сектор находится под стрелкой)
    // Формула: угол под стрелкой = (pointerAngle - rotationAngle + 360) % 360
    let angleUnderPointer = (pointerAngle - normalizedAngle + 360) % 360;
    
    // Индекс сектора (0 = первый сектор, идем по часовой стрелке)
    let segmentIndex = Math.floor(angleUnderPointer / ANGLE_PER_SEGMENT);
    
    // Защита от выхода за границы
    if (segmentIndex >= SEGMENT_COUNT) segmentIndex = 0;
    
    console.log('=== getSegmentAtAngle ===');
    console.log('normalizedAngle:', normalizedAngle);
    console.log('angleUnderPointer:', angleUnderPointer);
    console.log('segmentIndex:', segmentIndex);
    console.log('segmentName:', SEGMENTS[segmentIndex].name);
    
    return {
        index: segmentIndex,
        segment: SEGMENTS[segmentIndex]
    };
}

// ========== РАСЧЕТ УГЛА ОСТАНОВКИ ДЛЯ НУЖНОГО ПРИЗА ==========
function calculateStopAngleForPrize(prizeIndex, currentAngle) {
    // Стрелка вверху (12 часов)
    const pointerAngle = 270;
    
    // Берем центр сектора для плавной остановки
    const targetAngleUnderPointer = prizeIndex * ANGLE_PER_SEGMENT + ANGLE_PER_SEGMENT / 2;
    
    // Вычисляем финальный угол
    let targetAngle = (pointerAngle - targetAngleUnderPointer + 360) % 360;
    
    // Вычисляем разницу с текущим углом
    let currentNormalized = currentAngle % 360;
    let angleDiff = (targetAngle - currentNormalized + 360) % 360;
    
    // Добавляем случайное количество полных оборотов (8-12)
    const fullRotations = 8 + Math.floor(Math.random() * 5);
    const finalAngle = currentAngle + fullRotations * 360 + angleDiff;
    
    console.log('=== calculateStopAngleForPrize ===');
    console.log('prizeIndex:', prizeIndex);
    console.log('prizeName:', SEGMENTS[prizeIndex].name);
    console.log('targetAngleUnderPointer:', targetAngleUnderPointer);
    console.log('targetAngle:', targetAngle);
    console.log('currentNormalized:', currentNormalized);
    console.log('angleDiff:', angleDiff);
    console.log('fullRotations:', fullRotations);
    console.log('finalAngle (mod 360):', finalAngle % 360);
    
    return finalAngle;
}

// ========== ВЫБОР СЛУЧАЙНОГО ПРИЗА ==========
function getRandomPrize() {
    const randomIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    console.log('Случайный индекс:', randomIndex);
    console.log('Выигрыш:', SEGMENTS[randomIndex].name);
    
    return {
        index: randomIndex,
        prize: SEGMENTS[randomIndex]
    };
}

function showResult(prize, promoCode) {
    resultDiv.innerHTML = `ПОЗДРАВЛЯЕМ! Вы выиграли ${prize.name}!\n\nВаш промокод: ${promoCode}\n\nСкопируйте его и используйте при оформлении заказа!`.replace(/\n/g, '<br>');
    resultDiv.className = 'result success';
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    resultDiv.innerHTML = `Вы уже крутили на этой неделе!\nСледующее вращение будет доступно через 7 дней.`.replace(/\n/g, '<br>');
    resultDiv.className = 'result info';
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// ========== ОСНОВНОЕ ВРАЩЕНИЕ ==========
async function spinWheel() {
    console.log('spinWheel вызвана');
    
    if (spinning) {
        console.log('Уже крутится');
        return;
    }
    
    if (!isLoggedIn) {
        resultDiv.innerHTML = 'Для участия в акции необходимо войти в аккаунт!<br><br><button onclick="redirectToLogin()" class="login-redirect-btn">Войти в аккаунт</button>';
        resultDiv.className = 'result warning';
        return;
    }
    
    const hasSpun = await hasSpunThisWeek();
    if (hasSpun) {
        spinBtn.style.display = 'none';
        startCountdown();
        return;
    }
    
    spinning = true;
    spinBtn.disabled = true;
    resultDiv.innerHTML = 'Колесо крутится...';
    
    // ВЫБИРАЕМ СЛУЧАЙНЫЙ ПРИЗ
    const result = getRandomPrize();
    const promoCode = generatePromoCode(result.prize.value);
    
    console.log('Выбран приз:', result.prize.name, 'индекс:', result.index);
    
    // РАССЧИТЫВАЕМ УГОЛ ОСТАНОВКИ, ЧТОБЫ ВЫПАЛ ВЫБРАННЫЙ ПРИЗ
    const targetFinalAngle = calculateStopAngleForPrize(result.index, currentAngle);
    
    const duration = 7000;
    const startAngle = currentAngle;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        let progress = Math.min(1, elapsed / duration);
        const easeProgress = easeOutCubic(progress);
        currentAngle = startAngle + (targetFinalAngle - startAngle) * easeProgress;
        drawWheel();
        
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Финальный угол
            currentAngle = targetFinalAngle % 360;
            drawWheel();
            
            // Проверяем, какой сектор реально выпал
            const finalSegment = getSegmentAtAngle(currentAngle);
            console.log('Финальный сектор:', finalSegment.segment.name, 'Ожидался:', result.prize.name);
            
            // Если не совпадает - показываем ошибку
            if (finalSegment.index !== result.index) {
                console.error('ОШИБКА! Сектора не совпадают!');
                resultDiv.innerHTML = 'Ошибка: сектора не совпадают. Пожалуйста, попробуйте еще раз.';
                spinning = false;
                spinBtn.disabled = false;
                return;
            }
            
            savePrizeToServer(result.prize, promoCode).then((saved) => {
                if (saved.success) {
                    showResult(result.prize, promoCode);
                    spinBtn.style.display = 'none';
                } else {
                    resultDiv.innerHTML = 'Ошибка сохранения. Попробуйте позже.';
                    spinBtn.disabled = false;
                }
            });
            
            spinning = false;
            animationFrameId = null;
        }
    }
    
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(animate);
}

function redirectToLogin() {
    window.location.href = '../index.html#login';
}

function renderPrizesList() {
    const unique = [...new Map(SEGMENTS.map(s => [s.value, s.name])).entries()];
    prizesList.innerHTML = unique.map(([v, name]) => `<span class="prize-badge">${name}</span>`).join('');
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function init() {
    console.log('init started');
    
    await checkAuth();
    renderPrizesList();
    
    currentAngle = Math.random() * 360;
    drawWheel();
    
    if (spinBtn) {
        console.log('Кнопка найдена, добавляем обработчик');
        spinBtn.addEventListener('click', function(e) {
            console.log('Клик по кнопке!');
            spinWheel();
        });
    } else {
        console.error('Кнопка spinBtn НЕ НАЙДЕНА! Проверьте ID в HTML');
    }
    
    if (isLoggedIn) {
        const hasSpun = await hasSpunThisWeek();
        if (hasSpun) {
            spinBtn.style.display = 'none';
            startCountdown();
        } else {
            spinBtn.style.display = 'block';
            spinBtn.disabled = false;
            resultDiv.innerHTML = 'Нажми на кнопку, чтобы начать!';
        }
    } else {
        spinBtn.style.display = 'block';
        spinBtn.disabled = false;
        resultDiv.innerHTML = 'Войдите в аккаунт, чтобы крутить колесо!';
    }
}

// Запускаем
init();