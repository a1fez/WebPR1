/**
 * UI.JS — Компоненти інтерфейсу
 * (Тема, Меню, Скрол, UI-стани, Модальне вікно)
 */

/**
 *  ЗАВДАННЯ 3: Перемикач теми (LocalStorage)
 */
export function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const root = document.documentElement;

    // Відновлення теми
    const savedTheme = localStorage.getItem('siteTheme');

    if (savedTheme === 'dark') {
        root.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Світла';
    } else {
        themeBtn.textContent = 'Змінити тему 🌙';
    }

    // Перемикання теми
    themeBtn.addEventListener('click', () => {
        const isDark = root.classList.toggle('dark-mode');

        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
        themeBtn.textContent = isDark ? '☀️ Світла' : 'Змінити тему 🌙';
    });
}

/**
 *  ЗАВДАННЯ 4: Мобільне меню
 */
export function initMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('is-open');
        menuBtn.classList.toggle('active');
    });

    // Закриття при кліку на посилання
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            menuBtn.classList.remove('active');
        });
    });
}

/**
 *  БОНУС: Кнопка "Вгору"
 */
export function initScroll() {
    const topBtn = document.getElementById('back-to-top');
    if (!topBtn) return;

    window.addEventListener('scroll', () => {
        topBtn.hidden = window.scrollY <= 300;
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 *  ЗАВДАННЯ 6: UI-стани (loading / error / empty / success)
 */
export function showLoading(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="loader card">
            <p>Завантаження...</p>
        </div>
    `;
}

export function showError(container, message) {
    if (!container) return;

    container.innerHTML = `
        <div class="error-state card">
            <h3>Помилка ❌</h3>
            <p>${message}</p>
        </div>
    `;
}

export function showEmpty(container, text = 'Нічого не знайдено') {
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state card">
            <p>🔍 ${text}</p>
        </div>
    `;
}

export function showSuccess(container, message) {
    if (!container) return;

    container.innerHTML = `
        <div class="success-state">
            <p style="color:green;">
                ${message}
            </p>
        </div>
    `;
}

/**
 *  ЗАВДАННЯ 10: Модальне вікно (open / close)
 */
export function openModal(content) {
    const modal = document.getElementById('item-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = content;

    modal.hidden = false;
    modal.style.display = 'flex';
}

export function closeModal() {
    const modal = document.getElementById('item-modal');
    if (!modal) return;

    modal.hidden = true;
    modal.style.display = 'none';
}

/**
 *  Ініціалізація модалки
 */
export function initModal() {
    const modal = document.getElementById('item-modal');
    const closeBtn = document.getElementById('close-modal');

    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}