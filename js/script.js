
var cart = [];
var orders = [];
var cardText = "";
var isLoading = false;
var currentPage = 'catalog';
var usedRecommendedIds = [];
var currentModalProductId = null;
var currentUser = null;
var products = [];
var recommendedProducts = [];

function saveCartToStorage() {
    localStorage.setItem('floralCharmCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    var savedCart = localStorage.getItem('floralCharmCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            cart = [];
        }
    }
}

function saveOrdersToStorage() {
    localStorage.setItem('floralCharmOrders', JSON.stringify(orders));
}

function loadOrdersFromStorage() {
    var savedOrders = localStorage.getItem('floralCharmOrders');
    if (savedOrders) {
        try {
            orders = JSON.parse(savedOrders);
        } catch (e) {
            console.error('Ошибка загрузки заказов:', e);
            orders = [];
        }
    }
}

products = [
    {
        id: "1",
        name: "Букет из кустовых пионовыдных роз и нежной гипсофилы",
        price: 4000,
        image: "./img/rose/bush-peony-Rose-delicate-Gypsophila.jpg",
        width: 27,
        height: 35,
        category: ["roses"],
        occasion: "valentine",
        label: "hot",
        description: "Этот нежный и романтичный букет сочетает в себе яркость кустовой пион Розы и воздушную лёгкость Гипсофилы.",
        composition: "Роза кустовая пионовидная - 3 шт, Гипсофила - 1 шт, крафт дизайнерский - 3 шт.",
        gallery: ["./img/rose/bush-peony-Rose-delicate-Gypsophila.jpg"]
    },
    {
        id: "2",
        name: "Букет из кустовых пион роз",
        price: 5300,
        image: "./img/rose/bouquet-of-bush-peonies.jpg",
        width: 28,
        height: 40,
        category: ["roses"],
        occasion: "valentine",
        label: "",
        description: "Наш нежный розовый букет из кустовых роз Сильва Пинк – идеальный выбор для тех, кто ценит утонченность и естественную красоту.",
        composition: "Кустовая роза сильва пинк - 5 шт., Упаковка дизайнерская - 1 шт, Бант атласный - 1 шт.",
        gallery: ["./img/rose/bouquet-of-bush-peonies.jpg"]
    },
    {
        id: "3",
        name: "Лавандовые сны",
        price: 3600,
        image: "./img/rose/avant-garde-dreams.jpg",
        width: 30,
        height: 35,
        category: ["roses"],
        occasion: "mothers-day",
        label: "",
        description: "Нежный букет из розовых роз с зеленью и декоративными элементами.",
        composition: "Гипсофила - 2 шт., Гортензия - 1 шт., Пинк мондиаль роза - 3 шт., Папоротник - 1 шт.",
        gallery: ["./img/rose/avant-garde-dreams.jpg"]
    },
    {
        id: "4",
        name: "Роскошный букет из розовых роз",
        price: 29500,
        image: "./img/rose/pink-roses-luxury.jpg",
        width: 50,
        height: 65,
        category: ["roses", "premium"],
        occasion: "valentine",
        label: "luxury",
        description: "Премиальный букет из 101 розовой розы в стильной упаковке.",
        composition: "Роза розовая - 101 шт, Упаковка розовая - 5 шт, Лента атласная - 2 шт.",
        gallery: ["./img/rose/pink-roses-luxury.jpg"]
    },
    {
        id: "5",
        name: "Микс пастельных французских роз",
        price: 5400,
        image: "./img/rose/french-pastel-roses.jpg",
        width: 35,
        height: 52,
        category: ["roses"],
        occasion: "birthday",
        label: "",
        description: "Нежный букет в пастельных тонах из розовых французских роз сорта Пинк Мондиаль.",
        composition: "Французская роза - 7 шт.",
        gallery: ["./img/rose/french-pastel-roses.jpg"]
    },
    {
        id: "6",
        name: "Букет чайных роз с диантусом",
        price: 3000,
        image: "./img/rose/orange-tea-roses.jpg",
        width: 25,
        height: 40,
        category: ["roses"],
        occasion: "congratulations",
        label: "",
        description: "Нежный букет из 5 чайных роз с диантусом.",
        composition: "Роза - 5 шт, Диантус - 4 шт, Эвкалипт - 1 шт, Тишью - 1 шт.",
        gallery: ["./img/rose/orange-tea-roses.jpg"]
    },
    {
        id: "7",
        name: "Монобукет из персиковой пионовидной кустовой розы",
        price: 5400,
        image: "./img/rose/peach-peony-shaped-roses.jpg",
        width: 30,
        height: 30,
        category: ["roses"],
        occasion: "valentine",
        label: "",
        description: "Монобукет из кустовых роз - цветочная классика, которая подходит для всех возможных поводов для подарка.",
        composition: "Роза кустовая пионовидная - 11 шт, Эвкалипт - 3 шт, Лента атласная - 1 шт.",
        gallery: ["./img/rose/peach-peony-shaped-roses.jpg"]
    },
    {
        id: "8",
        name: "Французские розовые розы",
        price: 17235,
        image: "./img/rose/french-light-pink-roses.jpg",
        width: 55,
        height: 50,
        category: ["roses", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Нежный букет из 5 французских роз.",
        composition: "Роза - 23 шт, Упаковка дизайнерская - 1 шт.",
        gallery: ["./img/rose/french-light-pink-roses.jpg"]
    },
    {
        id: "9",
        name: "Кустовые красные розы",
        price: 1300,
        image: "./img/rose/bush-roses-red.jpg",
        width: 20,
        height: 50,
        category: ["roses"],
        occasion: "congratulations",
        label: "new",
        description: "Элегантный букет из 5 кустовых роз. Символ силый и любви.",
        composition: "Лав лидия 50 см - 5 шт, Упаковка дизайнерская - 5 шт, Лента атласная - 1 шт.",
        gallery: ["./img/rose/bush-roses-red.jpg"]
    },
    {
        id: "10",
        name: "Микс пионовидных кустовых роз",
        price: 4700,
        image: "./img/rose/bush-roses-peony-shaped.jpg",
        width: 26,
        height: 45,
        category: ["roses"],
        occasion: "mothers-day",
        label: "",
        description: "Прекрасный букет станет идеальным подарком для самых близких, например, для дочери или мамы!",
        composition: "Роза кустовая пионовидная - 7 шт,Упаковка дизайнерская - 1 шт.",
        gallery: ["./img/rose/bush-roses-peony-shaped.jpg"]
    },
    {
        id: "11",
        name: "Пионовидные розы в коробке",
        price: 3600,
        image: "./img/rose/peony-shaped-roses-in-a-box.jpg",
        width: 20,
        height: 22,
        category: ["roses"],
        occasion: "mothers-day",
        label: "new",
        description: "Пионовидные кустовые розы в коробке с ароматным эвкалиптом.",
        composition: "Роза кустовая Бомбастик - 2 шт., Эвкалипт - 10 шт., Роза misty bubbles - 7 шт.",
        gallery: ["./img/rose/peony-shaped-roses-in-a-box.jpg"]
    },
    {
        id: "12",
        name: "Букет пионовидных кустовых роз в дизайнерской упаковке",
        price: 2500,
        image: "./img/rose/bush-roses-in-designer-packaging.jpg",
        width: 27,
        height: 30,
        category: ["roses"],
        occasion: "birthday",
        label: "hot",
        description: "Букет из кустовых лента роз Пиони Баблс — это яркая, жизнерадостная композиция из кустовых пионовидных роз, отличающаяся пышными, пушистыми бутонами насыщенного желтого цвета, похожими на маленькие облачка или пуговки.",
        composition: "Роза кустовая пионовидная - 11 шт., Упаковка дизайнерская - 2 шт., Лента атласная - 1 шт.",
        gallery: ["./img/rose/bush-roses-in-designer-packaging.jpg"]
    },
    {
        id: "13",
        name: "Букет пионовидных роз в дизайнерской упаковке",
        price: 2900,
        image: "./img/rose/peony-shaped-roses-designer-packaging1.jpg",
        width: 20,
        height: 40,
        category: ["roses"],
        occasion: "mothers-day",
        label: "hot",
        description: "Букет пионовидных роз в дизайнерской упаковке.",
        composition: "Роза кустовая пионовидная - 11 шт., Лента атласная - 1 шт.",
        gallery: ["./img/rose/peony-shaped-roses-designer-packaging1.jpg"]
    },
    {
        id: "14",
        name: "Букет из парфюмированных роз Пинк Эссенс",
        price: 2600,
        image: "./img/rose/pink-essence-perhaps.jpg",
        width: 25,
        height: 40,
        category: ["roses"],
        occasion: "birthday",
        label: "hot",
        description: "Пинк Эссенс пожалуй самый нежный и ароматный сорт среди роз. Букет из этих роз не оставит равнодушной даже самую требовательную барышню.",
        composition: "Роза кустовая - 9 шт., Лента атласная - 1 шт., Упаковка дизайнерская - 1 шт.",
        gallery: ["./img/rose/pink-essence-perhaps.jpg"]
    },
    {
        id: "15",
        name: "Букет из кружевных эквадоских роз",
        price: 29700,
        image: "./img/rose/ecuadorian-pink-rose.jpg",
        width: 65,
        height: 65,
        category: ["roses", "premium"],
        occasion: "congratulations",
        label: "luxury",
        description: "Огромный букет из кружевных эквадоских роз в бело-розовых тонах покорят не только своим ароматом и красотой, но и стойкостью.",
        composition: "Роза эквадор розовая - 25 шт., Роза Эквадор белая - 26 шт., Лента атласная - 5 шт.",
        gallery: ["./img/rose/ecuadorian-pink-rose.jpg"]
    },
    {
        id: "16",
        name: "Изящная композиция роз в коробке️",
        price: 15600,
        image: "./img/rose/roses-in-a-box1.jpg",
        width: 57,
        height: 47,
        category: ["roses", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Получить цветы в коробке будет рада любая представительница прекрасного пола, и не зря, ведь букеты в коробках смотрятся очень дорого, изысканно и мило.",
        composition: "Лизиантус - 3 шт., Орхидея Цимбидиум - 7 шт., Роза кустовая - 5 шт., Роза одноголовая - 7 шт., Гвоздика - 7 шт.",
        gallery: ["./img/rose/roses-in-a-box1.jpg"]
    },
    {
        id: "17",
        name: "Корзина с пионовидными розами и эустома с эвкалиптом",
        price: 15900,
        image: "./img/rose/basket-flowers-peonies-and-roses.jpg",
        width: 55,
        height: 40,
        category: ["roses", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Огромный букет из пионовидных роз в бело-розовых тонах покорят не только своим ароматом и красотой, но и стойкостью.",
        composition: "Эвкалипт - 19 шт., Роза кустовая пионовидная - 25 шт., Диантус кустовой белый - 15 шт., Эустома белая - 15 шт.",
        gallery: ["./img/rose/basket-flowers-peonies-and-roses.jpg"]
    },
    {
        id: "18",
        name: "Прекрасная композиция из синих роз",
        price: 40200,
        image: "./img/rose/101-blue-roses.jpg",
        width: 50,
        height: 60,
        category: ["roses", "premium"],
        occasion: "congratulations",
        label: "luxury",
        description: "Получить цветы будет рада любая представительница прекрасного пола, и не зря, ведь такие букеты смотрятся очень дорого, изысканно и мило.",
        composition: "Синяя роза - 101 шт., Крафт упаковка - 7 шт., Атласная лента - 3 шт.",
        gallery: ["./img/rose/101-blue-roses.jpg"]
    },
    {
        id: "19",
        name: "Белые тюльпаны и лаванда",
        price: 5900,
        image: "./img/tulips/white-tulips-and-lavender.jpg",
        width: 26,
        height: 38,
        category: "tulips",
        occasion: "mothers-day",
        label: "sale",
        description: "Весенние белые тюльпаны с лавандой и статицей - букет, который приближает весну и в душе, и в сердце.",
        composition: "Тюльпаны белые - 15 шт., лаванда банч - 1 шт., эвкалипт - 3 шт.",
        gallery: ["./img/tulips/white-tulips-and-lavender.jpg"]
    },
    {
        id: "20",
        name: "Тюльпаны пионовидные и ароматные ромашки",
        price: 3900,
        image: "./img/tulips/peony-shaped-tulips-fragrant-daisies.jpg",
        width: 30,
        height: 40,
        category: "tulips",
        occasion: "mothers-day",
        label: "sale",
        description: "Нежный и ароматный букет из пионовидных тюльпанов и полевых ромашек - чудесный подарок для самых близких и любимых.",
        composition: "Тюльпан Пионовидный - 15 шт., Ромашка кустовая - 4 шт.",
        gallery: ["./img/tulips/peony-shaped-tulips-fragrant-daisies.jpg"]
    },
    {
        id: "21",
        name: "Букет розовые тюльпаны и лимониуми",
        price: 3400,
        image: "./img/tulips/bouquet-pink-tulips-limonium.jpg",
        width: 24,
        height: 43,
        category: "tulips",
        occasion: "birthday",
        label: "hot",
        description: "Нежный букет в пастельных тонах из розовых тюльпанов и сиреневого лимониума",
        composition: "Тюльпан - 7 шт., Лимониум - 3 шт.",
        gallery: ["./img/tulips/bouquet-pink-tulips-limonium.jpg"]
    },
    {
        id: "22",
        name: "Букет белых тюльпанов и ирисов",
        price: 3400,
        image: "./img/tulips/bouquet-of-tulips-and-irises.jpg",
        width: 25,
        height: 25,
        category: "tulips",
        occasion: "birthday",
        label: "hot",
        description: "Нежный букет в пастельных тонах из белых тюльпанов и сиреневого ириса",
        composition: "Тюльпан белый - 13 шт., Ирис Blue Magic - 12 шт.",
        gallery: ["./img/tulips/bouquet-of-tulips-and-irises.jpg"]
    },
    {
        id: "23",
        name: "Нежный букет тюльпаны и гипсофила",
        price: 4900,
        image: "./img/tulips/tulips-and-gypsophila.jpg",
        width: 32,
        height: 45,
        category: "tulips",
        occasion: "congratulations",
        label: "new",
        description: "Нежный и очень элегантный букет из супер стойких цветов в стильном исполнении будет отличным комплиментом для ценителей красоты и искусства.",
        composition: "Гипсофила Белая - 5 шт., Тюльпаны белые голландия - 7 шт.",
        gallery: ["./img/tulips/tulips-and-gypsophila.jpg"]
    },
    {
        id: "24",
        name: "Тюльпаны и гиацинты",
        price: 4900,
        image: "./img/tulips/Tulips-and-hyacinths.jpg",
        width: 27,
        height: 35,
        category: "tulips",
        occasion: "congratulations",
        label: "new",
        description: "Нежный и очень элегантный букет из супер стойких цветов в стильном исполнении будет отличным комплиментом для ценителей красоты и искусства.",
        composition: "Тюльпан - 10 шт., Гиацинты - 5 шт.",
        gallery: ["./img/tulips/Tulips-and-hyacinths.jpg"]
    },
    {
        id: "25",
        name: "Зимний букет тюльпаны с нежным хлопком",
        price: 5900,
        image: "./img/tulips/Winter-tulip-bouquet.jpg",
        width: 32,
        height: 45,
        category: "tulips",
        occasion: "congratulations",
        label: "new",
        description: "Зимний букет из суперстойких цветов , будет стильным комплектом для неё и наполнением о вас.",
        composition: "Хлопок - 5 шт., Лагурус (сухоцвет) - 80 шт., Тюльпаны белые - 15 шт.",
        gallery: ["./img/tulips/Winter-tulip-bouquet.jpg"]
    },
    {
        id: "26",
        name: "Пионовидные тюльпаны с кружевными диантусами",
        price: 11900,
        image: "./img/tulips/peony-shaped-tulips-lace-dianthuses.jpg",
        width: 40,
        height: 40,
        category: "tulips",
        occasion: "mothers-day",
        label: "new",
        description: "Выбирая этот букет, вы дарите не только цветы, но и атмосферу уюта, радости и вдохновения. Позвольте нашим цветам говорить за вас!",
        composition: "Тюльпаны пионовидные - 25 шт., диантусы сортовые - 19 шт.",
        gallery: ["./img/tulips/peony-shaped-tulips-lace-dianthuses.jpg"]
    },
    {
        id: "27",
        name: "Букет из белых тюльпанов и белой эустомы",
        price: 7700,
        image: "./img/tulips/bouquet-white-tulips-white-eustoma.jpg",
        width: 30,
        height: 45,
        category: "tulips",
        occasion: "mothers-day",
        label: "new",
        description: "Выбирая этот букет, вы дарите не только цветы, но и атмосферу уюта, радости и вдохновения. Позвольте нашим цветам говорить за вас!",
        composition: "Тюльпан - 15 шт., Эвкалипт - 4 шт., Эустома - 4 шт.",
        gallery: ["./img/tulips/bouquet-white-tulips-white-eustoma.jpg"]
    },
    {
        id: "28",
        name: "Сиреневые пионовидные тюльпаны Дабл Прайс с лимониумом",
        price: 6600,
        image: "./img/tulips/peony-shaped-tulips-ouble-price-limonium.jpg",
        width: 30,
        height: 40,
        category: "tulips",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из 15 тюльпанов «Сиреневые пионовидные тюльпаны Дабл Прайс с лимониумом»",
        composition: "Тюльпан дабл прайс - 15 шт., Пленка дизайнерская - 1 шт., Лимониум - 1 шт.",
        gallery: ["./img/tulips/peony-shaped-tulips-ouble-price-limonium.jpg"]
    },
    {
        id: "29",
        name: "Корзина с пионовидными тюльпанами",
        price: 30000,
        image: "./img/tulips/basket-with-peony-shaped-tulips.jpg",
        width: 50,
        height: 50,
        category: ["tulips", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Огромный букет из пионовидных тюльпанов в пастельно-розовых тонах покорят не только своим ароматом и красотой, но и стойкостью.",
        composition: "Тюльпан - 50 шт., Оазис флористический - 4 шт.",
        gallery: ["./img/tulips/basket-with-peony-shaped-tulips.jpg"]
    },
    {
        id: "30",
        name: "Прекрасная композиция из белых тюльпанов",
        price: 45000,
        image: "./img/tulips/composition-white-tulips.jpg",
        width: 50,
        height: 50,
        category: ["tulips", "premium"],
        occasion: "birthday",
        label: "luxury",
        description: "Букет из белых тюльпанов скажет адресату о глубине чувств дарителя, его любви и преданности, а также – это пожелание удачи и счастья.",
        composition: "Тюльпан - 151 шт., Атласная лента - 1 шт.",
        gallery: ["./img/tulips/composition-white-tulips.jpg"]
    },
    {
        id: "31",
        name: "Прекрасная композиция из фиолетовых тюльпанов в упаковке",
        price: 29700,
        image: "./img/tulips/101-purple-tulips-in-a-package.jpg",
        width: 45,
        height: 45,
        category: ["tulips", "premium"],
        occasion: "valentine",
        label: "premium",
        description: "В странах Востока тюльпан наряду с королевой цветов розой считается цветком счастья, любви и благополучия.",
        composition: "Тюльпан фиолетовый - 101 шт., Фоамиран (упаковка) - 1 шт.",
        gallery: ["./img/tulips/101-purple-tulips-in-a-package.jpg"]
    },
    {
        id: "32",
        name: "Прекрасная композиция из желтых тюльпанов в упаковке",
        price: 29700,
        image: "./img/tulips/101-yellow-tulips-in-a-package.jpg",
        width: 45,
        height: 45,
        category: ["tulips", "premium"],
        occasion: "birthday",
        label: "premium",
        description: "В странах Востока тюльпан наряду с королевой цветов розой считается цветком счастья, любви и благополучия.",
        composition: "Тюльпан желтый - 101 шт., Фоамиран (упаковка) - 1 шт.",
        gallery: ["./img/tulips/101-yellow-tulips-in-a-package.jpg"]
    },
    {
        id: "33",
        name: "Корзина из мыла с сухоцветами",
        price: 6500,
        image: "./img/soap/soap-basket-with-dried-flowers.jpg",
        width: 33,
        height: 30,
        category: "gifts",
        occasion: "valentine",
        label: "new",
        description: "Корзина из мыльных розочек , с натуральными сухоцветами и медом - суфле перони.",
        composition: "Мыльные розочки - 12шт., Мед - 5 шт.",
        gallery: ["./img/soap/soap-basket-with-dried-flowers.jpg"]
    },
    {
        id: "34",
        name: "Корзина с цветами и мылом ручной работы",
        price: 4500,
        image: "./img/soap/with-flowers-and-handmade-soap.jpg",
        width: 27,
        height: 30,
        category: "gifts",
        occasion: "mothers-day",
        label: "sale",
        description: "Набор ароматного мыла ручной работы в подарочной упаковке.",
        composition: "Мыло ручной работы - 1 шт., Роза кустовая - 3 шт., Хлопок - 3 шт., Лагурус (сухоцвет) - 9 шт.",
        gallery: ["./img/soap/with-flowers-and-handmade-soap.jpg"]
    },
    {
        id: "35",
        name: "Мыло ручной работы в подарочной коробочке",
        price: 600,
        image: "./img/soap/handmade-soap-ina-gift-box.jpg",
        width: 6,
        height: 6,
        category: "gifts",
        occasion: "birthday",
        label: "",
        description: "Элегантная подарочная коробка с лентой для особых случаев.",
        composition: "Мыло ручной работы - 1 шт., Бумажный наполнитель.",
        gallery: ["./img/soap/handmade-soap-ina-gift-box.jpg"]
    },
    {
        id: "36",
        name: "Подарочный набор с чаем и бомбочкой для ванны",
        price: 3300,
        image: "./img/soap/gift-set-with-tea-and-bath-bomb.jpg",
        width: 16,
        height: 22,
        category: "gifts",
        occasion: "mothers-day",
        label: "last",
        description: "Набор ароматического мыла с натуральными компонентами.",
        composition: "Мыло ручной работы - 1 шт., Бомбочка для ванной - 1 шт., мед-суфле медолюбов - 1 шт., свеча пион - 1 шт.",
        gallery: ["./img/soap/gift-set-with-tea-and-bath-bomb.jpg"]
    },
    {
        id: "37",
        name: "Подарочный набор с морской солью и мылом",
        price: 3300,
        image: "./img/soap/gift-set-with-sea-salt.jpg",
        width: 16,
        height: 22,
        category: "gifts",
        occasion: "mothers-day",
        label: "last",
        description: "Набор ароматического мыла с натуральными компонентами.",
        composition: "Мыло ручной работы - 3 шт., Бомбочка для ванной - 3 шт., набор с морской солью - 3 шт.",
        gallery: ["./img/soap/gift-set-with-sea-salt.jpg"]
    },
    {
        id: "38",
        name: "Корзина розами из мыла",
        price: 8700,
        image: "./img/soap/soap-roses-41-pieces.jpg",
        width: 25,
        height: 28,
        category: ["gifts", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Ах ,как они пахнут! Чудесный аромат наполнит комнату и сохранит красоту на долгие годы! Дарите на радость)",
        composition: "Розы из мыла 41 штука.",
        gallery: ["./img/soap/soap-roses-41-pieces.jpg"]
    },
    {
        id: "39",
        name: "Мягкая игрушка огромный медведь",
        price: 15600,
        image: "./img/soap/soft-toy-giant-bear.jpg",
        width: 90,
        height: 130,
        category: ["gifts", "premium"],
        occasion: "mothers-day",
        label: "premium",
        description: "Этот огромный плюшевый медведь с сердечком, словно созданный для теплых объятий, растопит сердце и подарит незабываемые эмоции!",
        composition: "Материал: текстиль, полиэстер",
        gallery: ["./img/soap/soft-toy-giant-bear.jpg"]
    },
    {
        id: "40",
        name: "Мягкая игрушка Медведь",
        price: 12200,
        image: "./img/soap/stuffed-bear.jpg",
        width: 20,
        height: 40,
        category: ["gifts", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Этот огромный плюшевый медведь, словно созданный для теплых объятий, растопит сердце и подарит незабываемые эмоции!",
        composition: "Материал: полиэстер",
        gallery: ["./img/soap/stuffed-bear.jpg"]
    },
    {
        id: "41",
        name: "Мишка мягкая игрушка",
        price: 9000,
        image: "./img/soap/mishka-is-a-soft-toy.jpg",
        width: 35,
        height: 50,
        category: ["gifts", "premium"],
        occasion: "mothers-day",
        label: "premium",
        description: "Этот огромный плюшевый медведь, словно созданный для теплых объятий, растопит сердце и подарит незабываемые эмоции!",
        composition: "Материал: полиэстер",
        gallery: ["./img/soap/mishka-is-a-soft-toy.jpg"]
    },
    {
        id: "100",
        name: "Лилии в букете «Ароматное вдохновение»",
        price: 4000,
        image: "./img/lilies/lilies-in-a-bouquet1.jpg",
        width: 45,
        height: 60,
        category: ["lilies"],
        occasion: "valentine",
        label: "",
        description: "Чудесный букет из лилий подойдет ĸ любому событию и доставит всем море положительных эмоций.",
        composition: "Лилия - 3 шт., Пленка матовая - 3 шт.",
        gallery: ["./img/lilies/lilies-in-a-bouquet1.jpg"]
    },
    {
        id: "101",
        name: "Лилии в букете «Светлая Аура с лилией»",
        price: 4400,
        image: "./img/lilies/light-Aura-with-a-lily.jpg",
        width: 30,
        height: 60,
        category: ["lilies"],
        occasion: "valentine",
        label: "hot",
        description: "Чудесный букет из лилий подойдет ĸ любому событию и доставит всем море положительных эмоций.",
        composition: "Лилия - 3 шт., Дизайнерская упаковка - 1 шт.",
        gallery: ["./img/lilies/light-Aura-with-a-lily.jpg"]
    },
    {
        id: "102",
        name: "Букет из махровых лилий",
        price: 6000,
        image: "./img/lilies/double1-lilies.jpg",
        width: 30,
        height: 60,
        category: ["lilies"],
        occasion: "valentine",
        label: "hot",
        description: "Чудесный букет из лилий подойдет ĸ любому событию и доставит всем море положительных эмоций.",
        composition: "лилии махровые - 5 шт., сборка в декор бумагу - 1 шт.",
        gallery: ["./img/lilies/double1-lilies.jpg"]
    },
    {
        id: "103",
        name: "Букет из лилий и эустом «Вальс цветов»",
        price: 7750,
        image: "./img/lilies/Bouquet-o-Lilies-and-Eustomas.jpg",
        width: 30,
        height: 45,
        category: ["lilies"],
        occasion: "valentine",
        label: "",
        description: "Нежный воздушный букет из розовых пионовидных лилий и белоснежной эустомы, в идеально дополняющей цветы лаконичной упаковке.",
        composition: "пионовидные лилии - 3 шт., Эвкалипт - 3 шт., Эустома - 4 шт.",
        gallery: ["./img/lilies/Bouquet-o-Lilies-and-Eustomas.jpg"]
    },
    {
        id: "104",
        name: "Букет из лилий «Песня цветов»",
        price: 8600,
        image: "./img/lilies/White-Lily-9.jpg",
        width: 80,
        height: 80,
        category: ["lilies"],
        occasion: "valentine",
        label: "hot",
        description: "Букет из розовых лилий – это воплощение утонченности и нежности. Каждая лилия словно дарит частичку своей красоты и изысканности.",
        composition: "Лилия Белая - 9 шт., Лента атласная - 2 шт.",
        gallery: ["./img/lilies/White-Lily-9.jpg"]
    },
    {
        id: "105",
        name: "Ароматы прованса с лилией, гортензией и маттиолой",
        price: 6600,
        image: "./img/lilies/Provence-lilies-hydrangeas-matthiola.jpg",
        width: 53,
        height: 50,
        category: ["lilies"],
        occasion: "valentine",
        label: "hot",
        description: "Букет из розовых лилий – это воплощение утонченности и нежности. Каждая лилия словно дарит частичку своей красоты и изысканности.",
        composition: "Гвоздика - 7 шт., Лилия - 2 шт., Гортензия - 1 шт.",
        gallery: ["./img/lilies/Provence-lilies-hydrangeas-matthiola.jpg"]
    },
    {
        id: "106",
        name: "Королевская лилия",
        price: 9900,
        image: "./img/lilies/The-Royal-Lily.jpg",
        width: 30,
        height: 60,
        category: ["lilies"],
        occasion: "valentine",
        label: "hot",
        description: "Букет из королевских лилий – это воплощение утонченности и нежности. Каждая лилия словно дарит частичку своей красоты и изысканности.",
        composition: "Королевская лилия - 7 шт., Лента атласная - 2 шт., Упаковка дизайнерская - 1 шт.",
        gallery: ["./img/lilies/The-Royal-Lily.jpg"]
    },
    {
        id: "107",
        name: "Летний букет лилий",
        price: 41000,
        image: "./img/lilies/Summer-bouquet-of-lilies2.jpg",
        width: 33,
        height: 60,
        category: ["lilies", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Лилии — цветы с характером. В этом букете — грация и сила, чистота и глубина.",
        composition: "лилии градиентные кустовые - 11 шт.",
        gallery: ["./img/lilies/nSummer-bouquet-of-lilies2.jpg"]
    },
    {
        id: "108",
        name: "Букет лилий с ароматом",
        price: 35000,
        image: "./img/lilies/fragrant-lilies-19-pieces.jpg",
        width: 37,
        height: 70,
        category: ["lilies", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Лилии — цветы с характером. В этом букете — грация и сила, чистота и глубина.",
        composition: "лилия с запахом - 19 шт.",
        gallery: ["./img/lilies/fragrant-lilies-19-pieces.jpg"]
    },
    {
        id: "109",
        name: "Утонченный букет лилий",
        price: 30000,
        image: "./img/lilies/delicate-bouquet-of-lilies.jpg",
        width: 25,
        height: 50,
        category: ["lilies", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Лилии — цветы с характером. В этом букете — грация и сила, чистота и глубина.",
        composition: "лилия кустовая розовая - 9 шт.",
        gallery: ["./img/lilies/delicate-bouquet-of-lilies.jpg"]
    },
    {
        id: "110",
        name: "Авторский букет с хризантемой и ромашкой",
        price: 3700,
        image: "./img/chrysanthemum/Author_chamomile.jpg",
        width: 35,
        height: 45,
        category: "chrysanthemum",
        occasion: "mothers-day",
        label: "sale",
        description: "Лёгкий и воздушный, как утренний бриз — букет из белых кустовых хризантем и полевых ромашек создан, чтобы радовать с первого взгляда.",
        composition: "Хризантема кустовая - 5 шт., Упаковка дизайнерская - 3 шт., Кустовая ромашка - 3 шт.",
        gallery: ["./img/chrysanthemum/Author_chamomile.jpg"]
    },
    {
        id: "111",
        name: "Хризантемы в букете",
        price: 5900,
        image: "./img/chrysanthemum/chrysanthemum123.jpg",
        width: 30,
        height: 45,
        category: "chrysanthemum",
        occasion: "mothers-day",
        label: "sale",
        description: "одарите нежность своим близким с великолепным букетом из белых хризантем!",
        composition: "Хризантема - 9 шт., Авторская упаковка - 1 шт.",
        gallery: ["./img/chrysanthemum/chrysanthemum123.jpg"]
    },
    {
        id: "112",
        name: "Букет с хризантемами",
        price: 4500,
        image: "./img/chrysanthemum/chrysanthem11123.jpg",
        width: 24,
        height: 43,
        category: "chrysanthemum",
        occasion: "birthday",
        label: "hot",
        description: "Нежный букет в оранжевых тонах из хризантем",
        composition: "Хризантема кустовая - 4 шт., Хризантема одноголовая - 10 шт.",
        gallery: ["./img/chrysanthemum/chrysanthem11123.jpg"]
    },
    {
        id: "113",
        name: "Букет из кустовой хризантемы",
        price: 2000,
        image: "./img/chrysanthemum/1761308565_89742457.jpg",
        width: 25,
        height: 50,
        category: "chrysanthemum",
        occasion: "birthday",
        label: "hot",
        description: "Нежный букет в розово-белых тонах из хризантем",
        composition: "Кустовая хризантема - 3 шт.",
        gallery: ["./img/chrysanthemum/1761308565_89742457.jpg"]
    },
    {
        id: "114",
        name: "Авторский букет с хризантемой и альстромерией",
        price: 3600,
        image: "./img/chrysanthemum/1759579813_48651195.jpg",
        width: 35,
        height: 45,
        category: "chrysanthemum",
        occasion: "congratulations",
        label: "new",
        description: "В его составе яркие альстромерии и белоснежные кустовые хризантемы.",
        composition: "Хризантема кустовая Алтай - 3 шт., альстромерия розовая - 5 шт.",
        gallery: ["./img/chrysanthemum/1759579813_48651195.jpg"]
    },
    {
        id: "115",
        name: "Композиция из нежных хризантемой с нежным эвкалиптом",
        price: 4900,
        image: "./img/chrysanthemum/1722775919_9945970.jpg",
        width: 35,
        height: 35,
        category: "chrysanthemum",
        occasion: "congratulations",
        label: "new",
        description: "Этот изящный букет — идеальный выбор для любого торжества и человека.",
        composition: "Хризантема кустовая - 5 шт., Эвкалипт - 8 шт.",
        gallery: ["./img/chrysanthemum/1722775919_9945970.jpg"]
    },
    {
        id: "116",
        name: "Сборный букет из 7 кустовых хризантемы и статицы.",
        price: 5700,
        image: "./img/chrysanthemum/1713425312_58123530.jpg",
        width: 40,
        height: 40,
        category: "chrysanthemum",
        occasion: "congratulations",
        label: "new",
        description: "Этот нежный и воздушный букет создан с любовью и заботой.",
        composition: "Статица синяя - 5 шт., Дизайнерская упаковка - 2 шт.",
        gallery: ["./img/chrysanthemum/1713425312_58123530.jpg"]
    },
    {
        id: "117",
        name: "Воздушные хризантемы с маттиоллой",
        price: 12300,
        image: "./img/chrysanthemum/1761161304_15955879.jpg",
        width: 45,
        height: 60,
        category: "chrysanthemum",
        occasion: "mothers-day",
        label: "new",
        description: "Этот букет воплощает атмосферу тихих крымских вечеров, наполненных ароматом моря и нежностью вечернего сада.",
        composition: "крымская хризантема - 11 шт., маттиола кустовая лавандовая - 14 шт.",
        gallery: ["./img/chrysanthemum/1761161304_15955879.jpg"]
    },
    {
        id: "118",
        name: "Букет из хризантем Бигуди Ред с эвкалиптом",
        price: 9600,
        image: "./img/chrysanthemum/1759579773_58740635.jpg",
        width: 35,
        height: 50,
        category: "chrysanthemum",
        occasion: "mothers-day",
        label: "new",
        description: "Хризантемы в Китае — символизирует осень, мудрость и гармонию, её изображение часто используется в искусстве и философии.",
        composition: "Эвкалипт - 3 шт., хризантема бигуди ред - 9 шт.",
        gallery: ["./img/chrysanthemum/1759579773_58740635.jpg"]
    },
    {
        id: "119",
        name: "Хризантемы микс с ягодами илекса",
        price: 6900,
        image: "./img/chrysanthemum/1761132813_56756950.jpg",
        width: 45,
        height: 50,
        category: "chrysanthemum",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из микса сезонных одноголовых хризантем белого и бордового оттенков в лаконичном оформлении для подарка по любому поводу »",
        composition: "Хризантема одноголовая микс - 7 шт., Эвкалипт - 5 шт., Илекс - 1 шт.",
        gallery: ["./img/chrysanthemum/1761132813_56756950.jpg"]
    },
    {
        id: "120",
        name: "Букет Французский флер лаванда с хризантемами",
        price: 13000,
        image: "./img/chrysanthemum/1699114609_88760281.jpg",
        width: 50,
        height: 50,
        category: ["chrysanthemum", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Нежный букет из сортовых хризантем в светлых фиолетовых тонах с легким флером лавандовых полей Франции и изысканной тифы.",
        composition: "Хризантема кустовая - 25 шт., Дизайнерская упаковка - 2 шт.",
        gallery: ["./img/chrysanthemum/1699114609_88760281.jpg"]
    },
    {
        id: "121",
        name: "Букет в лавандовой гамме с винной хризантемой и веточкой магнолии",
        price: 10500,
        image: "./img/chrysanthemum/1697738477_72133569.jpg",
        width: 40,
        height: 50,
        category: ["chrysanthemum", "premium"],
        occasion: "birthday",
        label: "luxury",
        description: "Идеальный букет, чтобы чей-то день стал особенным.",
        composition: "Хризантема кустовая - 3 шт., Роза пудровая - 7 шт.",
        gallery: ["./img/chrysanthemum/1697738477_72133569.jpg"]
    },
    {
        id: "122",
        name: "Авторский букет «Снежный вальс» с амариллисом и хризантемами",
        price: 9900,
        image: "./img/chrysanthemum/1762537315_28404399.jpg",
        width: 50,
        height: 60,
        category: ["chrysanthemum", "premium"],
        occasion: "valentine",
        label: "premium",
        description: "Авторский букет с разнообразным составом станет отличным подарком по любому поводу.",
        composition: "Хризантема одноголовая - 3 шт., Эвкалипт Цинерея - 4 шт.",
        gallery: ["./img/chrysanthemum/1762537315_28404399.jpg"]
    },
    {
        id: "123",
        name: "Осенний букет пионовидные розы хризантемы ветки шиповника",
        price: 9500,
        image: "./img/chrysanthemum/1728826558_52668254.jpg",
        width: 36,
        height: 45,
        category: ["chrysanthemum", "premium"],
        occasion: "birthday",
        label: "premium",
        description: "В странах Востока тюльпан наряду с королевой цветов розой считается цветком счастья, любви и благополучия.",
        composition: "Тюльпан желтый - 101 шт., Фоамиран (упаковка) - 1 шт.",
        gallery: ["./img/chrysanthemum/1728826558_52668254.jpg"]
    },
    {
        id: "160",
        name: "Букет из белых тюльпанов и желтых нарциссов",
        price: 10800,
        image: "./img/daffodils/1743429438_93168252.jpg",
        width: 30,
        height: 30,
        category: "daffodils",
        occasion: "mothers-day",
        label: "sale",
        description: "Лёгкий и воздушный, как утренний бриз — букет из желтых нарциссов и тюльпанов создан, чтобы радовать с первого взгляда.",
        composition: "Нарцисс - 10 шт., Тюльпан белый - 29 шт.,",
        gallery: ["./img/daffodils/1743429438_93168252.jpg"]
    },
    {
        id: "161",
        name: "Букет из нарциссов и душистого горошка",
        price: 20000,
        image: "./img/daffodils/photo_2025-11-20_00-39-21.jpg",
        width: 30,
        height: 45,
        category: "daffodils",
        occasion: "mothers-day",
        label: "sale",
        description: "Этот нежный букет — воплощение весенней свежести и утонченной красоты.",
        composition: "30 душистых горошков.,  29 нарциссов.",
        gallery: ["./img/daffodils/photo_2025-11-20_00-39-21.jpg"]
    },
    {
        id: "162",
        name: "Корзина с нарциссами и тюльпанами",
        price: 14000,
        image: "./img/daffodils/1737816181_51893088.jpg",
        width: 38,
        height: 40,
        category: "daffodils",
        occasion: "birthday",
        label: "hot",
        description: "Нежный букет в оранжевых тонах из хризантем",
        composition: "нарцисс желтый кустовой - 7 шт., тюльпаны - 21 шт., нарциссы желтые одноголовые - 11 шт.",
        gallery: ["./img/daffodils/1737816181_51893088.jpg"]
    },
    {
        id: "163",
        name: "Белые нарциссы в коробке",
        price: 20400,
        image: "./img/daffodils/1700817233_91629848.jpg",
        width: 30,
        height: 50,
        category: "daffodils",
        occasion: "birthday",
        label: "hot",
        description: "Букет будет уже на воде, в коробке, вы можете из коробки его достать и поставить в вазу",
        composition: "нарциссы кустовые - 50 шт.",
        gallery: ["./img/daffodils/1700817233_91629848.jpg"]
    },
    {
        id: "164",
        name: "Корзина с тюльпанами, нарциссами и гиацинтами",
        price: 14100,
        image: "./img/daffodils/1738565883_77530200.jpg",
        width: 35,
        height: 45,
        category: "daffodils",
        occasion: "congratulations",
        label: "new",
        description: "В его составе яркие нарциссы и ароматные тюльпаны с гиацинтами.",
        composition: "Гиацинт - 7 шт., Мускари Блю - 5 шт., нарциссы кустовые - 7 шт., тюльпаны энкель - 17 шт.",
        gallery: ["./img/daffodils/1738565883_77530200.jpg"]
    },
    {
        id: "165",
        name: "Букет из весенних цветов Золотистые тюльпаны и нарциссы",
        price: 9600,
        image: "./img/daffodils/1743687101_40840459.jpg",
        width: 35,
        height: 35,
        category: "daffodils",
        occasion: "congratulations",
        label: "new",
        description: "Букет из весенних цветов Золотистые тюльпаны и нарциссы - это уникальное сочетание красоты и свежести.",
        composition: "Нарцисс - 21 шт., Тюльпан - 20 шт.",
        gallery: ["./img/daffodils/1743687101_40840459.jpg"]
    },
    {
        id: "166",
        name: "Букет из кустовых нарциссов",
        price: 17500,
        image: "./img/daffodils/1223y.jpg",
        width: 25,
        height: 30,
        category: "daffodils",
        occasion: "congratulations",
        label: "new",
        description: "Этот нежный и воздушный букет создан с любовью и заботой.",
        composition: "нарциссы кустовые микс - 51 шт.",
        gallery: ["./img/daffodils/1223y.jpg"]
    },
    {
        id: "167",
        name: "Букет из нарциссов и вербы",
        price: 15200,
        image: "./img/daffodils/photo_2025-11-20_00-52-52.jpg",
        width: 20,
        height: 35,
        category: "daffodils",
        occasion: "mothers-day",
        label: "new",
        description: "Нежный букет, наполненный духом Пасхи из сезонных нарциссов и пушистой вербы.",
        composition: "19 нарциссов + верба",
        gallery: ["./img/daffodils/photo_2025-11-20_00-52-52.jpg"]
    },
    {
        id: "168",
        name: "Букет из кустовых нарциссов и дельфиниума",
        price: 11400,
        image: "./img/daffodils/photo_2025-11-20_00-55-41.jpg",
        width: 30,
        height: 40,
        category: "daffodils",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из кустовых нарциссов и дельфиниума похож на яркое звездное небо.",
        composition: "Кустовых нарциссов + 10 дельфиниумов + зелень",
        gallery: ["./img/daffodils/photo_2025-11-20_00-55-41.jpg"]
    },
    {
        id: "183",
        name: "Букет из 15 синих гиацинтов с эрингиумом и лагурусом",
        price: 9100,
        image: "./img/hyacinths/1763365350_65482889.jpg",
        width: 35,
        height: 40,
        category: "hyacinths",
        occasion: "mothers-day",
        label: "sale",
        description: "Букет из синих гиацинтов, который приближает весну и в душе, и в сердце.",
        composition: "Гиацинты - 15 шт., Лагурус - 12 шт., Салал Экстра - 15 шт.",
        gallery: ["./img/hyacinths/1763365350_65482889.jpg"]
    },
    {
        id: "184",
        name: "Нежный букет из розовых гиацинтов",
        price: 5600,
        image: "./img/hyacinths/1705757506_8754570.jpg",
        width: 25,
        height: 30,
        category: "hyacinths",
        occasion: "mothers-day",
        label: "sale",
        description: "Очень нежный розовый букет из гиацинтов и маттиолы.",
        composition: "маттиола кустовая розовая - 5 шт., гиацинты розовые - 25 шт.",
        gallery: ["./img/hyacinths/1705757506_8754570.jpg"]
    },
    {
        id: "185",
        name: "Гиацинты, тюльпаны и антуриум",
        price: 7600,
        image: "./img/hyacinths/1763037460_47821987.jpg",
        width: 30,
        height: 43,
        category: "hyacinths",
        occasion: "birthday",
        label: "hot",
        description: "Этот изысканный букет сочетает в себе яркую свежесть и элегантность.",
        composition: "Гиацинт синий - 7 шт., Тюльпан - 11 шт.",
        gallery: ["./img/hyacinths/1763037460_47821987.jpg"]
    },
    {
        id: "186",
        name: "Мини-букет комплимент (розовые гиацинты и пионовидные тюльпаны)",
        price: 5200,
        image: "./img/hyacinths/1762493448_41013761.jpg",
        width: 21,
        height: 35,
        category: "hyacinths",
        occasion: "birthday",
        label: "hot",
        description: "Красивый и яркий букет из пионовидных тюльпанов и розовых гиацинтов.",
        composition: "Тюльпан Пионовидный - 11 шт., Гиацинты - 8 шт.",
        gallery: ["./img/hyacinths/1762493448_41013761.jpg"]
    },
    {
        id: "187",
        name: "Букет из синих гиацинтов с кустовой розой",
        price: 13400,
        image: "./img/hyacinths/1739711207_44618569.jpg",
        width: 30,
        height: 30,
        category: "hyacinths",
        occasion: "congratulations",
        label: "new",
        description: "Милый Букет из ароматных синих гиацинтов с кустовой розой",
        composition: "Гиацинт синий - 25 шт., Роза кустовая кремовая - 10 шт.",
        gallery: ["./img/hyacinths/1739711207_44618569.jpg"]
    },
    {
        id: "188",
        name: "Сборный букет из гиацинтов и тюльпанов",
        price: 18000,
        image: "./img/hyacinths/1710187896_98316589.jpg",
        width: 35,
        height: 35,
        category: "hyacinths",
        occasion: "congratulations",
        label: "new",
        description: "Нежный и очень элегантный букет из супер стойких цветов в стильном исполнении будет отличным комплиментом для ценителей красоты и искусства.",
        composition: "Гиацинт синий - 25 шт., тюльпан пионовидный каламбус - 50 шт.",
        gallery: ["./img/hyacinths/1710187896_98316589.jpg"]
    },
    {
        id: "189",
        name: "Нежные тюльпаны с гиацинтом",
        price: 10600,
        image: "./img/hyacinths/1733947058_74462162.jpg",
        width: 32,
        height: 45,
        category: "hyacinths",
        occasion: "congratulations",
        label: "new",
        description: "Наши Premium букеты собраны из наисвежайших цветов и оформлены профессиональными флористами, чтобы подарить Вам и Вашим близким незабываемые моменты радости и красоты.",
        composition: "Тюльпан - 15 шт., Гиацинт - 8 шт.,",
        gallery: ["./img/hyacinths/1733947058_74462162.jpg"]
    },
    {
        id: "190",
        name: "Миниатюрный букет синие гиацинты и ромашки",
        price: 4800,
        image: "./img/hyacinths/1762545395_91909827.jpg",
        width: 21,
        height: 35,
        category: "hyacinths",
        occasion: "mothers-day",
        label: "new",
        description: "Красивый и яркий миниатюрный букет из кустовых ромашек и синих гиацинтов.",
        composition: "Ромашка кустовая - 4 шт., Гиацинты - 9 шт.",
        gallery: ["./img/hyacinths/1762545395_91909827.jpg"]
    },
    {
        id: "191",
        name: "Букет из гиацинтов и лилий",
        price: 18500,
        image: "./img/hyacinths/1757616475_52854669.jpg",
        width: 30,
        height: 25,
        category: "hyacinths",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из лилий и гиацинтов — гармоничное сочетание ярких ароматов и нежных оттенков для особого случая.",
        composition: "Тюльпан - 15 шт., Эвкалипт - 4 шт., Эустома - 4 шт.",
        gallery: ["./img/hyacinths/1757616475_52854669.jpg"]
    },
    {
        id: "192",
        name: "Букет Морской бриз",
        price: 9600,
        image: "./img/hyacinths/1744714226_88167304.jpg",
        width: 35,
        height: 40,
        category: "hyacinths",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из гармоничного сочетания ярких ароматов и нежных оттенков для особого случая.",
        composition: "Гиацинт - 19 шт., Эвкалипт - 10 шт.",
        gallery: ["./img/hyacinths/1744714226_88167304.jpg"]
    },
    {
        id: "193",
        name: "Корзина с цветами",
        price: 44000,
        image: "./img/hyacinths/1653419591_90313553.jpg",
        width: 70,
        height: 50,
        category: ["hyacinths", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Огромный букет покорятит не только своим ароматом и красотой, но и стойкостью.",
        composition: "Гиацинт - 8 шт., Маттиола - 16 шт., Пион - 7 шт., Роза - 12 шт., Эустома - 16 шт.",
        gallery: ["./img/hyacinths/1653419591_90313553.jpg"]
    },
    {
        id: "194",
        name: "Тюльпаны с гиацинтами в корзине",
        price: 33000,
        image: "./img/hyacinths/1734937314_96999477.jpg",
        width: 40,
        height: 40,
        category: ["hyacinths", "premium"],
        occasion: "birthday",
        label: "luxury",
        description: "Красивая свежая весенняя композиция в корзине из пионовидных голландских тюльпанов и голландских гиацинтов.",
        composition: "Гиацинты Микс - 50 шт., тюльпан пионовидный коламбус - 50 шт.",
        gallery: ["./img/hyacinths/1734937314_96999477.jpg"]
    },
    {
        id: "195",
        name: "Прекрасная композиция",
        price: 54000,
        image: "./img/hyacinths/1706682857_30446156.jpg",
        width: 45,
        height: 45,
        category: ["hyacinths", "premium"],
        occasion: "valentine",
        label: "premium",
        description: "Красивая свежая весенняя композиция в корзине",
        composition: "Гиацинт микс - 51 шт., Оазис флористический - 5 шт.",
        gallery: ["./img/hyacinths/1706682857_30446156.jpg"]
    },
    {
        id: "196",
        name: "Гиацинт микс",
        price: 29700,
        image: "./img/hyacinths/1740826979_93071492.jpg",
        width: 45,
        height: 30,
        category: ["hyacinths", "premium"],
        occasion: "birthday",
        label: "premium",
        description: "Гиацинт микс",
        composition: "Гиацинт микс - 75 шт.",
        gallery: ["./img/hyacinths/1740826979_93071492.jpg"]
    },
    {
        id: "220",
        name: "Дуо букет «Лавандовый раф» из нежной гортензии и гипсофилы",
        price: 3500,
        image: "./img/gypsophila/1709582055_656323226569.jpg",
        width: 25,
        height: 30,
        category: "gypsophila",
        occasion: "mothers-day",
        label: "sale",
        description: "Букет который приближает весну и в душе, и в сердце.",
        composition: "Гипсофила - 2 шт., Гортензия - 1 шт.",
        gallery: ["./img/gypsophila/1709582055_656323226569.jpg"]
    },
    {
        id: "221",
        name: "Разноцветная гипсофила в коробке",
        price: 2600,
        image: "./img/gypsophila/1674751364_9868607.jpg",
        width: 20,
        height: 25,
        category: "gypsophila",
        occasion: "mothers-day",
        label: "sale",
        description: "Радужная гипсофила в коробке отличается своей яркостью, долговечностью и красотой",
        composition: "цветная гипсофила - 7 шт., Оазис флористический - 1 шт.",
        gallery: ["./img/gypsophila/1674751364_9868607.jpg"]
    },
    {
        id: "222",
        name: "Букет Космические орхидеи Дендробиум в сочетании с гипсофилой",
        price: 3700,
        image: "./img/gypsophila/1710166159_81012845.jpg",
        width: 25,
        height: 43,
        category: "gypsophila",
        occasion: "birthday",
        label: "hot",
        description: "Экзотический с орхидеей дендробиумом - это уникальный и изысканный подарок, который станет настоящим украшением любого интерьера.",
        composition: "Гипсофила - 3 шт., Орхидея дендробиум синяя - 6 шт.",
        gallery: ["./img/gypsophila/1710166159_81012845.jpg"]
    },
    {
        id: "223",
        name: "Авторский букет из гортензии, кустовой хризантемы и гипсофилы «Пинк»",
        price: 2500,
        image: "./img/gypsophila/1740306898_11198239.jpg",
        width: 35,
        height: 40,
        category: "gypsophila",
        occasion: "birthday",
        label: "hot",
        description: "Красивый и яркий букет из гортензии и гипсофилы.",
        composition: "Гипсофила - 2 шт., Гортензия - 1 шт., Хризантема кустовая - 1 шт.",
        gallery: ["./img/gypsophila/1740306898_11198239.jpg"]
    },
    {
        id: "224",
        name: "Сумочка из гипсофилы",
        price: 1900,
        image: "./img/gypsophila/1760608506_1892808.jpg",
        width: 30,
        height: 30,
        category: "gypsophila",
        occasion: "congratulations",
        label: "new",
        description: "Пусть композиция радует вас дольше!",
        composition: "Гипсофила - 4 шт., Оазис флористический - 1 шт.",
        gallery: ["./img/gypsophila/1760608506_1892808.jpg"]
    },
    {
        id: "225",
        name: "Радужная гипсофила",
        price: 5400,
        image: "./img/gypsophila/1682618315_85729795.jpg",
        width: 35,
        height: 45,
        category: "gypsophila",
        occasion: "congratulations",
        label: "new",
        description: "Этот нежный и воздушный букет из разноцветной гипсофилы – словно облако из сказки.",
        composition: "Гипсофила - 11 шт., Упаковка дизайнерская - 4 шт.",
        gallery: ["./img/gypsophila/1682618315_85729795.jpg"]
    },
    {
        id: "226",
        name: "Нежнейший букет кустовых роз с воздушной гипсофилой",
        price: 4300,
        image: "./img/gypsophila/1763471510_18008309.jpg",
        width: 35,
        height: 50,
        category: "gypsophila",
        occasion: "congratulations",
        label: "new",
        description: "Данный букет станет прекрасным поводом порадовать близкого человека, подарить прекрасное настроение",
        composition: "Гипсофила - 2 шт., Роза кустовая пионовидная джульетта - 3 шт.",
        gallery: ["./img/gypsophila/1763471510_18008309.jpg"]
    },
    {
        id: "227",
        name: "Огромный Букет из разноцветных гипсофил",
        price: 18000,
        image: "./img/gypsophila/1728716779_17020972.jpg",
        width: 75,
        height: 70,
        category: "gypsophila",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из 49 разноцветной гипсофилы — это пышный и изысканный подарок, который подойдёт для любого повода.",
        composition: "Гипсофила - 49 шт., Упаковка - 8 шт.",
        gallery: ["./img/gypsophila/1728716779_17020972.jpg"]
    },
    {
        id: "228",
        name: "Зимний букет из нобилиса с Гипсофилой и хлопком",
        price: 8300,
        image: "./img/gypsophila/1701937302_89893220.jpg",
        width: 65,
        height: 55,
        category: "gypsophila",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из лилий и гиацинтов — гармоничное сочетание ярких ароматов и нежных оттенков для особого случая.",
        composition: "Тюльпан - 15 шт., Эвкалипт - 4 шт., Эустома - 4 шт.",
        gallery: ["./img/gypsophila/1701937302_89893220.jpg"]
    },
    {
        id: "229",
        name: "Шоколадные гвоздики с гипсофилой",
        price: 4500,
        image: "./img/gypsophila/1738854228_74156636.jpg",
        width: 25,
        height: 40,
        category: "gypsophila",
        occasion: "mothers-day",
        label: "new",
        description: "Букет из гармоничного сочетания ярких ароматов и нежных оттенков для особого случая.",
        composition: "Гипсофила - 3 шт., Гвоздика - 11 шт.",
        gallery: ["./img/gypsophila/1738854228_74156636.jpg"]
    },
    {
        id: "230",
        name: "Композиция ЛАБУБА из гипсофилы",
        price: 40000,
        image: "./img/gypsophila/1756388125_73848024.jpg",
        width: 25,
        height: 40,
        category: ["gypsophila", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Популярная игрушка из гипсофилы украсит любой интерьер",
        composition: "Гипсофила - 40 шт., Оазис - 1 шт.",
        gallery: ["./img/gypsophila/1756388125_73848024.jpg"]
    },
    {
        id: "231",
        name: "Гипсофила радужная 75",
        price: 21000,
        image: "./img/gypsophila/1744834497_40226522.jpg",
        width: 100,
        height: 70,
        category: ["gypsophila", "premium"],
        occasion: "birthday",
        label: "luxury",
        description: "Этот нежный и изящный букет содержит 75 штук гипсофилы красной и зеленой расцветки.",
        composition: "гипсофила радужная - 75 шт., упаковка дизайнерская нежно розовая - 10 шт.",
        gallery: ["./img/gypsophila/1744834497_40226522.jpg"]
    },
    {
        id: "232",
        name: "Букет с ранункулюсами/лютиками и гипсофилой",
        price: 13900,
        image: "./img/gypsophila/1645966181_17964033.jpg",
        width: 45,
        height: 55,
        category: ["gypsophila", "premium"],
        occasion: "valentine",
        label: "premium",
        description: "Красивая свежая весенняя композиция в корзине",
        composition: "Лютики - 11 шт., Гипсофила - 5 шт.",
        gallery: ["./img/gypsophila/1645966181_17964033.jpg"]
    },
    {
        id: "233",
        name: "Гипсофила сиреневая",
        price: 12700,
        image: "./img/gypsophila/1736760749_91108405.jpg",
        width: 45,
        height: 47,
        category: ["gypsophila", "premium"],
        occasion: "birthday",
        label: "premium",
        description: "Гиацинт микс",
        composition: "Гиацинт микс - 75 шт.",
        gallery: ["./img/gypsophila/1736760749_91108405.jpg"]
    },
    {
        id: "256",
        name: "Ромашки и солнечные подсолнухи",
        price: 6000,
        image: "./img/daisies/1760608506_1234892808.jpg",
        width: 30,
        height: 50,
        category: "daisies",
        occasion: "mothers-day",
        label: "sale",
        description: "Букет который приближает лету и в душе, и в сердце.",
        composition: "Танацетум - 3 шт., Подсолнух - 9 шт.",
        gallery: ["./img/daisies/1760608506_1234892808.jpg"]
    },
    {
        id: "257",
        name: "Букет кустовых роз и ромашки",
        price: 4200,
        image: "./img/daisies/1651470988_21123528.jpg",
        width: 26,
        height: 37,
        category: "daisies",
        occasion: "mothers-day",
        label: "sale",
        description: "Этот букет сочетает в себе нежные ромашки и красивые кустовые розы.",
        composition: "Кустовая роза - 5 шт., Ромашка - 6 шт.",
        gallery: ["./img/daisies/1651470988_21123528.jpg"]
    },
    {
        id: "258",
        name: "Корзина с кустовой ромашкой и тласпией.",
        price: 5700,
        image: "./img/daisies/1684831881_67267603.jpg",
        width: 35,
        height: 30,
        category: "daisies",
        occasion: "birthday",
        label: "hot",
        description: "Это уникальный и изысканный подарок, который станет настоящим украшением любого интерьера.",
        composition: "Ромашка камилла - 15 шт.",
        gallery: ["./img/daisies/1684831881_67267603.jpg"]
    },
    {
        id: "259",
        name: "Нежный букет гортензия хризантемы ромашка",
        price: 2500,
        image: "./img/daisies/1751745549_96371221.jpg",
        width: 28,
        height: 45,
        category: "daisies",
        occasion: "birthday",
        label: "hot",
        description: "Белоснежный букет комплимент, Гортензия, Хризантемы, ромашка",
        composition: "Гортензия - 1 шт., Танацетум - 2 шт., Тишью - 1 шт.",
        gallery: ["./img/daisies/1751745549_96371221.jpg"]
    },
    {
        id: "260",
        name: "Букет Эустома с ромашкой",
        price: 3100,
        image: "./img/daisies/1761385894_42789430.jpg",
        width: 20,
        height: 50,
        category: "daisies",
        occasion: "congratulations",
        label: "new",
        description: "Пусть композиция радует вас дольше!",
        composition: "Ромашка - 5 шт., Эустома - 5 шт.",
        gallery: ["./img/daisies/1761385894_42789430.jpg"]
    },
    {
        id: "261",
        name: "Французские Розы с рамашками",
        price: 5400,
        image: "./img/daisies/1751708574_20019198.jpg",
        width: 45,
        height: 35,
        category: "daisies",
        occasion: "congratulations",
        label: "new",
        description: "Великолепный букет из чувственных французских роз с волнительными кустовыми ромашками идеальный букет чтобы подчеркнуть свою любовь!",
        composition: "ромашки кустовые - 5 шт., французские розы джумилия - 9 шт.",
        gallery: ["./img/daisies/1751708574_20019198.jpg"]
    },
    {
        id: "262",
        name: "Нежная композиция с пионовидной розой, ромашкой и ветками Солидаго",
        price: 5500,
        image: "./img/daisies/1763474823_57696068.jpg",
        width: 35,
        height: 30,
        category: "daisies",
        occasion: "congratulations",
        label: "new",
        description: "Идеально подходит в качестве подарка для коллеги, мамы или сестры.",
        composition: "Ромашка - 5 шт., Гвоздика - 5 шт.",
        gallery: ["./img/daisies/1763474823_57696068.jpg"]
    },
    {
        id: "263",
        name: "Хризантема кустовая и ромашки в коробке",
        price: 2900,
        image: "./img/daisies/1757417230_68360632.jpg",
        width: 30,
        height: 30,
        category: "daisies",
        occasion: "mothers-day",
        label: "new",
        description: "Пышный и изысканный подарок, который подойдёт для любого повода.",
        composition: "Гипсофила - 49 шт., Упаковка - 8 шт.",
        gallery: ["./img/daisies/1757417230_68360632.jpg"]
    },
    {
        id: "264",
        name: "Букет из пионовидной розы Мандарин и кустовой ромашки",
        price: 5400,
        image: "./img/daisies/1754403123_8644389.jpg",
        width: 28,
        height: 40,
        category: "daisies",
        occasion: "mothers-day",
        label: "new",
        description: "Яркий и жизнерадостный букет, сочетающий тёплые оттенки пионовидной розы «Мандарин» с трогательными ромашками.",
        composition: "Ромашка кустовая - 6 шт., роза пионовидная мандарин - 7 шт.",
        gallery: ["./img/daisies/1754403123_8644389.jpg"]
    },
    {
        id: "265",
        name: "Сантини и ромашки в композиции Летнее утро",
        price: 3200,
        image: "./img/daisies/1716653224_69302214.jpg",
        width: 20,
        height: 23,
        category: "daisies",
        occasion: "mothers-day",
        label: "new",
        description: "Небольшой, но милый букет для создания приятной атмосферы любом пространстве!)",
        composition: "Ромашка - 4 шт., Сантини - 5 шт.",
        gallery: ["./img/daisies/1716653224_69302214.jpg"]
    },
    {
        id: "266",
        name: "Букет из 101 ромашки",
        price: 24000,
        image: "./img/daisies/1723268590_1286315.jpg",
        width: 55,
        height: 65,
        category: ["daisies", "premium"],
        occasion: "congratulations",
        label: "premium",
        description: "Шикарный букет из 101ромашек удивит и растрогает любую девушку, предпочитающую миловидную романтику.",
        composition: "Ромашка - 101 шт., Дизайнерская упаковка - 10 шт.",
        gallery: ["./img/daisies/1723268590_1286315.jpg"]
    },
    {
        id: "267",
        name: "Ромашка орхидея в корзине",
        price: 23100,
        image: "./img/daisies/1748376450_31162890.jpg",
        width: 46,
        height: 28,
        category: ["daisies", "premium"],
        occasion: "birthday",
        label: "luxury",
        description: "Букет цветов является универсальным способом выразить чувства, поскольку каждый цветок и цвет несет определенный символический смысл, а сами цветы способны передать эмоции, которые сложно выразить словами",
        composition: "Эвкалипт - 8 шт., Орхидея Цимбидиум - 19 шт., камилла ромашка - 15 шт.",
        gallery: ["./img/daisies/1748376450_31162890.jpg"]
    },
    {
        id: "268",
        name: "Пионы с ромашкой",
        price: 22900,
        image: "./img/daisies/1747317126_95671235.jpg",
        width: 30,
        height: 50,
        category: ["daisies", "premium"],
        occasion: "valentine",
        label: "premium",
        description: "Красивая свежая весенняя композиция.",
        composition: "Ромашка кустовая - 8 шт., Пион Сара Бернар - 21 шт.",
        gallery: ["./img/daisies/1747317126_95671235.jpg"]
    },
    {
        id: "269",
        name: "Крымские хризантемы с ромашкой",
        price: 12700,
        image: "./img/daisies/1761666986_66410395.jpg",
        width: 50,
        height: 55,
        category: ["daisies", "premium"],
        occasion: "birthday",
        label: "premium",
        description: "Красивый нежный букет из нежных ромашек с хризантемами.",
        composition: "Ромашка кустовая - 25 шт., крымская хризантема - 21 шт.",
        gallery: ["./img/daisies/1761666986_66410395.jpg"]
    },
    {
        id: "300",
        name: "Орхидея с маттиолой в сумочке",
        price: 5800,
        image: "./img/orchid/1700902281_85901457.jpg",
        width: 45,
        height: 45,
        category: "orchid",
        occasion: "mothers-day",
        label: "sale",
        description: "Стильная композиция в сумочке , порадует вашего близкого человека и станет отличным подарком на любое торжество",
        composition: "Орхидея Цимбидиум розовая - 3 шт., диантус сортовой крашеный - 3 шт., Гортензия розовая - 1 шт.",
        gallery: ["./img/orchid/1700902281_85901457.jpg"]
    },
    {
        id: "301",
        name: "Букет белых орхидей",
        price: 4500,
        image: "./img/orchid/1749399824_74092413.jpg",
        width: 26,
        height: 37,
        category: "orchid",
        occasion: "mothers-day",
        label: "sale",
        description: "Нежный и изысканный букет, состоящий из прекрасных орхидей и свежих веточек эвкалипта.",
        composition: "Орхидея Цимбидиум - 7 шт., Эвкалипт - 5 шт.",
        gallery: ["./img/orchid/1749399824_74092413.jpg"]
    },
    {
        id: "302",
        name: "Букет розовых орхидей",
        price: 5800,
        image: "./img/orchid/1677046705_74806556.jpg",
        width: 40,
        height: 45,
        category: "orchid",
        occasion: "birthday",
        label: "hot",
        description: "Этот шикарный букет порадует вашу маму и бабушку.",
        composition: "Орхидея Цимбидиум - 11 шт., удлинитель для орхидеи - 11 шт.",
        gallery: ["./img/orchid/1677046705_74806556.jpg"]
    },
    {
        id: "303",
        name: "Необычная композиция из Орхидей «Галактика»",
        price: 5400,
        image: "./img/orchid/1693397888_70200839.jpg",
        width: 31,
        height: 40,
        category: "orchid",
        occasion: "birthday",
        label: "hot",
        description: "Композия из Экзотических Орхидей Дендробиум и ароматного Эвкалипта в крафтовой упаковке.",
        composition: "Гортензия - 1 шт., Танацетум - 2 шт., Тишью - 1 шт.",
        gallery: ["./img/orchid/1693397888_70200839.jpg"]
    },
    {
        id: "304",
        name: "Авторский букет Кантри Блю и орхидея цимбидиум",
        price: 6600,
        image: "./img/orchid/1673694695_87590149.jpg",
        width: 40,
        height: 50,
        category: "orchid",
        occasion: "congratulations",
        label: "new",
        description: "Лучшее поздравление для любимой девушки.",
        composition: "Орхидея Цимбидиум - 5 шт., Тласпи - 3 шт.",
        gallery: ["./img/orchid/1673694695_87590149.jpg"]
    },
    {
        id: "305",
        name: "Букет из розовых орхидей и кустовых пионовидных роз менсфилд",
        price: 4900,
        image: "./img/orchid/1756759033_46150810.jpg",
        width: 25,
        height: 35,
        category: "orchid",
        occasion: "congratulations",
        label: "new",
        description: "Букет из розовых орхидей и нежных кустовых пионовидных роз с веточками эвкалипта в стильной упаковке.",
        composition: "Орхидея Цимбидиум - 3 шт., Эвкалипт - 5 шт., менсфилд парк кустовая пионовидная - 5 шт.",
        gallery: ["./img/orchid/1756759033_46150810.jpg"]
    },
    {
        id: "306",
        name: "Орхидея розы и статица",
        price: 5500,
        image: "./img/orchid/1763212872_32735739.jpg",
        width: 25,
        height: 38,
        category: "orchid",
        occasion: "congratulations",
        label: "new",
        description: "Восхитительная пионовидная Роза и подобранные ей по оттенку орхидеи никого не оставят равнодушной.",
        composition: "Орхидея цимбидиум бутон - 3 шт., роза реджентс парк розовая - 5 шт., Статица - 4 шт.",
        gallery: ["./img/orchid/1763212872_32735739.jpg"]
    },
    {
        id: "307",
        name: "Цветы в коробке «Микс Орхидей»",
        price: 3900,
        image: "./img/orchid/1621606782_89075817.jpg",
        width: 35,
        height: 35,
        category: "orchid",
        occasion: "mothers-day",
        label: "new",
        description: "Пышный и изысканный подарок, который подойдёт для любого повода.",
        composition: "Статица синяя - 3 шт., Пистация - 5 шт.",
        gallery: ["./img/orchid/1621606782_89075817.jpg"]
    },
    {
        id: "308",
        name: "Орхидея Цимбидиум",
        price: 28000,
        image: "./img/orchid/1719585596_58100867.jpg",
        width: 60,
        height: 85,
        category: "orchid",
        occasion: "mothers-day",
        label: "new",
        description: "Орхидея Цимбидиум премиум- стойкий цветок с нежным ароматом",
        composition: "Орхидея Цимбидиум ветка - 5 шт., Упаковка дизайнерская - 3 шт.",
        gallery: ["./img/orchid/1719585596_58100867.jpg"]
    },
    {
        id: "309",
        name: "Коробка из белоснежных орхидей",
        price: 62000,
        image: "./img/orchid/1753474553_27337944.jpg",
        width: 70,
        height: 63,
        category: "orchid",
        occasion: "mothers-day",
        label: "new",
        description: "Роскошная,премиальная коробка с нереальными орхидеями фаленопсис премиум",
        composition: "Орхидея Фаленопсис ветка - 35 шт.",
        gallery: ["./img/orchid/1753474553_27337944.jpg"]
    },
    {
        id: "310",
        name: "Букет цветов в корзине роза пионовидная кустовая орхидея озотамнус",
        price: 25000,
        image: "./img/orchid/1743694538_48839958.jpg",
        width: 45,
        height: 45,
        category: "orchid",
        occasion: "mothers-day",
        label: "new",
        description: "Букет цветов является универсальным способом выразить чувства, поскольку каждый цветок и цвет несет определенный символический смысл, а сами цветы способны передать эмоции, которые сложно выразить словами",
        composition: "Орхидея Цимбидиум - 9 шт., Озотамнус - 4 шт., Роза пионовидная кустовая - 19 шт.",
        gallery: ["./img/orchid/1743694538_48839958.jpg"]
    },
    {
        id: "311",
        name: "Орхидея цимбидиум, розы и тыковки в композиции Осенний карнавал",
        price: 24000,
        image: "./img/orchid/1757758332_12009950.jpg",
        width: 55,
        height: 50,
        category: "orchid",
        occasion: "mothers-day",
        label: "new",
        description: "Осенний карнавал невероятных красок в нарядной композиции.",
        composition: "Орхидея Цимбидиум - 13 шт., Роза кустовая - 4 шт., Аспидистра - 9 шт.",
        gallery: ["./img/orchid/1757758332_12009950.jpg"]
    },
    {
        id: "312",
        name: "Букет цветов из белых роз, орхидей и эустом «Оксфорд»",
        price: 22900,
        image: "./img/protea/1598107103_66550740.jpg",
        width: 60,
        height: 63,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Роскошная,премиальная коробка с нереальными орхидеями фаленопсис премиум",
        composition: "Аспидистра - 11 шт., Лимониум - 5 шт., орхидея белая цимбидиум - 11 шт., роза белая одноголовая аваланж - 16 шт.",
        gallery: ["./img/protea/1598107103_66550740.jpg"]
    },
    {
        id: "313",
        name: "Букет королевская протея",
        price: 12700,
        image: "./img/protea/1744066760_25237037.jpg",
        width: 55,
        height: 60,
        category: "protea",
        occasion: "mothers-day",
        label: "sale",
        description: "Букет премиум класса , королевская белая протея которая растет в южной Африки , изумительный редкий красивый цветок с дополняющими цветами как эрингиум",
        composition: "Рускус - 5 шт., маттиола кустовая белая - 3 шт., протея королевская белая - 1 шт.",
        gallery: ["./img/protea/1744066760_25237037.jpg"]
    },
    {
        id: "314",
        name: "Осенний букет из экзотических цветов. Протея, илекс, сафари, краспедия",
        price: 4500,
        image: "./img/protea/1761828608_20035160.jpg",
        width: 26,
        height: 37,
        category: "protea",
        occasion: "mothers-day",
        label: "sale",
        description: "Красивый стильный букет в изысканных оттенках бежевого, оранжевого и коричневых цветов.",
        composition: "протея розовая королевская - 1 шт., Диантус сортовой - 3 шт.",
        gallery: ["./img/protea/1761828608_20035160.jpg"]
    },
    {
        id: "315",
        name: "Букет из 3 протей и крашеного эвкалипта",
        price: 5900,
        image: "./img/protea/1745520781_56539576.jpg",
        width: 25,
        height: 45,
        category: "protea",
        occasion: "birthday",
        label: "hot",
        description: "Стильный букет из 3 королевских протей и контрастного черного эвкалипта.",
        composition: "Эвкалипт крашеный - 5 шт., Протея - 3 шт.",
        gallery: ["./img/protea/1745520781_56539576.jpg"]
    },
    {
        id: "316",
        name: "Букет из 5 протей",
        price: 14500,
        image: "./img/protea/1738096281_2642710.jpg",
        width: 31,
        height: 40,
        category: "protea",
        occasion: "birthday",
        label: "hot",
        description: "Букет из 5 королевских протей",
        composition: "протея королевская африканская - 5 шт., Матовая упаковка - 2 шт.",
        gallery: ["./img/protea/1738096281_2642710.jpg"]
    },
    {
        id: "317",
        name: "Букет: протея и одноголовые розы",
        price: 9700,
        image: "./img/protea/1761657690_2768330.jpg",
        width: 35,
        height: 40,
        category: "protea",
        occasion: "congratulations",
        label: "new",
        description: "Композиция представляет собой изысканный букет, наполненный гармонией нежных оттенков и текстур.",
        composition: "Протея - 1 шт., Эвкалипт - 10 шт.,одноголовая роза джульетта - 5 шт.",
        gallery: ["./img/protea/1761657690_2768330.jpg"]
    },
    {
        id: "318",
        name: "Протея, нутан, левкадендрон - экзотика из Африки",
        price: 11900,
        image: "./img/protea/1758966064_81037712.jpg",
        width: 25,
        height: 35,
        category: "protea",
        occasion: "congratulations",
        label: "new",
        description: "Мы позаботились о том, чтобы букет радовал",
        composition: "Протея - 2 шт., Нутан - 3 шт., левкадендрон - 4 шт.",
        gallery: ["./img/protea/1758966064_81037712.jpg"]
    },
    {
        id: "319",
        name: "Букет из трёх королевских протей",
        price: 11000,
        image: "./img/protea/1717523812_88550059.jpg",
        width: 25,
        height: 38,
        category: "protea",
        occasion: "congratulations",
        label: "new",
        description: "Восхитительная пионовидная Роза и подобранные ей по оттенку орхидеи никого не оставят равнодушной.",
        composition: "Протея - 3 шт.",
        gallery: ["./img/protea/1717523812_88550059.jpg"]
    },
    {
        id: "320",
        name: "Африканская роза (Протея) в ярком букете",
        price: 7200,
        image: "./img/protea/1751722551_67226204.jpg",
        width: 35,
        height: 42,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Погрузитесь в мир утонченной красоты с нашим уникальным букетом, в который гармонично сочетаются африканская роза Протея и нежные розы сорта Лондон Ай.",
        composition: "Протея - 1 шт.,Рускус - 2 шт., Роза кустовая пионовидная - 2 шт.",
        gallery: ["./img/protea/1751722551_67226204.jpg"]
    },
    {
        id: "321",
        name: "Букет с протеи",
        price: 28000,
        image: "./img/protea/1663182250_4911861.jpg",
        width: 60,
        height: 85,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Экзотический букет с протеи.,приведёт в восторг вашу избранницу.",
        composition: "протея премиум - 1 шт., альстромерия микс европа - 2 шт., Гермини - 4 шт.",
        gallery: ["./img/protea/1663182250_4911861.jpg"]
    },
    {
        id: "322",
        name: "Коробка из белоснежных орхидей",
        price: 62000,
        image: "./img/protea/1760773673_98571523.jpg",
        width: 35,
        height: 50,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Роскошная,премиальная коробка с нереальными цветами",
        composition: "Протея - 1 шт., Астильба - 10 шт., Скиммия - 10 шт., Гиперикум - 10 шт.",
        gallery: ["./img/protea/1760773673_98571523.jpg"]
    },
    {
        id: "323",
        name: "Букет цветов в корзине роза пионовидная кустовая орхидея озотамнус",
        price: 25000,
        image: "./img/protea/1760776744_21044660.jpg",
        width: 45,
        height: 60,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Шикарный экзотический авторский мужской букет с протеей, амариллисами, ягодами.",
        composition: "Протея - 1 шт.,Скиммия Рубелла - 3 шт., Амариллис Красный - 2 шт.,Эрингиум Синий - 2 шт.",
        gallery: ["./img/protea/1760776744_21044660.jpg"]
    },
    {
        id: "324",
        name: "Экзотический букет с протеей",
        price: 27800,
        image: "./img/protea/1630685267_26304903.jpg",
        width: 50,
        height: 45,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Букет наполнен экзотическими и необычными цветами",
        composition: "Протея - 5 шт., Эустома - 15 шт., Астильба - 20 шт.",
        gallery: ["./img/protea/1630685267_26304903.jpg"]
    },
    {
        id: "325",
        name: "Экзотический букет с протеей",
        price: 27800,
        image: "./img/protea/1680178989_66011205.jpg",
        width: 40,
        height: 40,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Экзотический букет",
        composition: "ЦИМБИДИУМ - 7 шт., панакома - 3 шт., Протея - 1 шт., Писташ - 4 шт.",
        gallery: ["./img/protea/1680178989_66011205.jpg"]
    },
    {
        id: "326",
        name: "Букет с протеей Пармиджано",
        price: 9200,
        image: "./img/protea/1683557904_34920539.jpg",
        width: 30,
        height: 40,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Бордовый букет с экзотической протеей, кофейными розами и леукадендроном.",
        composition: "протея розовая - 1 шт., Эрингиум Синий - 3 шт., Роза Капучино - 3 шт., гвоздика кокоа - 3 шт.",
        gallery: ["./img/protea/1683557904_34920539.jpg"]
    },
    {
        id: "327",
        name: "Замечательный букет протеи",
        price: 27800,
        image: "./img/protea/1750923527_87969158.jpg",
        width: 40,
        height: 40,
        category: "protea",
        occasion: "mothers-day",
        label: "new",
        description: "Подходит: для ярких событий, важных признаний, вдохновения и особых моментов.",
        composition: "протея розовая - 19 шт.",
        gallery: ["./img/protea/1750923527_87969158.jpg"]
    }
];

recommendedProducts = [
    {
        id: "r1",
        name: "Мыло ручной работы в коробочке",
        price: 600,
        image: "./img/soap/handmade-soap-ina-gift-box.jpg"
    },
    {
        id: "r2",
        name: "Подарочный набор с чаем",
        price: 3300,
        image: "./img/soap/gift-set-with-tea-and-bath-bomb.jpg"
    },
    {
        id: "r3",
        name: "Мишка мягкая игрушка",
        price: 9000,
        image: "./img/soap/mishka-is-a-soft-toy.jpg"
    },
    {
        id: "r4",
        name: "Корзина из мыла с сухоцветами",
        price: 6500,
        image: "./img/soap/soap-basket-with-dried-flowers.jpg"
    },
    {
        id: "r5",
        name: "Корзина с цветами и мылом",
        price: 4500,
        image: "./img/soap/with-flowers-and-handmade-soap.jpg"
    },
    {
        id: "r6",
        name: "Подарочный набор с морской солью",
        price: 3300,
        image: "./img/soap/gift-set-with-sea-salt.jpg"
    },
    {
        id: "r7",
        name: "Корзина розами из мыла",
        price: 8700,
        image: "./img/soap/soap-roses-41-pieces.jpg"
    },
    {
        id: "r8",
        name: "Мягкая игрушка медведь",
        price: 12200,
        image: "./img/soap/stuffed-bear.jpg"
    }
];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function generateUniqueRoses(startId, endId) {
    var categories = ["roses"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var roseImagesByColor = {
        "red": ["./img/rose/red-roses-classic.jpg"],
        "white": ["./img/rose/white-roses-classic.jpg"], 
        "pink": ["./img/rose/pink-roses-classic.jpg"],
        "orange": ["./img/rose/orange-roses-classic.jpg"],
        "blue": ["./img/rose/blue-roses-classic.jpg"]
    };
    
    var roseNamesByColor = {
        "red": ["Букет классических красных роз"],
        "white": ["Букет классических белых роз"],
        "pink": ["Букет классических розовых роз"],
        "orange": ["Букет классических оранжевых роз"],
        "blue": ["Букет классических синих роз"]
    };
    
    var descriptionsByColor = {
        "red": "Элегантные классические красные розы - символ страсти и любви. Идеальный подарок для особых моментов.",
        "white": "Нежные классические белые розы - символ чистоты и искренности. Прекрасный выбор для свадьбы или торжества.",
        "pink": "Романтические классические розовые розы - олицетворение нежности и восхищения. Идеальны для признания в чувствах.",
        "orange": "Энергичные классические оранжевые розы - символ энтузиазма и радости. Прекрасный способ поднять настроение.",
        "blue": "Эксклюзивные классические синие розы - символ загадочности и недостижимости. Уникальный и запоминающийся подарок."
    };
    
    var compositionsByColor = {
        "red": "Свежие классические красные розы высшего качества, дизайнерская упаковка, декоративная зелень",
        "white": "Свежие классические белые розы премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "pink": "Свежие классические розовые розы отборного качества, стильная упаковка, декоративные элементы",
        "orange": "Свежие классические оранжевые розы высшего сорта, яркая упаковка, праздничное оформление",
        "blue": "Эксклюзивные классические синие розы премиум-качества, дизайнерская упаковка, специальный уход"
    };
    
    var roseCountOptions = [
        { min: 101, max: 150, pricePerRose: 250, nameSuffix: "101-150 роз", size: "luxury" },
        { min: 50, max: 100, pricePerRose: 280, nameSuffix: "50-100 роз", size: "large" },
        { min: 15, max: 49, pricePerRose: 300, nameSuffix: "15-49 роз", size: "medium" },
        { min: 5, max: 14, pricePerRose: 350, nameSuffix: "5-14 роз", size: "small" }
    ];
    
    var colors = Object.keys(roseImagesByColor);
    var productIndex = 0;
    
    // Перебираем каждый цвет
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        // Для каждого цвета перебираем все размеры (4 категории)
        for (var o = 0; o < roseCountOptions.length; o++) {
            var option = roseCountOptions[o];
            
            // Случайный выбор количества в диапазоне
            var roseCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = roseImagesByColor[color];
            var image = colorImages[0];
            
            var packagingCost = 500;
            var price = (roseCount * option.pricePerRose) + packagingCost;
            
            var colorNames = roseNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + roseCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + roseCount + ' роз.';
            var composition = compositionsByColor[color] + ', ' + roseCount + ' шт.';
            
            // Случайный повод и метка
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 30 + Math.floor(Math.random() * 30),
                height: 25 + Math.floor(Math.random() * 25),
                category: "roses",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                roseCount: roseCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано роз:', productIndex);
}

function generateUniqueTulips(startId, endId) {
    var categories = ["tulips"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var tulipImagesByColor = {
        "white": ["./img/tulips/white-tulips-classic.jpg"],
        "pink": ["./img/tulips/pink-tulips-classic.jpg"], 
        "red": ["./img/tulips/red-tulips-classic.jpg"],
        "yellow": ["./img/tulips/yellow-tulips-classic.jpg"],
        "purple": ["./img/tulips/purple-tulips-classic.jpg"]
    };
    
    var tulipNamesByColor = {
        "white": ["Букет классических белых тюльпанов"],
        "pink": ["Букет классических розовых тюльпанов"],
        "red": ["Букет классических красных тюльпанов"],
        "yellow": ["Букет классических желтых тюльпанов"],
        "purple": ["Букет классических фиолетовых тюльпанов"]
    };
    
    var descriptionsByColor = {
        "white": "Нежные классические белые тюльпаны - символ чистоты и новых начинаний. Идеальный весенний подарок.",
        "pink": "Романтические классические розовые тюльпаны - олицетворение нежности и заботы. Прекрасный выбор для выражения симпатии.",
        "red": "Страстные классические красные тюльпаны - символ настоящей любви и страсти. Яркое признание в чувствах.",
        "yellow": "Солнечные классические желтые тюльпаны - символ радости, дружбы и хорошего настроения. Прекрасный способ поднять настроение.",
        "purple": "Загадочные классические фиолетовые тюльпаны - символ роскоши и королевской элегантности. Уникальный и изысканный подарок."
    };
    
    var compositionsByColor = {
        "white": "Свежие классические белые тюльпаны высшего качества, дизайнерская упаковка, декоративная зелень",
        "pink": "Свежие классические розовые тюльпаны премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "red": "Свежие классические красные тюльпаны отборного качества, стильная упаковка, декоративные элементы",
        "yellow": "Свежие классические желтые тюльпаны высшего сорта, яркая упаковка, праздничное оформление",
        "purple": "Эксклюзивные классические фиолетовые тюльпаны премиум-качества, дизайнерская упаковка, специальный уход"
    };
    
    var tulipCountOptions = [
        { min: 15, max: 25, pricePerTulip: 320, nameSuffix: "15-25 тюльпанов", size: "large" },
        { min: 10, max: 14, pricePerTulip: 230, nameSuffix: "10-14 тюльпанов", size: "medium" },
        { min: 5, max: 9, pricePerTulip: 256, nameSuffix: "5-9 тюльпанов", size: "small" }
    ];
    
    var colors = Object.keys(tulipImagesByColor);
    var productIndex = 0;
    
    // Перебираем каждый цвет
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        // Для каждого цвета перебираем все размеры (3 категории)
        for (var o = 0; o < tulipCountOptions.length; o++) {
            var option = tulipCountOptions[o];
            
            // Случайный выбор количества в диапазоне
            var tulipCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = tulipImagesByColor[color];
            var image = colorImages[0];
            
            var price = tulipCount * option.pricePerTulip;
            
            var colorNames = tulipNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + tulipCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + tulipCount + ' тюльпанов.';
            var composition = compositionsByColor[color] + ', ' + tulipCount + ' шт.';
            
            // Случайный повод и метка
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 25 + Math.floor(Math.random() * 20),
                height: 35 + Math.floor(Math.random() * 15),
                category: "tulips",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                tulipCount: tulipCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано тюльпанов:', productIndex);
}

function generateUniqueHyacinths(startId, endId) {
    var categories = ["hyacinths"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var hyacinthImagesByColor = {
        "blue": ["./img/hyacinths/1675230704_67307932.jpg"],
        "pink": ["./img/hyacinths/1740213046_89322307.jpg"], 
        "white": ["./img/hyacinths/1709582055_65626569.jpg"],
        "purple": ["./img/hyacinths/334444вываsic.jpg"],
        "yellow": ["./img/hyacinths/122c3lassic.jpg"]
    };
    
    var hyacinthNamesByColor = {
        "blue": ["Букет классических синих гиацинтов"],
        "pink": ["Букет классических розовых гиацинтов"],
        "white": ["Букет классических белых гиацинтов"],
        "purple": ["Букет классических фиолетовых гиацинтов"],
        "yellow": ["Букет классических желтых гиацинтов"]
    };
    
    var descriptionsByColor = {
        "blue": "Ароматные классические синие гиацинты - символ постоянства и верности. Их насыщенный цвет и нежный аромат создают атмосферу уюта и гармонии.",
        "pink": "Нежные классические розовые гиацинты - олицетворение романтики и игривости. Идеальный выбор для выражения нежных чувств и симпатии.",
        "white": "Элегантные классические белые гиацинты - символ чистоты, красоты и искренности. Прекрасный подарок для особых торжественных моментов.",
        "purple": "Благородные классические фиолетовые гиацинты - символ мудрости, достоинства и королевской элегантности. Уникальный и изысканный подарок.",
        "yellow": "Солнечные классические желтые гиацинты - символ радости, оптимизма и новых начинаний. Прекрасный способ поднять настроение и создать праздничную атмосферу."
    };
    
    var compositionsByColor = {
        "blue": "Свежие классические синие гиацинты высшего качества, дизайнерская упаковка, декоративная зелень",
        "pink": "Свежие классические розовые гиацинты премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "white": "Свежие классические белые гиацинты отборного качества, стильная упаковка, декоративные элементы",
        "purple": "Свежие классические фиолетовые гиацинты высшего сорта, яркая упаковка, праздничное оформление",
        "yellow": "Эксклюзивные классические желтые гиацинты премиум-качества, дизайнерская упаковка, специальный уход"
    };
    
    var hyacinthCountOptions = [
        { min: 15, max: 25, pricePerHyacinth: 380, nameSuffix: "15-25 гиацинтов", size: "large" },
        { min: 10, max: 14, pricePerHyacinth: 420, nameSuffix: "10-14 гиацинтов", size: "medium" },
        { min: 5, max: 9, pricePerHyacinth: 480, nameSuffix: "5-9 гиацинтов", size: "small" }
    ];
    
    var colors = Object.keys(hyacinthImagesByColor);
    var productIndex = 0;
    
    // Перебираем каждый цвет
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        // Для каждого цвета перебираем все размеры (3 категории)
        for (var o = 0; o < hyacinthCountOptions.length; o++) {
            var option = hyacinthCountOptions[o];
            
            // Случайный выбор количества в диапазоне
            var hyacinthCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = hyacinthImagesByColor[color];
            var image = colorImages[0];
            
            var packagingCost = 400;
            var price = (hyacinthCount * option.pricePerHyacinth) + packagingCost;
            
            var colorNames = hyacinthNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + hyacinthCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + hyacinthCount + ' гиацинтов.';
            var composition = compositionsByColor[color] + ', ' + hyacinthCount + ' шт.';
            
            // Случайный повод и метка
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 20 + Math.floor(Math.random() * 15),
                height: 30 + Math.floor(Math.random() * 20),
                category: "hyacinths",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                hyacinthCount: hyacinthCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано гиацинтов:', productIndex);
}

function generateUniqueChrysanthemums(startId, endId) {
    var categories = ["chrysanthemum"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var chrysanthemumImagesByColor = {
        "white": ["./img/chrysanthemum/1684820145_61279408.jpg"],
        "pink": ["./img/chrysanthemum/1725728643_94376781.jpg"], 
        "yellow": ["./img/chrysanthemum/1752259603_20217249.jpg"],
        "red": ["./img/chrysanthemum/1748445885_33781430.jpg"],
        "purple": ["./img/chrysanthemum/1706866011_99439972.jpg"]
    };
    
    var chrysanthemumNamesByColor = {
        "white": ["Букет классических белых хризантем"],
        "pink": ["Букет классических розовых хризантем"],
        "yellow": ["Букет классических желтых хризантем"],
        "red": ["Букет классических красных хризантем"],
        "purple": ["Букет классических фиолетовых хризантем"]
    };
    
    var descriptionsByColor = {
        "white": "Элегантные классические белые хризантемы - символ чистоты и искренности. Идеальный подарок для торжественных моментов.",
        "pink": "Нежные классические розовые хризантемы - олицетворение романтики и нежности. Прекрасный выбор для выражения симпатии.",
        "yellow": "Солнечные классические желтые хризантемы - символ радости, оптимизма и дружбы. Прекрасный способ поднять настроение.",
        "red": "Страстные классические красные хризантемы - символ любви и глубоких чувств. Яркое и эмоциональное признание.",
        "purple": "Благородные классические фиолетовые хризантемы - символ мудрости и достоинства. Изысканный и элегантный подарок."
    };
    
    var compositionsByColor = {
        "white": "Свежие классические белые хризантемы высшего качества, дизайнерская упаковка, декоративная зелень",
        "pink": "Свежие классические розовые хризантемы премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "yellow": "Свежие классические желтые хризантемы отборного качества, стильная упаковка, декоративные элементы",
        "red": "Свежие классические красные хризантемы высшего сорта, яркая упаковка, праздничное оформление",
        "purple": "Эксклюзивные классические фиолетовые хризантемы премиум-качества, дизайнерская упаковка, специальный уход"
    };
    
    var chrysanthemumCountOptions = [
        { min: 15, max: 25, pricePerChrysanthemum: 180, nameSuffix: "15-25 хризантем", size: "large" },
        { min: 10, max: 14, pricePerChrysanthemum: 200, nameSuffix: "10-14 хризантем", size: "medium" },
        { min: 5, max: 9, pricePerChrysanthemum: 220, nameSuffix: "5-9 хризантем", size: "small" }
    ];
    
    var colors = Object.keys(chrysanthemumImagesByColor);
    var productIndex = 0;
    
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        for (var o = 0; o < chrysanthemumCountOptions.length; o++) {
            var option = chrysanthemumCountOptions[o];
            
            var chrysanthemumCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = chrysanthemumImagesByColor[color];
            var image = colorImages[0];
            
            var price = chrysanthemumCount * option.pricePerChrysanthemum;
            
            var colorNames = chrysanthemumNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + chrysanthemumCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + chrysanthemumCount + ' хризантем.';
            var composition = compositionsByColor[color] + ', ' + chrysanthemumCount + ' шт.';
            
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 25 + Math.floor(Math.random() * 20),
                height: 35 + Math.floor(Math.random() * 15),
                category: "chrysanthemum",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                chrysanthemumCount: chrysanthemumCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано хризантем:', productIndex);
}

function generateUniqueGypsophila(startId, endId) {
    var categories = ["gypsophila"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var gypsophilaImagesByColor = {
        "white": ["./img/gypsophila/1746515052_14783119.jpg"],
        "pink": ["./img/gypsophila/1713951182_98217459.jpg"], 
        "purple": ["./img/gypsophila/1746719125_32108225.jpg"],
        "rainbow": ["./img/gypsophila/1666733507_84249084.jpg"],
        "mixed": ["./img/gypsophila/1650551610_59435082.jpg"]
    };
    
    var gypsophilaNamesByColor = {
        "white": ["Букет классической белой гипсофилы"],
        "pink": ["Букет классической розовой гипсофилы"],
        "purple": ["Букет классической фиолетовой гипсофилы"],
        "rainbow": ["Букет радужной гипсофилы"],
        "mixed": ["Букет смешанной гипсофилы"]
    };
    
    var descriptionsByColor = {
        "white": "Нежная классическая белая гипсофила - символ чистоты и невинности. Идеальное дополнение к любому букету или самостоятельный подарок.",
        "pink": "Романтическая классическая розовая гипсофила - олицетворение нежности и женственности. Прекрасный выбор для создания воздушных композиций.",
        "purple": "Загадочная классическая фиолетовая гипсофила - символ роскоши и изысканности. Добавит элегантности любой цветочной композиции.",
        "rainbow": "Яркая радужная гипсофила - символ радости и праздника. Идеальный выбор для создания настроения и цветового акцента.",
        "mixed": "Разнообразная смешанная гипсофила - сочетание разных оттенков для создания уникальных и запоминающихся композиций."
    };
    
    var compositionsByColor = {
        "white": "Свежая классическая белая гипсофила высшего качества, дизайнерская упаковка, декоративные элементы",
        "pink": "Свежая классическая розовая гипсофила премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "purple": "Свежая классическая фиолетовая гипсофила отборного качества, стильная упаковка, декоративные дополнения",
        "rainbow": "Яркая радужная гипсофила высшего сорта, праздничная упаковка, специальное оформление",
        "mixed": "Эксклюзивная смешанная гипсофила премиум-качества, дизайнерская упаковка, уникальная композиция"
    };
    
    var gypsophilaCountOptions = [
        { min: 15, max: 25, pricePerGypsophila: 180, nameSuffix: "15-25 веточек", size: "large" },
        { min: 10, max: 14, pricePerGypsophila: 200, nameSuffix: "10-14 веточек", size: "medium" },
        { min: 5, max: 9, pricePerGypsophila: 220, nameSuffix: "5-9 веточек", size: "small" }
    ];
    
    var colors = Object.keys(gypsophilaImagesByColor);
    var productIndex = 0;
    
    // Перебираем каждый цвет
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        // Для каждого цвета перебираем все размеры (3 категории)
        for (var o = 0; o < gypsophilaCountOptions.length; o++) {
            var option = gypsophilaCountOptions[o];
            
            // Случайный выбор количества в диапазоне
            var gypsophilaCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = gypsophilaImagesByColor[color];
            var image = colorImages[0];
            
            var packagingCost = 300;
            var price = (gypsophilaCount * option.pricePerGypsophila) + packagingCost;
            
            var colorNames = gypsophilaNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + gypsophilaCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + gypsophilaCount + ' веточек гипсофилы.';
            var composition = compositionsByColor[color] + ', ' + gypsophilaCount + ' веточек.';
            
            // Случайный повод и метка
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 20 + Math.floor(Math.random() * 15),
                height: 25 + Math.floor(Math.random() * 20),
                category: "gypsophila",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                gypsophilaCount: gypsophilaCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано гипсофилы:', productIndex);
}

function generateUniqueDaisies(startId, endId) {
    var categories = ["daisies"];
    var occasions = ["valentine", "birthday", "mothers-day", "congratulations"];
    var labels = ["", "hot", "new", "sale", "last"];
    
    var daisyImagesByColor = {
        "white": ["./img/daisies/1758307560_13679260.jpg"],
        "yellow": ["./img/daisies/1687281969_21938047.jpg"], 
        "pink": ["./img/daisies/1753878599_93792777.jpg"],
        "mixed": ["./img/daisies/1724938984_24875782.jpg"],
        "rainbow": ["./img/daisies/1725281329_27809410.jpg"]
    };
    
    var daisyNamesByColor = {
        "white": ["Букет классических белых ромашек"],
        "yellow": ["Букет классических желтых ромашек"],
        "pink": ["Букет классических розовых ромашек"],
        "mixed": ["Букет смешанных ромашек"],
        "rainbow": ["Букет разноцветных ромашек"]
    };
    
    var descriptionsByColor = {
        "white": "Нежные классические белые ромашки - символ чистоты, невинности и простоты. Идеальный подарок для создания романтического настроения.",
        "yellow": "Солнечные классические желтые ромашки - олицетворение радости, оптимизма и тепла. Прекрасный выбор для поднятия настроения.",
        "pink": "Романтические классические розовые ромашки - символ нежности и женственности. Идеальны для выражения симпатии и заботы.",
        "mixed": "Разнообразные смешанные ромашки - сочетание разных оттенков для создания ярких и жизнерадостных композиций.",
        "rainbow": "Яркие разноцветные ромашки - символ праздника и веселья. Идеальный выбор для особых торжеств и мероприятий."
    };
    
    var compositionsByColor = {
        "white": "Свежие классические белые ромашки высшего качества, дизайнерская упаковка, декоративная зелень",
        "yellow": "Свежие классические желтые ромашки премиум-класса, элегантная упаковка, дополнительные аксессуары",
        "pink": "Свежие классические розовые ромашки отборного качества, стильная упаковка, декоративные элементы",
        "mixed": "Свежие смешанные ромашки высшего сорта, яркая упаковка, праздничное оформление",
        "rainbow": "Эксклюзивные разноцветные ромашки премиум-качества, дизайнерская упаковка, специальный уход"
    };
    
    var daisyCountOptions = [
        { min: 15, max: 25, pricePerDaisy: 120, nameSuffix: "15-25 ромашек", size: "large" },
        { min: 10, max: 14, pricePerDaisy: 140, nameSuffix: "10-14 ромашек", size: "medium" },
        { min: 5, max: 9, pricePerDaisy: 160, nameSuffix: "5-9 ромашек", size: "small" }
    ];
    
    var colors = Object.keys(daisyImagesByColor);
    var productIndex = 0;
    
    // Перебираем каждый цвет
    for (var c = 0; c < colors.length; c++) {
        var color = colors[c];
        
        // Для каждого цвета перебираем все размеры (3 категории)
        for (var o = 0; o < daisyCountOptions.length; o++) {
            var option = daisyCountOptions[o];
            
            // Случайный выбор количества в диапазоне
            var daisyCount = Math.floor(Math.random() * (option.max - option.min + 1)) + option.min;
            
            var colorImages = daisyImagesByColor[color];
            var image = colorImages[0];
            
            var packagingCost = 300;
            var price = (daisyCount * option.pricePerDaisy) + packagingCost;
            
            var colorNames = daisyNamesByColor[color];
            var baseName = colorNames[0];
            var name = baseName + ' (' + option.nameSuffix + ') - ' + daisyCount + ' шт';
            
            var description = descriptionsByColor[color] + ' Букет из ' + daisyCount + ' ромашек.';
            var composition = compositionsByColor[color] + ', ' + daisyCount + ' шт.';
            
            // Случайный повод и метка
            var occasion = occasions[Math.floor(Math.random() * occasions.length)];
            var label = labels[Math.floor(Math.random() * labels.length)];
            
            products.push({
                id: (startId + productIndex).toString(),
                name: name,
                price: price,
                image: image,
                width: 20 + Math.floor(Math.random() * 15),
                height: 30 + Math.floor(Math.random() * 20),
                category: "daisies",
                occasion: occasion,
                label: label,
                description: description,
                composition: composition,
                gallery: [image],
                daisyCount: daisyCount
            });
            
            productIndex++;
        }
    }
    
    console.log('Сгенерировано ромашек:', productIndex);
}

generateUniqueHyacinths(197, 218);
generateUniqueGypsophila(234, 255);
generateUniqueRoses(37, 58);
generateUniqueTulips(59, 94);
generateUniqueChrysanthemums(124, 159);
generateUniqueDaisies(270, 299);

function showLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

function initializeApp() {
    showLoadingScreen();
    
    loadCartFromStorage();
    loadOrdersFromStorage();
    
    checkAuthStatus();
    
    setTimeout(function() {
        hideLoadingScreen();
        setupEventListeners();
        setupTouchHandlers();
        setupFiltersAndSorting();
        setupTimeOptions();
        setupPriceRange();
        loadInitialProducts();
        updateCartCount();
        setupMobileMenu();
        initCustomOrderForm(); 
        setupProductModal();
        setupReviewsSlider();
        
        setupSearch();
        
        updateFavoriteIcons();
        initCustomDatePicker();
        
        setTimeout(function() {
            setupPriceRange();
        }, 500);
    }, 2000);
}


function setupTouchHandlers() {
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    var buttons = document.querySelectorAll('button, .add-to-cart, .quantity-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.minHeight = '44px';
        buttons[i].style.minWidth = '44px';
    }
}

function loadInitialProducts() {
    var catalogCategories = document.getElementById('catalog-categories');
    var productsGrid = document.getElementById('products-grid');
    
    if (catalogCategories && productsGrid) {
        catalogCategories.style.display = 'block';
        productsGrid.style.display = 'none';
        renderCategorizedProducts();
    }
}

function getProductsByLabel(labels) {
    var result = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        for (var j = 0; j < labels.length; j++) {
            if (p.label === labels[j]) {
                result.push(p);
                break;
            }
        }
    }
    return result;
}

function getProductsByCategory(category) {
    var result = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (typeof category === 'string') {
            if (typeof p.category === 'object' && p.category !== null) {
                for (var j = 0; j < p.category.length; j++) {
                    if (p.category[j] === category) {
                        result.push(p);
                        break;
                    }
                }
            } else {
                if (p.category === category) {
                    result.push(p);
                }
            }
        } else if (Array.isArray(category)) {
            if (typeof p.category === 'object' && p.category !== null) {
                for (var a = 0; a < p.category.length; a++) {
                    for (var b = 0; b < category.length; b++) {
                        if (p.category[a] === category[b]) {
                            result.push(p);
                            a = p.category.length;
                            break;
                        }
                    }
                }
            } else {
                for (var b = 0; b < category.length; b++) {
                    if (p.category === category[b]) {
                        result.push(p);
                        break;
                    }
                }
            }
        }
    }
    return result;
}

function renderCategorizedProducts() {
    var catalogCategories = document.getElementById('catalog-categories');
    if (!catalogCategories) return;
    
    var categoryGroups = {
        'hits': { 
            title: 'Хиты продаж', 
            products: getProductsByLabel(['hot', 'new']).slice(0, 4) 
        },
        'roses': { 
            title: 'Розы', 
            products: getProductsByCategory('roses').slice(0, 8) 
        },
        'orchid': { 
            title: 'Орхидеи', 
            products: getProductsByCategory('orchid').slice(0, 4) 
        },
        'tulips': { 
            title: 'Тюльпаны', 
            products: getProductsByCategory('tulips').slice(0, 4) 
        },
        'lilies': { 
            title: 'Лилии', 
            products: getProductsByCategory('lilies').slice(0, 4) 
        },
        'daffodils': { 
            title: 'Нарциссы', 
            products: getProductsByCategory('daffodils').slice(0, 4) 
        },
        'hyacinths': { 
            title: 'Гиацинты', 
            products: getProductsByCategory('hyacinths').slice(0, 4) 
        },
        'chrysanthemum': { 
            title: 'Хризантемы', 
            products: getProductsByCategory('chrysanthemum').slice(0, 4) 
        },
        'daisies': { 
            title: 'Ромашки', 
            products: getProductsByCategory('daisies').slice(0, 4) 
        },
        'gypsophila': { 
            title: 'Гипсофилы', 
            products: getProductsByCategory('gypsophila').slice(0, 4) 
        },
        'protea': { 
            title: 'Протеи', 
            products: getProductsByCategory('protea').slice(0, 4) 
        },
        'premium': { 
            title: 'Премиум букеты', 
            products: getProductsByCategory(['premium', 'luxury']).slice(0, 4) 
        },
        'gifts': { 
            title: 'Подарки', 
            products: getProductsByCategory('gifts').slice(0, 4) 
        }
    };
    
    catalogCategories.innerHTML = '';
    
    for (var key in categoryGroups) {
        var group = categoryGroups[key];
        if (group.products.length > 0) {
            var categorySection = createCategorySection(key, group.title, group.products);
            catalogCategories.appendChild(categorySection);
        }
    }
    
    attachProductClickHandlers();
    attachAddToCartHandlers();
}

function createCategorySection(categoryKey, title, products) {
    var section = document.createElement('div');
    section.className = 'category-section';
    
    var productsHTML = '';
    for (var i = 0; i < products.length; i++) {
        productsHTML += createProductCardHTML(products[i]);
    }
    
    section.innerHTML = `
        <div class="category-header">
            <h3 class="category-title">${title}</h3>
            <a href="#" class="category-view-all" onclick="showCategoryProducts('${categoryKey}'); return false;">
                Смотреть все
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>
        <div class="category-products">
            ${productsHTML}
        </div>
    `;
    
    return section;
}

function createProductCardHTML(product) {
    var labelHtml = createProductLabel(product.label);
    var isInCart = false;
    var cartItem = null;
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
            isInCart = true;
            cartItem = cart[i];
            break;
        }
    }
    
    var actionsHTML = '';
    if (isInCart && cartItem) {
        actionsHTML = `
            <div class="in-cart-controls">
                <button class="quantity-btn minus" onclick="updateCartItemQuantity('${product.id}', -1)">-</button>
                <span class="quantity">${cartItem.quantity}</span>
                <button class="quantity-btn plus" onclick="updateCartItemQuantity('${product.id}', 1)">+</button>
            </div>
        `;
    } else {
        actionsHTML = `
            <button class="add-to-cart" data-product-id="${product.id}">
                <span>В корзину</span>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
    }
    
    var isMobile = window.innerWidth <= 768;
    var mobileClass = isMobile ? 'mobile-card' : '';
    
    var styleAttr = '';
    if (isMobile) {
        styleAttr = 'style="height: 200px; object-fit: cover;"';
    } else {
        styleAttr = '';
    }
    
    return `
        <div class="product-card ${mobileClass}" data-product="${product.id}">
            ${labelHtml}
            <div class="product-image" onclick="openProductModal('${product.id}')">
                <img src="${product.image}" alt="${product.name}" ${styleAttr} onerror="this.src='./img/placeholder.jpg'">
                <div class="product-dimensions ${isMobile ? 'mobile-dimensions' : ''}">
                    <div class="dimension-icon">
                        <div class="dimension-width">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 12H22M4 10L2 12L4 14M20 10L22 12L20 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>${product.width}</span>
                        </div>
                        <div class="dimension-height">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M10 4L12 2L14 4M10 20L12 22L14 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>${product.height}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-info ${isMobile ? 'mobile-info' : ''}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString()} ₽</p>
                <div class="product-actions ${isMobile ? 'mobile-actions' : ''}">
                    ${actionsHTML}
                </div>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    var storeOptions = document.querySelectorAll('.store-option');
    for (var i = 0; i < storeOptions.length; i++) {
        storeOptions[i].onclick = function() {
            var radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                for (var j = 0; j < storeOptions.length; j++) {
                    storeOptions[j].classList.remove('selected');
                }
                this.classList.add('selected');
            }
        };
    }
    
    var storeRadios = document.querySelectorAll('input[name="store"]');
    for (var i = 0; i < storeRadios.length; i++) {
        storeRadios[i].onchange = function() {
            for (var j = 0; j < storeOptions.length; j++) {
                storeOptions[j].classList.remove('selected');
            }
            if (this.checked) {
                var storeOption = this.closest('.store-option');
                if (storeOption) {
                    storeOption.classList.add('selected');
                }
            }
        };
    }
    
    var occasionCards = document.querySelectorAll('.occasion-card');
    for (var i = 0; i < occasionCards.length; i++) {
        occasionCards[i].onclick = function() {
            var occasion = this.dataset.occasion;
            filterByOccasion(occasion);
            
            for (var j = 0; j < occasionCards.length; j++) {
                occasionCards[j].classList.remove('active');
            }
            this.classList.add('active');
            
            document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
        };
    }
    
    var deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    for (var i = 0; i < deliveryRadios.length; i++) {
        deliveryRadios[i].onchange = function() {
            toggleDeliveryFields(this.value);
            updateOrderTotal();
        };
    }
    
    var deliveryTimeSelect = document.getElementById('delivery-time');
    if (deliveryTimeSelect) {
        deliveryTimeSelect.onchange = updateTimeNote;
    }
    
    var cardTextarea = document.getElementById('card-text');
    var charCounter = document.getElementById('char-counter');
    if (cardTextarea && charCounter) {
        cardTextarea.oninput = function() {
            var text = this.value;
            charCounter.textContent = text.length + '/256';
            cardText = text;
        };
    }
    
    var addCardCheckbox = document.getElementById('add-card');
    var cardTextContainer = document.getElementById('card-text-container');
    if (addCardCheckbox && cardTextContainer) {
        addCardCheckbox.onchange = function() {
            cardTextContainer.style.display = this.checked ? 'block' : 'none';
        };
    }
    
    var checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.onsubmit = function(e) {
            e.preventDefault();
            submitOrder();
        };
    }
    
    var noApartmentCheckbox = document.getElementById('no-apartment');
    if (noApartmentCheckbox) {
        noApartmentCheckbox.onchange = function() {
            document.getElementById('apartment').disabled = this.checked;
            if (this.checked) document.getElementById('apartment').value = '';
        };
    }
    
    var noEntranceCheckbox = document.getElementById('no-entrance');
    if (noEntranceCheckbox) {
        noEntranceCheckbox.onchange = function() {
            document.getElementById('entrance').disabled = this.checked;
            if (this.checked) document.getElementById('entrance').value = '';
        };
    }
    
    var noFloorCheckbox = document.getElementById('no-floor');
    if (noFloorCheckbox) {
        noFloorCheckbox.onchange = function() {
            document.getElementById('floor').disabled = this.checked;
            if (this.checked) document.getElementById('floor').value = '';
        };
    }
    
    var overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.onclick = closeAllModals;
    }
    
    window.onscroll = handleHeaderScroll;
}

function handleHeaderScroll() {
    var header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function setupMobileMenu() {
    var menuToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    var body = document.body;
    
    if (menuToggle && mobileMenu) {
        menuToggle.onclick = function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            
            if (window.innerWidth <= 768) {
                if (mobileMenu.classList.contains('active')) {
                    document.documentElement.style.overflow = 'hidden';
                } else {
                    document.documentElement.style.overflow = '';
                }
            }
        };
        
        var menuLinks = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].onclick = function() {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
                document.documentElement.style.overflow = '';
            };
        }
        
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        });
    }
}

function setupProductModal() {
    var modal = document.getElementById('product-modal');
    var closeBtn = document.getElementById('product-modal-close');
    
    if (closeBtn) {
        closeBtn.onclick = closeProductModal;
    }
    
    var thumbsContainer = document.getElementById('product-modal-thumbs');
    if (thumbsContainer) {
        thumbsContainer.onclick = function(e) {
            if (e.target.tagName === 'IMG') {
                var mainImg = document.getElementById('product-modal-main-img');
                if (mainImg) {
                    mainImg.src = e.target.src;
                }
                
                var thumbs = thumbsContainer.querySelectorAll('img');
                for (var i = 0; i < thumbs.length; i++) {
                    thumbs[i].classList.remove('active');
                }
                e.target.classList.add('active');
            }
        };
    }
    
    var addToCartBtn = document.getElementById('product-modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.onclick = function() {
            if (currentModalProductId) {
                addToCart(currentModalProductId);
                closeProductModal();
            }
        };
    }
    
    var plusBtn = document.querySelector('.modal-plus');
    var minusBtn = document.querySelector('.modal-minus');
    var quantityEl = document.getElementById('product-modal-quantity');
    
    if (plusBtn && minusBtn && quantityEl) {
        plusBtn.onclick = function() {
            var currentValue = parseInt(quantityEl.textContent);
            quantityEl.textContent = currentValue + 1;
        };
        
        minusBtn.onclick = function() {
            var currentValue = parseInt(quantityEl.textContent);
            if (currentValue > 1) {
                quantityEl.textContent = currentValue - 1;
            }
        };
    }
}

window.openProductModal = function(productId) {
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    if (!product) return;
    
    currentModalProductId = productId;
    
    document.getElementById('product-modal-title').textContent = product.name;
    document.getElementById('product-modal-price').textContent = product.price.toLocaleString() + ' ₽';
    document.getElementById('product-modal-width').textContent = product.width;
    document.getElementById('product-modal-height').textContent = product.height;
    document.getElementById('product-modal-description').textContent = product.description;
    document.getElementById('product-modal-category').textContent = getCategoryName(product.category);
    document.getElementById('product-modal-occasion').textContent = getOccasionName(product.occasion);
    document.getElementById('product-modal-quantity').textContent = '1';
    
    var mainImg = document.getElementById('product-modal-main-img');
    if (mainImg) {
        mainImg.src = product.image;
        mainImg.alt = product.name;
    }
    
    if (window.innerWidth <= 768) {
        var modalContent = document.querySelector('.product-modal-content');
        if (modalContent) {
            modalContent.style.width = '95%';
            modalContent.style.maxHeight = '90vh';
            modalContent.style.overflowY = 'auto';
        }
    }
    
    var thumbsContainer = document.getElementById('product-modal-thumbs');
    if (thumbsContainer) {
        thumbsContainer.innerHTML = '';
        
        if (product.gallery && product.gallery.length > 0) {
            for (var i = 0; i < product.gallery.length; i++) {
                var img = product.gallery[i];
                var thumb = document.createElement('div');
                thumb.className = 'product-modal-thumb';
                var activeClass = i === 0 ? 'active' : '';
                thumb.innerHTML = '<img src="' + img + '" alt="' + product.name + ' - изображение ' + (i + 1) + '" class="' + activeClass + '">';
                thumbsContainer.appendChild(thumb);
            }
        } else {
            var thumb = document.createElement('div');
            thumb.className = 'product-modal-thumb';
            thumb.innerHTML = '<img src="' + product.image + '" alt="' + product.name + '" class="active">';
            thumbsContainer.appendChild(thumb);
        }
    }
    
    loadProductModalRecommendations(product);
    
    var modal = document.getElementById('product-modal');
    var overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.style.display = 'flex';
        overlay.style.display = 'block';
        
        setTimeout(function() {
            modal.classList.add('active');
        }, 10);
    }
};

function closeProductModal() {
    var modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(function() {
            modal.style.display = 'none';
            
            var overlay = document.getElementById('overlay');
            if (overlay && !document.querySelector('.modal[style*="display: flex"]:not(#product-modal)')) {
                overlay.style.display = 'none';
            }
        }, 300);
    }
    
    currentModalProductId = null;
}

function loadProductModalRecommendations(product) {
    var recommendedContainer = document.getElementById('product-modal-recommended');
    if (!recommendedContainer) return;
    
    recommendedContainer.innerHTML = '';
    
    var similarProducts = [];
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if ((p.category === product.category || p.occasion === product.occasion) && p.id !== product.id) {
            similarProducts.push(p);
        }
    }
    similarProducts = similarProducts.slice(0, 4);
    
    if (similarProducts.length > 0) {
        for (var i = 0; i < similarProducts.length; i++) {
            var prod = similarProducts[i];
            var card = document.createElement('div');
            card.className = 'product-modal-recommended-item';
            card.innerHTML = `
                <div class="recommended-item-image" onclick="openProductModal('${prod.id}')">
                    <img src="${prod.image}" alt="${prod.name}">
                </div>
                <div class="recommended-item-info">
                    <h4>${prod.name}</h4>
                    <div class="recommended-item-price">${prod.price.toLocaleString()} ₽</div>
                </div>
                <button class="add-to-cart-sm" onclick="addToCart('${prod.id}')">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
            recommendedContainer.appendChild(card);
        }
    } else {
        recommendedContainer.innerHTML = '<p>Нет похожих товаров</p>';
    }
}

function getCategoryName(categoryKey) {
    var categories = {
        'roses': 'Розы',
        'tulips': 'Тюльпаны',
        'lilies': 'Лилии',
        'gypsophila': 'Гипсофилы',
        'daisies': 'Ромашки',
        'daffodils': 'Нарциссы',
        'chrysanthemum': 'Хризантемы',
        'premium': 'Премиум букеты',
        'wedding': 'Свадебные',
        'gifts': 'Подарки',
        'luxury': 'Люкс коллекция',
        'seasonal': 'Сезонные'
    };
    
    return categories[categoryKey] || categoryKey;
}

function getOccasionName(occasionKey) {
    var occasions = {
        'valentine': 'Для второй половинки',
        'birthday': 'День рождения',
        'wedding': 'Свадьба',
        'mothers-day': 'Для мамы',
        'anniversary': 'Годовщина',
        'congratulations': 'Поздравления'
    };
    
    return occasions[occasionKey] || occasionKey;
}

function setupReviewsSlider() {
    var reviewsTrack = document.getElementById('reviews-track');
    var prevButton = document.getElementById('review-prev');
    var nextButton = document.getElementById('review-next');
    var dotsContainer = document.getElementById('reviews-dots');
    
    if (!reviewsTrack || !prevButton || !nextButton || !dotsContainer) return;
    
    var reviewCards = reviewsTrack.querySelectorAll('.review-card');
    var totalReviews = reviewCards.length;
    var currentReview = 0;
    
    dotsContainer.innerHTML = '';
    for (var i = 0; i < totalReviews; i++) {
        var dot = document.createElement('span');
        dot.className = i === 0 ? 'review-dot active' : 'review-dot';
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
        
        dot.onclick = function() {
            currentReview = parseInt(this.getAttribute('data-index'));
            updateReviewsSlider();
        };
    }
    
    prevButton.onclick = function() {
        if (currentReview > 0) {
            currentReview--;
        } else {
            currentReview = totalReviews - 1;
        }
        updateReviewsSlider();
    };
    
    nextButton.onclick = function() {
        if (currentReview < totalReviews - 1) {
            currentReview++;
        } else {
            currentReview = 0;
        }
        updateReviewsSlider();
    };
    
    function updateReviewsSlider() {
        var translateValue = -currentReview * 100;
        reviewsTrack.style.transform = 'translateX(' + translateValue + '%)';
        
        var dots = dotsContainer.querySelectorAll('.review-dot');
        for (var i = 0; i < dots.length; i++) {
            if (i === currentReview) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
    }
    
    updateReviewsSlider();
}

function setupFiltersAndSorting() {
    var sortSelect = document.getElementById('sort-select');
    var categorySelect = document.getElementById('category-select');
    
    if (sortSelect) {
        sortSelect.onchange = filterProducts;
    }
    
    if (categorySelect) {
        categorySelect.onchange = filterProducts;
    }
}
function setupPriceRange() {
    var priceMin = document.getElementById('price-min');
    var priceMax = document.getElementById('price-max');
    var priceDisplay = document.getElementById('price-display');
    var minHandle = document.querySelector('.min-handle');
    var maxHandle = document.querySelector('.max-handle');
    var priceSliderFill = document.querySelector('.price-slider-fill');
    
    if (!priceMin || !priceMax || !priceDisplay || !minHandle || !maxHandle || !priceSliderFill) return;
    
    var minPrice = 1000000;
    var maxPrice = 0;
    
    for (var i = 0; i < products.length; i++) {
        if (products[i].price < minPrice) minPrice = products[i].price;
        if (products[i].price > maxPrice) maxPrice = products[i].price;
    }
    
    minPrice = Math.floor(minPrice / 100) * 100;
    maxPrice = Math.ceil(maxPrice / 1000) * 1000;
    
    priceMin.min = minPrice;
    priceMax.min = minPrice;
    priceMin.max = maxPrice;
    priceMax.max = maxPrice;
    
    priceMin.value = minPrice;
    priceMax.value = maxPrice;
    
    priceMin.style.opacity = "0";
    priceMax.style.opacity = "0";
    priceMin.style.pointerEvents = "auto";
    priceMax.style.pointerEvents = "auto";
    
    function updatePriceRangeUI() {
        var minVal = parseInt(document.getElementById('price-min').value);
        var maxVal = parseInt(document.getElementById('price-max').value);
        
        priceDisplay.textContent = minVal.toLocaleString() + ' - ' + maxVal.toLocaleString() + ' ₽';
        
        var minPercent = ((minVal - minPrice) / (maxPrice - minPrice)) * 100;
        var maxPercent = ((maxVal - minPrice) / (maxPrice - minPrice)) * 100;
        
        minHandle.style.left = minPercent + '%';
        maxHandle.style.left = maxPercent + '%';
        priceSliderFill.style.left = minPercent + '%';
        priceSliderFill.style.width = (maxPercent - minPercent) + '%';
    }
    
    priceMin.oninput = function() {
        var minVal = parseInt(this.value);
        var maxVal = parseInt(priceMax.value);
        
        if (minVal > maxVal) {
            this.value = maxVal;
        }
        
        updatePriceRangeUI();
        filterProducts();
    };
    
    priceMax.oninput = function() {
        var maxVal = parseInt(this.value);
        var minVal = parseInt(priceMin.value);
        
        if (maxVal < minVal) {
            this.value = minVal;
        }
        
        updatePriceRangeUI();
        filterProducts();
    };
    
    priceMin.onchange = function() {
        updatePriceRangeUI();
        filterProducts();
    };
    
    priceMax.onchange = function() {
        updatePriceRangeUI();
        filterProducts();
    };
    
    if (window.innerWidth <= 768) {
        priceMin.step = 500;
        priceMax.step = 500;
    }
    
    updatePriceRangeUI();
}

function filterProducts() {
    var loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'flex';
    
    setTimeout(function() {
        var sortSelect = document.getElementById('sort-select');
        var categorySelect = document.getElementById('category-select');
        var priceMin = document.getElementById('price-min');
        var priceMax = document.getElementById('price-max');
        
        if (!sortSelect || !categorySelect || !priceMin || !priceMax) return;
        
        var sortValue = sortSelect.value;
        var categoryValue = categorySelect.value;
        var minPrice = parseInt(priceMin.value);
        var maxPrice = parseInt(priceMax.value);
        
        var filteredProducts = [];
        
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            
            var matchesCategory = false;
            if (categoryValue === 'all') {
                matchesCategory = true;
            } else {
                if (typeof product.category === 'object' && product.category !== null) {
                    for (var j = 0; j < product.category.length; j++) {
                        if (product.category[j] === categoryValue) {
                            matchesCategory = true;
                            break;
                        }
                    }
                } else {
                    matchesCategory = (product.category === categoryValue);
                }
            }
            
            var matchesPrice = (product.price >= minPrice && product.price <= maxPrice);
            
            if (matchesCategory && matchesPrice) {
                filteredProducts.push(product);
            }
        }
        
        filteredProducts = sortProducts(filteredProducts, sortValue);
        
        if (loadingEl) loadingEl.style.display = 'none';
        renderProducts(filteredProducts);
    }, 400);
}

function sortProducts(productsArray, sortType) {
    var result = [];
    
    if (sortType === 'price-asc') {
        result = productsArray.slice().sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sortType === 'price-desc') {
        result = productsArray.slice().sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (sortType === 'popular') {
        result = productsArray.slice().sort(function(a, b) {
            var aIsHot = (a.label === 'hot') ? 1 : 0;
            var bIsHot = (b.label === 'hot') ? 1 : 0;
            return bIsHot - aIsHot;
        });
    } else if (sortType === 'new') {
        result = productsArray.slice().sort(function(a, b) {
            var aIsNew = (a.label === 'new') ? 1 : 0;
            var bIsNew = (b.label === 'new') ? 1 : 0;
            return bIsNew - aIsNew;
        });
    } else {
        result = productsArray.slice();
    }
    
    return result;
}

function filterByOccasion(occasion) {
    var loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'flex';
    
    var catalogCategories = document.getElementById('catalog-categories');
    var productsGrid = document.getElementById('products-grid');
    
    if (catalogCategories && productsGrid) {
        catalogCategories.style.display = 'none';
        productsGrid.style.display = 'grid';
    }
    
    setTimeout(function() {
        var filteredProducts = [];
        
        for (var i = 0; i < products.length; i++) {
            if (products[i].occasion === occasion) {
                filteredProducts.push(products[i]);
            }
        }
        
        var categorySelect = document.getElementById('category-select');
        var sortSelect = document.getElementById('sort-select');
        
        if (categorySelect) categorySelect.value = 'all';
        if (sortSelect) sortSelect.value = 'default';
        
        if (loadingEl) loadingEl.style.display = 'none';
        renderProducts(filteredProducts);
    }, 400);
}

window.showAllCategories = function() {
    var catalogCategories = document.getElementById('catalog-categories');
    var productsGrid = document.getElementById('products-grid');
    
    if (!catalogCategories || !productsGrid) return;
    
    catalogCategories.style.display = 'block';
    productsGrid.style.display = 'none';
    
    var sortSelect = document.getElementById('sort-select');
    var categorySelect = document.getElementById('category-select');
    
    if (sortSelect) {
        sortSelect.value = 'default';
    }
    
    if (categorySelect) {
        categorySelect.value = 'all';
    }
    
    var priceMin = document.getElementById('price-min');
    var priceMax = document.getElementById('price-max');
    
    if (priceMin && priceMax) {
        priceMin.value = priceMin.min;
        priceMax.value = priceMax.max;
        
        var minHandle = document.querySelector('.min-handle');
        var maxHandle = document.querySelector('.max-handle');
        var priceSliderFill = document.querySelector('.price-slider-fill');
        var priceDisplay = document.getElementById('price-display');
        
        if (minHandle && maxHandle && priceSliderFill && priceDisplay) {
            minHandle.style.left = '0%';
            maxHandle.style.left = '100%';
            priceSliderFill.style.left = '0%';
            priceSliderFill.style.width = '100%';
            priceDisplay.textContent = parseInt(priceMin.min).toLocaleString() + ' - ' + parseInt(priceMax.max).toLocaleString() + ' ₽';
        }
    }
    
    renderCategorizedProducts();
}

window.showCategoryProducts = function(categoryKey) {
    var loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'flex';
    
    setTimeout(function() {
        var filteredProducts = [];
        
        if (categoryKey === 'hits') {
            for (var i = 0; i < products.length; i++) {
                if (products[i].label === 'hot' || products[i].label === 'new') {
                    filteredProducts.push(products[i]);
                }
            }
        } else if (categoryKey === 'wedding') {
            for (var i = 0; i < products.length; i++) {
                if (products[i].occasion === 'wedding') {
                    filteredProducts.push(products[i]);
                }
            }
        } else {
            for (var i = 0; i < products.length; i++) {
                var p = products[i];
                if (typeof p.category === 'object' && p.category !== null) {
                    for (var j = 0; j < p.category.length; j++) {
                        if (p.category[j] === categoryKey) {
                            filteredProducts.push(p);
                            break;
                        }
                    }
                } else {
                    if (p.category === categoryKey) {
                        filteredProducts.push(p);
                    }
                }
            }
        }
        
        if (loadingEl) loadingEl.style.display = 'none';
        renderProducts(filteredProducts);
        
        var categorySelect = document.getElementById('category-select');
        if (categorySelect && categoryKey !== 'hits' && categoryKey !== 'wedding') {
            categorySelect.value = categoryKey;
        } else if (categorySelect) {
            categorySelect.value = 'all';
        }
    }, 400);
};

function renderProducts(filteredProducts) {
    var productsGrid = document.getElementById('products-grid');
    var catalogCategories = document.getElementById('catalog-categories');
    
    if (!productsGrid) return;
    
    if (!filteredProducts) {
        filteredProducts = products;
    }
    
    if (window.innerWidth <= 768) {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        productsGrid.style.gap = '15px';
        
        if (window.innerWidth <= 480) {
            productsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            productsGrid.style.gap = '10px';
        }
    } else {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        productsGrid.style.gap = '20px';
    }
    
    productsGrid.innerHTML = '';
    
    if (catalogCategories) {
        catalogCategories.style.display = 'none';
    }
    productsGrid.style.display = 'grid';
    
    for (var i = 0; i < filteredProducts.length; i++) {
        var productCardHTML = createProductCardHTML(filteredProducts[i]);
        productsGrid.insertAdjacentHTML('beforeend', productCardHTML);
    }
    
    attachProductClickHandlers();
    attachAddToCartHandlers();
}

function attachProductClickHandlers() {
    var productImages = document.querySelectorAll('.product-image');
    for (var i = 0; i < productImages.length; i++) {
        productImages[i].onclick = function() {
            var productId = this.closest('.product-card').dataset.product;
            openProductModal(productId);
        };
    }
}

function createProductLabel(label) {
    if (!label) return '';
    
    var labelClasses = {
        'hot': 'label-hot',
        'new': 'label-new',
        'sale': 'label-sale',
        'last': 'label-last',
        'luxury': 'label-hot',
        'premium': 'label-hot',
        'exclusive': 'label-new'
    };
    
    var labelTexts = {
        'hot': 'Хит продаж',
        'new': 'Новинка',
        'sale': 'Акция',
        'last': 'Осталось мало',
        'luxury': 'Люкс',
        'premium': 'Премиум',
        'exclusive': 'Эксклюзив'
    };
    
    var labelClass = labelClasses[label] || 'label-hot';
    var labelText = labelTexts[label] || label;
    
    return '<div class="product-label ' + labelClass + '">' + labelText + '</div>';
}

function attachAddToCartHandlers() {
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            var productId = this.dataset.productId;
            addToCart(productId);
        };
    }
}

function addToCart(productId) {
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    if (!product) return;
    
    var existingProductIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            existingProductIndex = i;
            break;
        }
    }
    
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showAddToCartAnimation(productId);
    showNotification('Товар "' + product.name + '" добавлен в корзину!', 'success');
    
    var cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar && cartSidebar.className.indexOf('active') > -1) {
        renderCart();
    }
    
    updateProductCardsButtons();
}

function updateProductCardsButtons() {
    var productCards = document.querySelectorAll('.product-card');
    
    for (var i = 0; i < productCards.length; i++) {
        var card = productCards[i];
        var productId = card.getAttribute('data-product');
        var actionsContainer = card.querySelector('.product-actions');
        var cartItem = null;
        
        for (var j = 0; j < cart.length; j++) {
            if (cart[j].id === productId) {
                cartItem = cart[j];
                break;
            }
        }
        
        if (cartItem) {
            actionsContainer.innerHTML = `
                <div class="in-cart-controls">
                    <button class="quantity-btn minus" onclick="updateCartItemQuantity('${productId}', -1)">-</button>
                    <span class="quantity">${cartItem.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateCartItemQuantity('${productId}', 1)">+</button>
                </div>
            `;
        } else {
            actionsContainer.innerHTML = `
                <button class="add-to-cart" data-product-id="${productId}">
                    <span>В корзину</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
        }
    }
    
    attachAddToCartHandlers();
}

function showAddToCartAnimation(productId) {
    var productCard = document.querySelector('[data-product="' + productId + '"]');
    var cartIcon = document.querySelector('.cart-icon');
    
    if (!productCard || !cartIcon) return;
    
    var productRect = productCard.getBoundingClientRect();
    var cartRect = cartIcon.getBoundingClientRect();
    
    var animationElement = document.createElement('div');
    animationElement.className = 'add-to-cart-animation';
    animationElement.style.left = (productRect.left + productRect.width / 2) + 'px';
    animationElement.style.top = (productRect.top + productRect.height / 2) + 'px';
    
    document.body.appendChild(animationElement);
    
    var translateX = cartRect.left - productRect.left;
    var translateY = cartRect.top - productRect.top;
    
    animationElement.style.transform = 'translate(0, 0) scale(1)';
    animationElement.style.opacity = '1';
    
    setTimeout(function() {
        animationElement.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(0.3)';
        animationElement.style.opacity = '0';
        animationElement.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 10);
    
    setTimeout(function() {
        if (animationElement.parentNode) {
            animationElement.parentNode.removeChild(animationElement);
        }
        var cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.classList.add('pulse');
            setTimeout(function() {
                cartCount.classList.remove('pulse');
            }, 500);
        }
    }, 800);
}

function updateCartCount() {
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
    }
    var cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function renderCart() {
    var cartItems = document.getElementById('cart-items');
    var totalPrice = document.getElementById('total-price');
    var recommendedSection = document.querySelector('.recommended-products');
    var checkoutBtn = document.querySelector('.checkout-btn');
    
    if (!cartItems || !totalPrice || !recommendedSection || !checkoutBtn) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
        recommendedSection.style.display = 'none';
        checkoutBtn.style.display = 'none';
    } else {
        recommendedSection.style.display = 'block';
        checkoutBtn.style.display = 'flex';
        
        for (var i = 0; i < cart.length; i++) {
            var cartItem = createCartItem(cart[i]);
            cartItems.appendChild(cartItem);
        }
        
        renderRecommendedProducts();
    }
    
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    totalPrice.textContent = total.toLocaleString() + ' ₽';
}

function createCartItem(item) {
    var cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus" onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.id}')" aria-label="Удалить товар"></button>
    `;
    return cartItem;
}

function renderRecommendedProducts() {
    var recommendedItems = document.getElementById('recommended-items');
    if (!recommendedItems) return;
    
    recommendedItems.innerHTML = '';
    
    var availableRecommended = [];
    for (var i = 0; i < recommendedProducts.length; i++) {
        var product = recommendedProducts[i];
        if (usedRecommendedIds.indexOf(product.id) === -1) {
            var inCart = false;
            for (var j = 0; j < cart.length; j++) {
                if (cart[j].id === product.id) {
                    inCart = true;
                    break;
                }
            }
            if (!inCart) {
                availableRecommended.push(product);
            }
        }
    }
    
    if (availableRecommended.length === 0) {
        document.querySelector('.recommended-products').style.display = 'none';
        return;
    }
    
    var shuffled = availableRecommended.sort(function() { return 0.5 - Math.random(); });
    var selected = shuffled.slice(0, Math.min(6, shuffled.length));
    
    for (var i = 0; i < selected.length; i++) {
        var recommendedItem = createRecommendedItem(selected[i]);
        recommendedItems.appendChild(recommendedItem);
    }
}

function createRecommendedItem(product) {
    var recommendedItem = document.createElement('div');
    recommendedItem.className = 'recommended-item';
    recommendedItem.innerHTML = `
        <div class="recommended-item-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="recommended-item-details">
            <h5>${product.name}</h5>
            <div class="recommended-item-price">${product.price.toLocaleString()} ₽</div>
        </div>
        <button class="add-recommended" onclick="addRecommendedToCart('${product.id}')">+</button>
    `;
    return recommendedItem;
}

window.toggleCart = function() {
    var cartSidebar = document.getElementById('cart-sidebar');
    var overlay = document.getElementById('overlay');
    
    if (!cartSidebar || !overlay) return;
    
    if (cartSidebar.className.indexOf('active') > -1) {
        cartSidebar.className = cartSidebar.className.replace(' active', '');
        overlay.style.display = 'none';
    } else {
        cartSidebar.className += ' active';
        overlay.style.display = 'block';
        renderCart();
    }
};

window.updateCartItemQuantity = function(id, change) {
    var itemIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            itemIndex = i;
            break;
        }
    }
    
    if (itemIndex > -1) {
        var newQuantity = cart[itemIndex].quantity + change;
        
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        updateCartCount();
        saveCartToStorage();
        renderCart();
        updateProductCardsButtons();
    }
};

window.removeFromCart = function(id) {
    var itemIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            itemIndex = i;
            break;
        }
    }
    
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        updateCartCount();
        saveCartToStorage();
        renderCart();
        updateProductCardsButtons();
        showNotification('Товар удален из корзины', 'info');
    }
};

window.addRecommendedToCart = function(id) {
    var product = null;
    for (var i = 0; i < recommendedProducts.length; i++) {
        if (recommendedProducts[i].id === id) {
            product = recommendedProducts[i];
            break;
        }
    }
    
    if (product) {
        var existingProductIndex = -1;
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id === id) {
                existingProductIndex = i;
                break;
            }
        }
        
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        usedRecommendedIds.push(id);
        
        updateCartCount();
        saveCartToStorage();
        renderCart();
        updateProductCardsButtons();
        showNotification('Товар "' + product.name + '" добавлен в корзину!', 'success');
    }
};

function setupTimeOptions() {
    var deliveryTimeSelect = document.getElementById('delivery-time');
    var timeRangeNote = document.getElementById('time-range-note');
    var deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    var deliveryType = 'delivery';
    
    for (var i = 0; i < deliveryRadios.length; i++) {
        if (deliveryRadios[i].checked) {
            deliveryType = deliveryRadios[i].value;
            break;
        }
    }
    
    if (!deliveryTimeSelect || !timeRangeNote) return;
    
    deliveryTimeSelect.innerHTML = '';
    
    var startHour = deliveryType === 'delivery' ? 10 : 9;
    var endHour = 20;
    
    for (var hour = startHour; hour <= endHour; hour++) {
        var minutes = ['00', '30'];
        for (var m = 0; m < minutes.length; m++) {
            var minute = minutes[m];
            if (hour === endHour && minute === '30') continue;
            
            var timeValue = hour + ':' + minute;
            var option = document.createElement('option');
            option.value = timeValue;
            option.textContent = timeValue;
            deliveryTimeSelect.appendChild(option);
        }
    }
    
    deliveryTimeSelect.value = startHour + ':00';
    updateTimeNote();
}

function updateTimeNote() {
    var deliveryTimeSelect = document.getElementById('delivery-time');
    var timeRangeNote = document.getElementById('time-range-note');
    var deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    var deliveryType = 'delivery';
    
    for (var i = 0; i < deliveryRadios.length; i++) {
        if (deliveryRadios[i].checked) {
            deliveryType = deliveryRadios[i].value;
            break;
        }
    }
    
    if (!deliveryTimeSelect || !timeRangeNote) return;
    
    var selectedTime = deliveryTimeSelect.value;
    
    if (deliveryType === 'delivery') {
        var parts = selectedTime.split(':');
        var hour = parts[0];
        var minute = parts[1];
        var endHour = parseInt(hour) + 1;
        timeRangeNote.textContent = 'Доставим с ' + selectedTime + ' до ' + endHour + ':' + minute;
    } else {
        timeRangeNote.textContent = 'Можно забрать с ' + selectedTime;
    }
}

function updateSelectedDateDisplay() {
    var dateInput = document.getElementById('delivery-date');
    var selectedDay = document.getElementById('selected-day');
    var selectedDateMonth = document.getElementById('selected-date-month');
    var selectedDateDisplay = document.querySelector('.selected-date-display');
    
    if (!dateInput || !selectedDay || !selectedDateMonth) return;
    
    if (dateInput.value) {
        var date = new Date(dateInput.value);
        var dayOfWeek = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        var day = date.getDate();
        var month = date.toLocaleDateString('ru-RU', { month: 'long' });
        
        selectedDay.textContent = dayOfWeek + ', ' + day;
        selectedDateMonth.textContent = month;
        
        if (selectedDateDisplay) {
            selectedDateDisplay.classList.add('show');
        }
    } else {
        selectedDay.textContent = '--';
        selectedDateMonth.textContent = '---';
        
        if (selectedDateDisplay) {
            selectedDateDisplay.classList.remove('show');
        }
    }
}

window.showCheckout = function() {
    if (cart.length === 0) {
        showNotification('Ваша корзина пуста', 'warning');
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'check_auth.php', false);
    xhr.withCredentials = true;

    try {
        xhr.send();
        if (xhr.status === 200) {
            var authData = JSON.parse(xhr.responseText);
            if (!authData.loggedIn) {
                showNotification('Для оформления заказа необходимо войти в систему', 'error');
                openAuthModal();
                return;
            }
            currentUser = authData.user;
        } else {
            showNotification('Ошибка проверки авторизации', 'error');
            return;
        }
    } catch (e) {
        showNotification('Ошибка соединения с сервером', 'error');
        return;
    }

    var checkoutModal = document.getElementById('checkout-modal');
    var overlay = document.getElementById('overlay');
    
    if (checkoutModal && overlay) {
        checkoutModal.style.display = 'flex';
        overlay.style.display = 'block';
        
        var cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar) {
            cartSidebar.className = cartSidebar.className.replace(' active', '');
        }
        
        var reviewsSlider = document.querySelector('.reviews-slider');
        if (reviewsSlider) {
            reviewsSlider.style.display = 'none';
        }
        
        updateOrderTotal();
        
        var cardTextarea = document.getElementById('card-text');
        if (cardTextarea && cardText) {
            cardTextarea.value = cardText;
            document.getElementById('char-counter').textContent = cardText.length + '/256';
        }
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var todayStr = yyyy + '-' + mm + '-' + dd;
        
        var deliveryDateInput = document.getElementById('delivery-date');
        if (deliveryDateInput) {
            deliveryDateInput.min = todayStr;
            if (!deliveryDateInput.value) {
                deliveryDateInput.value = todayStr;
                updateSelectedDateDisplay();
            }
        }
        
        setupTimeOptions();
        initializeStoreSelection();
        
        if (window.innerWidth <= 768) {
            var modalContent = document.querySelector('#checkout-modal .modal-content');
            if (modalContent) {
                modalContent.style.width = '95%';
                modalContent.style.maxHeight = '90vh';
                modalContent.style.overflowY = 'auto';
            }
        }
    }
};

function initializeStoreSelection() {
    var storeOptions = document.querySelectorAll('.store-option');
    var storeRadios = document.querySelectorAll('input[name="store"]');
    
    for (var i = 0; i < storeOptions.length; i++) {
        var newOption = storeOptions[i].cloneNode(true);
        storeOptions[i].parentNode.replaceChild(newOption, storeOptions[i]);
    }
    
    var refreshedStoreOptions = document.querySelectorAll('.store-option');
    
    for (var i = 0; i < refreshedStoreOptions.length; i++) {
        refreshedStoreOptions[i].onclick = function(e) {
            if (e.target.type === 'radio') return;
            
            var radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                for (var j = 0; j < refreshedStoreOptions.length; j++) {
                    refreshedStoreOptions[j].classList.remove('selected');
                }
                this.classList.add('selected');
            }
        };
    }
    
    for (var i = 0; i < storeRadios.length; i++) {
        storeRadios[i].onchange = function() {
            for (var j = 0; j < refreshedStoreOptions.length; j++) {
                refreshedStoreOptions[j].classList.remove('selected');
            }
            if (this.checked) {
                var storeOption = this.closest('.store-option');
                if (storeOption) {
                    storeOption.classList.add('selected');
                }
            }
        };
        
        if (storeRadios[i].checked) {
            var storeOption = storeRadios[i].closest('.store-option');
            if (storeOption) {
                storeOption.classList.add('selected');
            }
        }
    }
    
    if (storeRadios.length > 0 && !document.querySelector('input[name="store"]:checked')) {
        storeRadios[0].checked = true;
        var firstStoreOption = storeRadios[0].closest('.store-option');
        if (firstStoreOption) {
            firstStoreOption.classList.add('selected');
        }
    }
}

function closeCheckout() {
    var checkoutModal = document.getElementById('checkout-modal');
    var overlay = document.getElementById('overlay');
    
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    
    if (overlay && !document.querySelector('.modal[style*="display: flex"]')) {
        overlay.style.display = 'none';
    }
    
    var reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider) {
        reviewsSlider.style.display = '';
    }
}



function toggleDeliveryFields(type) {
    var deliverySection = document.getElementById('delivery-section');
    var pickupSection = document.getElementById('pickup-section');
    var storeRadios = document.querySelectorAll('input[name="store"]');
    
    if (type === 'delivery') {
        if (deliverySection) deliverySection.style.display = 'block';
        if (pickupSection) pickupSection.style.display = 'none';
        
        for (var i = 0; i < storeRadios.length; i++) {
            storeRadios[i].removeAttribute('required');
        }
    } else {
        if (deliverySection) deliverySection.style.display = 'none';
        if (pickupSection) pickupSection.style.display = 'block';
        
        for (var i = 0; i < storeRadios.length; i++) {
            storeRadios[i].setAttribute('required', 'required');
        }
    }
    
    updateOrderTotal();
}

function submitOrder() {
    console.log('=== SUBMIT ORDER START ===');
    
    if (!cart || cart.length === 0) {
        showNotification('Ваша корзина пуста', 'warning');
        return false;
    }
    
    var deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    var deliveryType = null;
    for (var i = 0; i < deliveryRadios.length; i++) {
        if (deliveryRadios[i].checked) {
            deliveryType = deliveryRadios[i].value;
            break;
        }
    }
    
    if (!deliveryType) {
        showNotification('Пожалуйста, выберите тип получения', 'error');
        return false;
    }
    
    var storeRadios = document.querySelectorAll('input[name="store"]');
    for (var i = 0; i < storeRadios.length; i++) {
        storeRadios[i].removeAttribute('required');
    }
    
    var senderName = document.getElementById('sender-name') ? document.getElementById('sender-name').value.trim() : '';
    var senderPhone = document.getElementById('sender-phone') ? document.getElementById('sender-phone').value.trim() : '';
    
    if (!senderName || !senderPhone) {
        showNotification('Пожалуйста, заполните имя и телефон отправителя', 'error');
        return false;
    }
    
    if (deliveryType === 'delivery') {
        var storeSection = document.getElementById('pickup-section');
        if (storeSection) storeSection.style.display = 'none';
        
        var address = document.getElementById('address') ? document.getElementById('address').value.trim() : '';
        if (!address) {
            showNotification('Пожалуйста, укажите адрес доставки', 'error');
            return false;
        }
        
        var deliveryDate = document.getElementById('delivery-date') ? document.getElementById('delivery-date').value : '';
        if (!deliveryDate) {
            showNotification('Пожалуйста, выберите дату доставки', 'error');
            return false;
        }
        
        var deliveryTime = document.getElementById('delivery-time') ? document.getElementById('delivery-time').value : '';
        if (!deliveryTime) {
            showNotification('Пожалуйста, выберите время доставки', 'error');
            return false;
        }
        
        var addressInput = document.getElementById('address');
        var dadataData = null;
        if (addressInput && typeof $ !== 'undefined') {
            dadataData = $(addressInput).data('dadata-data');
        }
        
        var orderData = {
            items: cart.map(function(item) {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                };
            }),
            delivery: {
                type: 'delivery',
                date: deliveryDate,
                time: deliveryTime,
                address: address,
                apartment: document.getElementById('apartment') ? document.getElementById('apartment').value.trim() : '',
                entrance: document.getElementById('entrance') ? document.getElementById('entrance').value.trim() : '',
                floor: document.getElementById('floor') ? document.getElementById('floor').value.trim() : '',
                store: ''
            },
            sender: {
                name: senderName,
                phone: senderPhone,
                email: currentUser && currentUser.email ? currentUser.email : ''
            },
            receiver: {
                name: document.getElementById('receiver-name') ? document.getElementById('receiver-name').value.trim() : '',
                phone: document.getElementById('receiver-phone') ? document.getElementById('receiver-phone').value.trim() : ''
            },
            card_text: document.getElementById('add-card') && document.getElementById('add-card').checked ? 
                      (document.getElementById('card-text') ? document.getElementById('card-text').value.trim() : '') : '',
            comment: document.getElementById('order-comment') ? document.getElementById('order-comment').value.trim() : '',
            total_amount: cart.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0) + 200,
            dadata: dadataData ? {
                region: dadataData.region,
                city: dadataData.city || dadataData.settlement,
                street: dadataData.street,
                house: dadataData.house,
                block: dadataData.block,
                flat: dadataData.flat,
                postal_code: dadataData.postal_code,
                fias_id: dadataData.fias_id,
                kladr_id: dadataData.kladr_id,
                full_address: dadataData.value
            } : null
        };
        
        sendOrderToServer(orderData);
    }
    
    else if (deliveryType === 'pickup') {
        var storeRadio = document.querySelector('input[name="store"]:checked');
        if (!storeRadio) {
            showNotification('Пожалуйста, выберите магазин для самовывоза', 'error');
            return false;
        }
        
        var deliveryDate = document.getElementById('delivery-date') ? document.getElementById('delivery-date').value : '';
        var deliveryTime = document.getElementById('delivery-time') ? document.getElementById('delivery-time').value : '';
        
        if (!deliveryDate || !deliveryTime) {
            showNotification('Пожалуйста, выберите дату и время самовывоза', 'error');
            return false;
        }
        
        var orderData = {
            items: cart.map(function(item) {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                };
            }),
            delivery: {
                type: 'pickup',
                date: deliveryDate,
                time: deliveryTime,
                address: '',
                apartment: '',
                entrance: '',
                floor: '',
                store: storeRadio.value
            },
            sender: {
                name: senderName,
                phone: senderPhone,
                email: currentUser && currentUser.email ? currentUser.email : ''
            },
            receiver: {
                name: '',
                phone: ''
            },
            card_text: document.getElementById('add-card') && document.getElementById('add-card').checked ? 
                      (document.getElementById('card-text') ? document.getElementById('card-text').value.trim() : '') : '',
            comment: document.getElementById('order-comment') ? document.getElementById('order-comment').value.trim() : '',
            total_amount: cart.reduce(function(sum, item) {
                return sum + (item.price * item.quantity);
            }, 0)
        };
        
        sendOrderToServer(orderData);
    }
}

function sendOrderToServer(orderData) {
    var submitBtn = document.querySelector('.submit-order');
    if (!submitBtn) {
        showNotification('Ошибка: не найдена кнопка отправки', 'error');
        return;
    }
    
    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Оформление...</span>';
    submitBtn.disabled = true;
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_order.php', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    console.log('Server response:', result);
                    
                    if (result.success) {
                        // ========== ДОБАВИТЬ ЭТОТ БЛОК ==========
                        // Отмечаем промокод как использованный
                        if (appliedPromoCode) {
                            fetch('apply_promo.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ promo_code: appliedPromoCode })
                            }).then(response => response.json())
                              .then(data => {
                                  if (data.success) {
                                      console.log('Промокод отмечен как использованный');
                                  }
                              })
                              .catch(err => console.log('Ошибка отметки промокода:', err));
                        }
                        // =====================================
                        
                        cart = [];
                        updateCartCount();
                        saveCartToStorage();
                        closeCheckout();
                        showSuccessOrderNotification(result);
                    } else {
                        showNotification(result.message || 'Ошибка при оформлении заказа', 'error');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                    console.error('Response text:', xhr.responseText);
                    showNotification('Ошибка обработки ответа от сервера', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } else if (xhr.status === 401) {
                showNotification('Сессия истекла. Пожалуйста, войдите в систему снова.', 'error');
                openAuthModal();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            } else {
                showNotification('Ошибка соединения с сервером. Код: ' + xhr.status, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    };
    
    xhr.onerror = function() {
        showNotification('Ошибка сети. Проверьте подключение к интернету.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    };
    
    xhr.send(JSON.stringify(orderData));
}
function showSuccessOrderNotification(result) {
    var orderSuccess = document.createElement('div');
    orderSuccess.className = 'order-success-modal';
    orderSuccess.innerHTML = `
        <div class="order-success-content">
            <div class="success-icon">✓</div>
            <h3>Заказ успешно оформлен!</h3>
            <p style="font-size: 1.3rem; margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                Номер заказа: <strong style="color: #ff6b95;">${result.order_number}</strong>
            </p>
            <p style="color: #666; margin-bottom: 20px;">
                Мы свяжемся с вами для подтверждения заказа.
            </p>
            <button class="close-success" onclick="this.closest('.order-success-modal').remove(); window.location.reload()" 
                    style="padding: 12px 30px; background: linear-gradient(135deg, #ff6b95, #ff93a7); color: white; border: none; border-radius: 25px; font-size: 1rem; cursor: pointer;">
                OK
            </button>
        </div>
    `;
    
    document.body.appendChild(orderSuccess);
}

function showNotification(message, type) {
    var existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.parentNode.removeChild(existingNotification);
    }
    
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    
    var iconSvg = '';
    if (type === 'success') {
        iconSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (type === 'error') {
        iconSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (type === 'warning') {
        iconSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
        iconSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    
    notification.innerHTML = '<div class="notification-icon">' + iconSvg + '</div><div class="notification-message">' + message + '</div>';
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

function closeAllModals() {
    var modals = document.querySelectorAll('.modal');
    for (var i = 0; i < modals.length; i++) {
        modals[i].style.display = 'none';
    }
    
    var cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.className = cartSidebar.className.replace(' active', '');
    }
    
    var overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function preventHorizontalScroll() {
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }
}

function handleTouchStart(e) {
    e.target.style.transform = 'scale(0.95)';
    setTimeout(function() {
        e.target.style.transform = 'scale(1)';
    }, 150);
}

function checkAuthStatus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'check_auth.php', true);
    xhr.withCredentials = true;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var userData = JSON.parse(xhr.responseText);
                    if (userData.loggedIn) {
                        currentUser = userData.user;
                        console.log('Auth check: user logged in', currentUser);
                    } else {
                        currentUser = null;
                        console.log('Auth check: user not logged in');
                    }
                    updateAuthUI();
                } catch (e) {
                    console.error('Auth check parse error:', e);
                    currentUser = null;
                    updateAuthUI();
                }
            } else {
                console.error('Auth check HTTP error:', xhr.status);
                currentUser = null;
                updateAuthUI();
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Auth check network error');
        currentUser = null;
        updateAuthUI();
    };
    
    xhr.send();
}

function updateAuthUI() {
    var accountIcon = document.querySelector('.account-icon');
    var headerProfileBtn = document.getElementById('headerProfileBtn');
    var headerProfileName = document.getElementById('headerProfileName');
    var adminPanelBtn = document.getElementById('adminPanelBtn');
    var userNameSpan = document.getElementById('userName');
    
    if (currentUser) {
        if (accountIcon) accountIcon.style.display = 'none';
        
        if (headerProfileBtn) {
            headerProfileBtn.style.display = 'flex';
            if (headerProfileName) {
                headerProfileName.textContent = currentUser.username || 'Профиль';
            }
        }
        
        if (userNameSpan) {
            userNameSpan.textContent = currentUser.username || 'Профиль';
        }
        
        if (adminPanelBtn) {
            if (currentUser.role === 'admin') {
                adminPanelBtn.style.display = 'block';
            } else {
                adminPanelBtn.style.display = 'none';
            }
        }
    } else {
        if (accountIcon) accountIcon.style.display = 'flex';
        
        if (headerProfileBtn) {
            headerProfileBtn.style.display = 'none';
        }
        
        if (adminPanelBtn) {
            adminPanelBtn.style.display = 'none';
        }
        
        if (userNameSpan) {
            userNameSpan.textContent = '';
        }
    }
}

window.openAuthModal = function() {
    var authModal = document.getElementById('authModal');
    var overlay = document.getElementById('overlay');
    
    if (authModal && overlay) {
        authModal.style.display = 'flex';
        overlay.style.display = 'block';
        showLoginForm();
        
        var loginForm = document.getElementById('loginFormElement');
        var registerForm = document.getElementById('registerFormElement');
        
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
    }
};

window.closeAuthModal = function() {
    var authModal = document.getElementById('authModal');
    var overlay = document.getElementById('overlay');
    
    if (authModal) {
        authModal.style.display = 'none';
    }
    
    if (overlay && !document.querySelector('.modal[style*="display: flex"]')) {
        overlay.style.display = 'none';
    }
};

window.showLoginForm = function() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
};

window.showRegisterForm = function() {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
};

window.handleLogin = function(event) {
    event.preventDefault();
    console.log('=== LOGIN START ===');
    
    var form = event.target;
    var formData = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.innerHTML : 'Войти';
    
    if (submitBtn) {
        submitBtn.innerHTML = '<span>Вход...</span>';
        submitBtn.disabled = true;
    }
    
    var email = formData.get('email');
    var password = formData.get('password');
    
    console.log('Login attempt for:', email);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'login.php', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    console.log('Login result:', result);
                    
                    if (result.success) {
                        showNotification('Вход выполнен успешно!', 'success');
                        
                        currentUser = result.user || {
                            username: result.username || 'Пользователь',
                            role: result.role || 'user'
                        };
                        
                        closeAuthModal();
                        updateAuthUI();
                        
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                        
                    } else {
                        showNotification(result.message || 'Ошибка входа', 'error');
                        if (submitBtn) {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                    console.error('Response text:', xhr.responseText);
                    showNotification('Ошибка сервера: неверный формат ответа', 'error');
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }
            } else {
                showNotification('Ошибка соединения с сервером (код: ' + xhr.status + ')', 'error');
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        }
    };
    
    xhr.onerror = function() {
        showNotification('Ошибка сети. Проверьте подключение к интернету.', 'error');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    };
    
    xhr.send(JSON.stringify({
        email: email,
        password: password
    }));
    
    return false;
};

window.handleRegister = function(event) {
    event.preventDefault();
    console.log('=== REGISTER START ===');
    
    var form = event.target;
    var formData = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn ? submitBtn.innerHTML : 'Зарегистрироваться';
    
    if (submitBtn) {
        submitBtn.innerHTML = '<span>Регистрация...</span>';
        submitBtn.disabled = true;
    }
    
    var username = formData.get('username');
    var email = formData.get('email');
    var password = formData.get('password');
    var confirm_password = formData.get('confirm_password');
    var phone = formData.get('phone') || '';
    
    console.log('Register data:', { username: username, email: email, phone: phone });
    
    if (!username || !email || !password) {
        showNotification('Заполните все обязательные поля', 'error');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        return false;
    }
    
    if (password !== confirm_password) {
        showNotification('Пароли не совпадают', 'error');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен быть не менее 6 символов', 'error');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        return false;
    }
    
    var dataToSend = {
        username: username,
        email: email,
        password: password
    };
    
    if (phone && phone.trim() !== '') {
        dataToSend.phone = phone.trim();
    }
    
    console.log('Sending to server:', dataToSend);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'register.php', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    console.log('Register result:', result);
                    
                    if (result.success) {
                        showNotification('Регистрация успешна! Выполняется вход...', 'success');
                        
                        currentUser = result.user || {
                            username: username,
                            role: 'user'
                        };
                        
                        closeAuthModal();
                        updateAuthUI();
                        
                        if (form) form.reset();
                        
                        setTimeout(function() {
                            window.location.reload();
                        }, 1500);
                        
                    } else {
                        showNotification(result.message || 'Ошибка регистрации', 'error');
                        if (submitBtn) {
                            submitBtn.innerHTML = originalText;
                            submitBtn.disabled = false;
                        }
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                    console.error('Response text:', xhr.responseText);
                    showNotification('Ошибка сервера: неверный формат ответа', 'error');
                    if (submitBtn) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }
            } else {
                showNotification('Ошибка соединения с сервером (код: ' + xhr.status + ')', 'error');
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        }
    };
    
    xhr.onerror = function() {
        showNotification('Ошибка сети. Проверьте подключение к интернету.', 'error');
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    };
    
    xhr.send(JSON.stringify(dataToSend));
    
    return false;
};

window.toggleAccount = function() {
    console.log('toggleAccount called');
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'check_auth.php', true);
    xhr.withCredentials = true;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var userData = JSON.parse(xhr.responseText);
                    
                    if (userData.loggedIn) {
                        console.log('User is logged in, redirecting to profile');
                        window.location.href = '/user_profile/user_profile.php';
                    } else {
                        console.log('User is not logged in, opening auth modal');
                        openAuthModal();
                    }
                } catch (e) {
                    console.error('JSON parse error:', e);
                    openAuthModal();
                }
            } else {
                console.error('Auth check failed:', xhr.status);
                openAuthModal();
            }
        }
    };
    
    xhr.send();
};

window.logout = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'logout.php', true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        showNotification('Вы вышли из системы', 'info');
                    }
                } catch (e) {
                    console.error('Logout parse error:', e);
                }
            }
            
            currentUser = null;
            updateAuthUI();
            
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        }
    };
    
    xhr.send();
};

function initializeAuth() {
    checkAuthStatus();
    
    document.addEventListener('click', function(e) {
        var userPanel = document.getElementById('userPanel');
        var accountIcon = document.querySelector('.account-icon');
        var adminBtn = document.getElementById('admin-panel-btn');
        
        if (userPanel && userPanel.style.display === 'block' && 
            !userPanel.contains(e.target) && 
            !(accountIcon && accountIcon.contains(e.target)) &&
            !(adminBtn && adminBtn.contains(e.target))) {
            userPanel.style.display = 'none';
        }
    });
}

window.showProfile = function() {
    showNotification('Раздел "Профиль" в разработке', 'info');
};

window.showAdminPanel = function() {
    window.location.href = '/admin/index.php';
};

var favorites = JSON.parse(localStorage.getItem('floralCharmFavorites')) || [];

window.toggleFavorite = function(productId) {
    var index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Товар удален из избранного', 'info');
    } else {
        favorites.push(productId);
        showNotification('Товар добавлен в избранное', 'success');
    }
    localStorage.setItem('floralCharmFavorites', JSON.stringify(favorites));
    updateFavoriteIcons();
};

function updateFavoriteIcons() {
    var icons = document.querySelectorAll('.favorite-icon');
    for (var i = 0; i < icons.length; i++) {
        var icon = icons[i];
        var productId = icon.dataset.productId;
        if (favorites.indexOf(productId) > -1) {
            icon.innerHTML = '<img src="https://www.flaticon.com/ru/free-icon/heart_2107845" width="16" height="16" style="vertical-align: middle;">';
            icon.style.color = '#ff6b95';
        } else {
            icon.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/128/1077/1077035.png" width="16" height="16" style="vertical-align: middle;">';
            icon.style.color = '#ccc';
        }
    }
}

function setupSearch() {
    var existingSearch = document.querySelector('.header input[placeholder="Поиск букетов..."]');
    if (existingSearch) {
        return;
    }
    
    var searchInput = document.createElement('input');
    searchInput.placeholder = 'Поиск букетов...';
    searchInput.style.cssText = `
        padding: 10px 15px 10px 40px;
        border: 2px solid #ff6b95;
        border-radius: 25px;
        width: 300px;
        margin: 0 20px;
        font-size: 16px;
        background-image: url('https://cdn-icons-png.flaticon.com/128/3495/3495620.png');
        background-size: 20px 20px;
        background-position: 12px center;
        background-repeat: no-repeat;
    `;
    
    searchInput.oninput = function(e) {
        var searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 2) {
            searchProducts(searchTerm);
        } else if (searchTerm.length === 0) {
            loadInitialProducts();
        }
    };
    
    var headerContainer = document.querySelector('.header .container');
    if (headerContainer) {
        var nav = headerContainer.querySelector('.nav');
        if (nav) {
            var nextElement = nav.nextSibling;
            if (!nextElement || !nextElement.classList || !nextElement.classList.contains('search-input')) {
                searchInput.classList.add('search-input');
                nav.parentNode.insertBefore(searchInput, nav.nextSibling);
            }
        }
    }
}

function searchProducts(searchTerm) {
    var filteredProducts = [];
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        if (product.name.toLowerCase().indexOf(searchTerm) > -1 ||
            product.description.toLowerCase().indexOf(searchTerm) > -1 ||
            product.category.toString().toLowerCase().indexOf(searchTerm) > -1) {
            filteredProducts.push(product);
        }
    }
    renderProducts(filteredProducts);
}

function initCustomOrderForm() {
    setupCustomOrderForm();
    
    var customOrderForm = document.getElementById('custom-order-form');
    if (customOrderForm) {
        customOrderForm.onsubmit = function(e) {
            e.preventDefault();
            handleCustomOrderSubmit(e);
        };
    }
}

function setupCustomOrderForm() {
    var budgetSlider = document.getElementById('budget-slider');
    var budgetValue = document.getElementById('budget-value');
    var budgetFill = document.getElementById('budget-fill');
    var budgetHandle = document.getElementById('budget-handle');
    var descTextarea = document.getElementById('custom-description');
    var charCount = document.getElementById('desc-char-count');
    
    if (!budgetSlider || !budgetValue || !budgetFill) return;
    
    updateBudgetSlider();
    
    budgetSlider.oninput = updateBudgetSlider;
    
    if (budgetHandle) {
        budgetSlider.onmousedown = function() {
            budgetHandle.classList.add('active');
        };
        budgetSlider.onmouseup = function() {
            budgetHandle.classList.remove('active');
        };
        budgetSlider.ontouchstart = function() {
            budgetHandle.classList.add('active');
        };
        budgetSlider.ontouchend = function() {
            budgetHandle.classList.remove('active');
        };
    }
    
    if (descTextarea && charCount) {
        descTextarea.oninput = function() {
            var count = this.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
                charCount.style.color = 'var(--error)';
            } else if (count > 900) {
                charCount.style.color = 'var(--warning)';
            } else {
                charCount.style.color = 'var(--text-light)';
            }
        };
        
        charCount.textContent = descTextarea.value.length;
    }
}

function updateBudgetSlider() {
    var budgetSlider = document.getElementById('budget-slider');
    var budgetValue = document.getElementById('budget-value');
    var budgetFill = document.getElementById('budget-fill');
    var budgetHandle = document.getElementById('budget-handle');
    
    if (!budgetSlider || !budgetValue || !budgetFill) return;
    
    var value = parseInt(budgetSlider.value);
    var min = parseInt(budgetSlider.min);
    var max = parseInt(budgetSlider.max);
    
    budgetValue.textContent = value.toLocaleString() + ' ₽';
    
    if (budgetFill && budgetHandle) {
        var percent = ((value - min) / (max - min)) * 100;
        budgetFill.style.width = percent + '%';
        budgetHandle.style.left = percent + '%';
    }
}

function handleCustomOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('custom-name').value.trim();
    const phone = document.getElementById('custom-phone').value.trim();
    const email = document.getElementById('custom-email').value.trim();
    const description = document.getElementById('custom-description').value.trim();
    const budget = document.getElementById('budget-slider').value;
    
    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        document.getElementById('custom-name').focus();
        return;
    }
    
    if (!phone) {
        alert('Пожалуйста, введите ваш телефон');
        document.getElementById('custom-phone').focus();
        return;
    }
    
    if (!description) {
        alert('Пожалуйста, опишите желаемый букет');
        document.getElementById('custom-description').focus();
        return;
    }
    
    try {
        if (typeof showNotification === 'function') {
            showNotification('Ваша заявка отправлена! Флорист свяжется с вами в течение 2 часов в рабочее время.', 'success');
        }
    } catch(e) {
        console.error('showNotification error:', e);
    }
    
    alert('Заявка отправлена! Флорист свяжется с вами в течение 2 часов.');
    
    const submitBtn = document.querySelector('.submit-custom-order');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Отправка...</span>';
    submitBtn.disabled = true;
    
    document.getElementById('custom-name').value = '';
    document.getElementById('custom-phone').value = '';
    document.getElementById('custom-email').value = '';
    document.getElementById('custom-description').value = '';
    document.getElementById('budget-slider').value = 5000;
    
    const charCount = document.getElementById('desc-char-count');
    if (charCount) {
        charCount.textContent = '0';
        charCount.style.color = 'var(--text-light)';
    }
    
    updateBudgetSlider();
    
    saveCustomOrderToStorage({
        type: 'custom-order',
        id: `custom-${Date.now()}`,
        timestamp: new Date().toISOString(),
        name: name,
        phone: phone,
        email: email || '',
        description: description,
        budget: parseInt(budget),
        status: 'new'
    });
    
    const customOrder = {
        name: name,
        phone: phone,
        email: email || '',
        description: description,
        budget: parseInt(budget)
    };
    
    fetch('save_custom_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customOrder)
    })
    .then(response => {
        if (!response.ok) {
            console.log(`Сервер вернул статус ${response.status}, но заявка уже принята локально`);
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            console.log('Заявка сохранена на сервере с ID:', data.orderId);
        }
    })
    .catch(error => {
        console.log('Сервер недоступен, заявка сохранена локально:', error);
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function saveCustomOrderToStorage(order) {
    try {
        var customOrders = JSON.parse(localStorage.getItem('floralCharmCustomOrders')) || [];
        customOrders.push(order);
        localStorage.setItem('floralCharmCustomOrders', JSON.stringify(customOrders));
        console.log('Заявка сохранена в localStorage для истории');
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
    }
}

function initDadata() {
    var deliveryType = document.querySelector('input[name="delivery-type"]:checked');
    if (deliveryType && deliveryType.value === 'pickup') {
        console.log('Самовывоз - DaData не инициализируем');
        return;
    }
    
    if (typeof $ === 'undefined') {
        console.log('jQuery не загружен, ждем...');
        setTimeout(initDadata, 500);
        return;
    }
    
    if (typeof $.fn.suggestions === 'undefined') {
        console.log('DaData не загружен, подключаем...');
        
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/suggestions-jquery@21.12.0/dist/js/jquery.suggestions.min.js';
        script.onload = function() {
            console.log('DaData загружен, инициализация...');
            setTimeout(initDadataNow, 500);
        };
        document.head.appendChild(script);
        
        if (!document.querySelector('link[href*="suggestions-jquery"]')) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/suggestions-jquery@21.12.0/dist/css/suggestions.min.css';
            document.head.appendChild(link);
        }
        
        return;
    }
    
    initDadataNow();
}

function initDadataNow() {
    var deliveryType = document.querySelector('input[name="delivery-type"]:checked');
    if (deliveryType && deliveryType.value === 'pickup') {
        console.log('Самовывоз - DaData не инициализируем');
        return;
    }
    
    if (!$('#address').length) {
        console.log('Поле адреса не найдено');
        return;
    }
    
    const DADATA_API_KEY = 'da1b0f9b66a1e17d82b68371185391d4da132ed1';
    
    try {
        if ($('#address').data('suggestions')) {
            $('#address').suggestions('destroy');
        }
        
        var isMobile = window.innerWidth <= 768;
        
        var settings = {
            token: DADATA_API_KEY,
            type: 'ADDRESS',
            count: isMobile ? 5 : 10,
            constraints: {
                locations: [
                    { region: 'Москва' },
                    { region: 'Московская обл' }
                ]
            },
            formatSelected: function(suggestion) {
                return suggestion.value;
            },
            onSelect: function(suggestion) {
                console.log('Адрес выбран:', suggestion.value);
                
                $('#address').css({
                    'border-color': '#28a745',
                    'background-color': '#f0fff0'
                });
                
                if (window.innerWidth <= 768) {
                    $('#address').css({
                        'background-image': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'><path fill=\'%2328a745\' d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\'/></svg>")',
                        'background-repeat': 'no-repeat',
                        'background-position': 'right 12px center',
                        'background-size': '24px'
                    });
                } else {
                    $('#address').css({
                        'background-image': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 24 24\'><path fill=\'%2328a745\' d=\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z\'/></svg>")',
                        'background-repeat': 'no-repeat',
                        'background-position': 'right 12px center',
                        'background-size': '20px'
                    });
                }
                
                $('#address').data('dadata-data', suggestion.data);
                
                if (suggestion.data.flat) {
                    $('#apartment').val(suggestion.data.flat);
                }
                
                if (typeof showNotification === 'function') {
                    showNotification('Адрес подтверждён!', 'success');
                }
                
                if (window.innerWidth <= 768) {
                    $('#address').blur();
                }
            },
            onError: function(error) {
                console.error('Ошибка DaData:', error);
                $('#address').css('border-color', '#dc3545');
                if (typeof showNotification === 'function') {
                    showNotification('Ошибка загрузки адресов', 'error');
                }
            }
        };
        
        if (isMobile) {
            settings.noSuggestionsHint = 'Адресов не найдено';
            settings.hintDelay = 300;
            settings.onSearchStart = function() {
                $('#address').removeAttr('readonly');
            };
        }
        
        $('#address').suggestions(settings);
        $('#address').removeAttr('required');
        
        console.log(isMobile ? 'DaData инициализирован (МОБИЛЬНАЯ ВЕРСИЯ)' : 'DaData инициализирован (ПК ВЕРСИЯ)');
        
        $('#address').on('input', function() {
            $(this).css({
                'border-color': '',
                'background-color': '',
                'background-image': 'none'
            });
        });
        
        if (isMobile) {
            $('#address').attr({
                'autocorrect': 'off',
                'autocapitalize': 'none',
                'spellcheck': 'false'
            });
        }
        
    } catch (e) {
        console.error('Ошибка инициализации DaData:', e);
        if (typeof showNotification === 'function') {
            showNotification('Ошибка инициализации адресных подсказок', 'error');
        }
    }
}

function testDadataKey() {
    const DADATA_API_KEY = 'da1b0f9b66a1e17d82b68371185391d4da132ed1';
    
    $.ajax({
        url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + DADATA_API_KEY
        },
        data: JSON.stringify({
            query: 'Москва Тверская',
            count: 1,
            locations: [{ region: 'Москва' }]
        }),
        success: function(response) {
            console.log('DaData API ключ РАБОТАЕТ!');
        },
        error: function(xhr, status, error) {
            console.error('DaData API ключ НЕ РАБОТАЕТ:', error);
        }
    });
}

function validateDeliveryAddress() {
    var addressInput = document.getElementById('address');
    if (!addressInput) return true;
    
    var deliveryType = document.querySelector('input[name="delivery-type"]:checked');
    if (deliveryType && deliveryType.value === 'pickup') {
        return true;
    }
    
    var dadataData = $('#address').data('dadata-data');
    var addressValue = addressInput.value.trim();
    
    if (!addressValue) return true;
    
    if (!dadataData) {
        showNotification('Пожалуйста, выберите адрес из выпадающего списка', 'error');
        addressInput.focus();
        addressInput.style.borderColor = '#dc3545';
        return false;
    }
    
    var region = dadataData.region;
    if (region !== 'Москва' && region !== 'Московская обл') {
        showNotification('Мы доставляем только по Москве и Московской области', 'error');
        addressInput.focus();
        addressInput.style.borderColor = '#dc3545';
        return false;
    }
    
    return true;
}

$(document).ready(function() {
    testDadataKey();
    
    var deliveryType = document.querySelector('input[name="delivery-type"]:checked');
    if (deliveryType && deliveryType.value === 'delivery') {
        setTimeout(initDadata, 1000);
    } else {
        console.log('Самовывоз по умолчанию - DaData не запущен');
    }
});

$(document).ajaxComplete(function() {
    var deliveryType = document.querySelector('input[name="delivery-type"]:checked');
    if (deliveryType && deliveryType.value === 'delivery') {
        if ($('#address').length && !$('#address').data('suggestions')) {
            setTimeout(initDadata, 500);
        }
    }
});

function setupMobileAddress() {
    if (window.innerWidth <= 768) {
        var addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.setAttribute('autocorrect', 'off');
            addressInput.setAttribute('autocapitalize', 'none');
            addressInput.setAttribute('spellcheck', 'false');
            addressInput.style.fontSize = '16px';
            
            $(addressInput).on('blur', function() {
                window.scrollTo(0, 0);
            });
        }
    }
}

$(document).ready(function() {
    setupMobileAddress();
});

function showAbout() {
    console.log('showAbout called');
    showNotification('Раздел "О нас" в разработке', 'info');
}

function showContact() {
    console.log('showContact called');
    var footer = document.getElementById('footer');
    if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
    }
}

function showDelivery() {
    console.log('showDelivery called');
    showNotification('Информация о доставке в разработке', 'info');
}

function showReviews() {
    console.log('showReviews called');
    var reviews = document.getElementById('reviews-section');
    if (reviews) {
        reviews.scrollIntoView({ behavior: 'smooth' });
    }
}

function showPrivacy() {
    console.log('showPrivacy called');
    showNotification('Политика конфиденциальности в разработке', 'info');
}

function showMyOrders() {
    console.log('showMyOrders called');
    if (!currentUser) {
        showNotification('Пожалуйста, войдите в систему', 'error');
        openAuthModal();
        return;
    }
    showNotification('Раздел "Мои заказы" в разработке', 'info');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    var loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            return window.handleLogin(e);
        };
    }
    
    var registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.onsubmit = function(e) {
            e.preventDefault();
            return window.handleRegister(e);
        };
    }
    
    var checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.onsubmit = function(e) {
            e.preventDefault();
            submitOrder();
        };
    }
});

window.openProductModal = openProductModal;
window.showCategoryProducts = showCategoryProducts;
window.showAllCategories = showAllCategories;
window.toggleCart = toggleCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
window.addRecommendedToCart = addRecommendedToCart;
window.toggleFavorite = toggleFavorite;
window.toggleAccount = toggleAccount;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.showProfile = showProfile;
window.showAdminPanel = showAdminPanel;
window.showAbout = showAbout;
window.showContact = showContact;
window.showDelivery = showDelivery;
window.showReviews = showReviews;
window.showPrivacy = showPrivacy;
window.showMyOrders = showMyOrders;
window.showCheckout = showCheckout;
window.validateDeliveryAddress = validateDeliveryAddress;
window.initDadata = initDadata;
window.testDadataKey = testDadataKey;
window.setupMobileAddress = setupMobileAddress;


function initCustomDatePicker() {
    const dateInput = document.getElementById('delivery-date');
    if (!dateInput) return;
    
    let hiddenPicker = null;
    
    const openDatePicker = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (hiddenPicker) {
            hiddenPicker.remove();
        }
        
        hiddenPicker = document.createElement('input');
        hiddenPicker.type = 'date';
        hiddenPicker.style.position = 'fixed';
        hiddenPicker.style.left = '0';
        hiddenPicker.style.top = '0';
        hiddenPicker.style.width = '100%';
        hiddenPicker.style.height = '100%';
        hiddenPicker.style.opacity = '0';
        hiddenPicker.style.zIndex = '-1';
        document.body.appendChild(hiddenPicker);
        
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        hiddenPicker.min = `${yyyy}-${mm}-${dd}`;
        
        const currentVal = dateInput.getAttribute('data-value');
        if (currentVal) {
            hiddenPicker.value = currentVal;
        } else {
            hiddenPicker.value = `${yyyy}-${mm}-${dd}`;
        }
        hiddenPicker.addEventListener('change', function() {
            if (this.value) {
                const date = new Date(this.value);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
                dateInput.value = formattedDate;
                dateInput.setAttribute('data-value', this.value);
            }
            setTimeout(() => {
                if (hiddenPicker) hiddenPicker.remove();
                hiddenPicker = null;
            }, 100);
        });
        
        hiddenPicker.showPicker();
    };
    
    dateInput.addEventListener('click', openDatePicker);
    
    const icon = document.querySelector('.date-picker-icon');
    if (icon) {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', openDatePicker);
    }
    
    if (!dateInput.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${dd}.${mm}.${yyyy}`;
        dateInput.setAttribute('data-value', `${yyyy}-${mm}-${dd}`);
    }
}

// ========== ПРОМОКОДЫ ==========

// Переменные для хранения примененного промокода
let appliedPromoCode = null;
let appliedDiscount = 0;

// Функция для применения промокода
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    const applyBtn = document.getElementById('apply-promo-btn');
    const promoCode = promoInput ? promoInput.value.trim().toUpperCase() : '';
    
    if (!promoCode) {
        showPromoMessage('Введите промокод', 'error');
        return;
    }
    
    if (!applyBtn) return;
    
    applyBtn.disabled = true;
    applyBtn.textContent = 'Проверка...';
    
    fetch('check_promo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promo_code: promoCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            appliedPromoCode = promoCode;
            appliedDiscount = data.discount;
            showPromoMessage(`Промокод активирован! Скидка ${data.discount}%`, 'success');
            if (promoInput) promoInput.disabled = true;
            applyBtn.textContent = 'Активирован';
            applyBtn.style.opacity = '0.7';
            updateOrderTotal();
        } else {
            showPromoMessage(data.message || 'Неверный промокод', 'error');
            appliedPromoCode = null;
            appliedDiscount = 0;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        showPromoMessage('Ошибка проверки промокода', 'error');
    })
    .finally(() => {
        if (applyBtn) {
            applyBtn.disabled = false;
            if (!appliedPromoCode) {
                applyBtn.textContent = 'Применить';
            }
        }
    });
}

// Функция показа сообщения о промокоде
function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promo-message');
    if (!promoMessage) return;
    
    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${type}`;
    promoMessage.style.display = 'block';
    
    if (type !== 'success') {
        setTimeout(() => {
            if (promoMessage) promoMessage.style.display = 'none';
        }, 5000);
    }
}
function updateOrderTotal() {
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    
    const deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    let deliveryType = 'delivery';
    for (let i = 0; i < deliveryRadios.length; i++) {
        if (deliveryRadios[i].checked) {
            deliveryType = deliveryRadios[i].value;
            break;
        }
    }
    
    const deliveryCost = deliveryType === 'delivery' ? 200 : 0;
    
    // Расчет скидки
    let discountAmount = 0;
    if (appliedPromoCode && appliedDiscount > 0) {
        discountAmount = subtotal * (appliedDiscount / 100);
    }
    
    const total = subtotal + deliveryCost - discountAmount;
    
    const deliveryCostEl = document.getElementById('delivery-cost');
    const orderTotal = document.getElementById('order-total');
    let discountRow = document.getElementById('discount-row');
    let discountValue = document.getElementById('discount-value');
    
    if (deliveryCostEl) {
        deliveryCostEl.textContent = deliveryType === 'delivery' ? '200 ₽' : 'Бесплатно';
    }
    
    // Показываем или скрываем строку со скидкой
    if (discountAmount > 0 && appliedPromoCode) {
        if (!discountRow) {
            const deliveryInfo = document.querySelector('.delivery-info');
            if (deliveryInfo) {
                const newDiscountRow = document.createElement('p');
                newDiscountRow.id = 'discount-row';
                newDiscountRow.className = 'delivery-cost-line';
                newDiscountRow.innerHTML = `Скидка (${appliedDiscount}%): <span id="discount-value">-${Math.round(discountAmount)} ₽</span>`;
                deliveryInfo.insertBefore(newDiscountRow, deliveryInfo.firstChild.nextSibling);
            }
        } else {
            discountRow.style.display = 'flex';
            if (discountValue) discountValue.textContent = `-${Math.round(discountAmount)} ₽`;
        }
    } else {
        if (discountRow) {
            discountRow.style.display = 'none';
        }
    }
    
    if (orderTotal) {
        orderTotal.textContent = Math.round(total).toLocaleString() + ' ₽';
    }
}
