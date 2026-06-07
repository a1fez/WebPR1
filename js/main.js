/**
 * ПРАКТИЧНА РОБОТА №7-8: JavaScript для багатосторінкового сайту
 * Усі завдання (1-10) в одному файлі.
 */
import { initCatalog } from './catalog.js';
import { initFavoritesPage } from './favorites-page.js'; // Імпортуємо нову логіку
import { initTheme, initMenu, initModal } from './ui.js';
import { initItemFormPage } from './form.js'; // 🔥 ДОДАНО



// 1. Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 JavaScript ініціалізовано успішно!");

    initActiveNav();      // Завдання 2: Навігація
    initThemeToggle();    // Завдання 3: Тема (LocalStorage)
    initMenuToggle();     // Завдання 4: Мобільне меню
    initAccordion();      // Завдання 5: Акордеон
    initFilters();        // Завдання 6: Фільтрація
    initModals();         // Завдання 7: Модальні вікна
    initContactForm();    // Завдання 8, 9, 10: Логіка форми
    initBackToTop();      // Бонус: Кнопка "Вгору"
    
    // Якщо хочеш завантажувати послуги з JSON — розкоментуй нижче:
    // loadServices(); 
    initTheme();
    initMenu();

    // Запускаємо каталог, якщо ми на сторінці каталогу
    initCatalog();

    // Запускаємо обране, якщо ми на сторінці обраного
    initFavoritesPage();

    initModal();
    initItemFormPage();
});

/**
 * ЗАВДАННЯ 2: ПІДСВІЧУВАННЯ АКТИВНОЇ СТОРІНКИ
 */
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Перевіряємо збіг шляху або головну сторінку
        if (currentPath.endsWith(href) || (currentPath === '/' && href.includes('index.html'))) {
            link.classList.add('is-active');
        } else {
            link.classList.remove('is-active');
        }
    });
}

/**
 * ЗАВДАННЯ 3: ПЕРЕМИКАЧ ТЕМИ (LOCALSTORAGE)
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Відновлення теми з пам'яті
    if (localStorage.getItem('siteTheme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Світла';
    }

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
        themeBtn.textContent = isDark ? '☀️ Світла' : '🌙 Тема';
    });
}

/**
 * ЗАВДАННЯ 4: МОБІЛЬНЕ МЕНЮ (ГАМБУРГЕР)
 */
function initMenuToggle() {
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        menuBtn.classList.toggle('active'); // Анімація іконки
    });
}

/**
 * ЗАВДАННЯ 5: АКОРДЕОН
 */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('is-active');
        });
    });
}

/**
 * ЗАВДАННЯ 6: ФІЛЬТРАЦІЯ КОНТЕНТУ
 */
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.filter-item');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const filter = btn.dataset.filter;
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.hidden = false;
                    item.classList.add('animate-in');
                } else {
                    item.hidden = true;
                    item.classList.remove('animate-in');
                }
            });
        });
    });
}

/**
 * ЗАВДАННЯ 7: МОДАЛЬНІ ВІКНА
 */
function initModals() {
    const openBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.getElementById(btn.dataset.modalTarget);
            if (modal) modal.classList.add('is-open');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('is-open');
        });
    });
}

/**
 * ЗАВДАННЯ 8, 9, 10: ЛОГІКА КОНТАКТНОЇ ФОРМИ
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const textarea = document.getElementById('message');
    const charCounter = document.getElementById('char-current');
    const statusMsg = document.getElementById('form-message');
    if (!form || !textarea) return;

    // 8. Лічильник символів + 10. Чернетка
    textarea.addEventListener('input', () => {
        charCounter.textContent = textarea.value.length;
        localStorage.setItem('contactDraft', textarea.value);
    });

    // Відновлення чернетки
    const savedDraft = localStorage.getItem('contactDraft');
    if (savedDraft) {
        textarea.value = savedDraft;
        charCounter.textContent = savedDraft.length;
    }

    // 9. Відправка форми
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (textarea.value.length < 10) {
            statusMsg.textContent = "Повідомлення надто коротке!";
            statusMsg.className = "status-msg error";
            statusMsg.hidden = false;
            return;
        }

        statusMsg.textContent = "Дякуємо! Повідомлення успішно відправлено.";
        statusMsg.className = "status-msg success";
        statusMsg.hidden = false;

        form.reset();
        localStorage.removeItem('contactDraft');
        charCounter.textContent = '0';
        setTimeout(() => statusMsg.hidden = true, 5000);
    });
}

/**
 * БОНУС: КНОПКА ВГОРУ
 */
function initBackToTop() {
    const topBtn = document.getElementById('back-to-top');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        topBtn.hidden = window.scrollY <= 300;
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * ПРОСУНУТЕ: ЗАВАНТАЖЕННЯ З JSON (Fetch API)
 */
async function loadServices() {
    const container = document.querySelector('.filter-grid');
    if (!container) return;
    try {
        const response = await fetch('./data/services.json');
        const data = await response.json();
        // Тут можна динамічно створити HTML картки
        console.log("Дані з JSON завантажено:", data);
    } catch (e) {
        console.log("JSON не знайдено (це нормально для локального запуску без сервера)");
    }
}