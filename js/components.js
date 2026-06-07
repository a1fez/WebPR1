/**
 * COMPONENTS.JS — Логіка інтерактивних компонентів (Акордеон та Модальні вікна)
 */

/**
 * ЗАВДАННЯ 5: Акордеон (Розгортання/згортання блоків)
 */
export function initAccordion() {
    // Шукаємо заголовки акордеонів
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length === 0) return; // Вихід, якщо акордеонів немає на сторінці

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement; // Отримуємо весь блок акордеона
            const isActive = currentItem.classList.contains('is-active');

            // 1. (Опційно) Закриваємо всі інші відкриті акордеони
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('is-active');
                }
            });

            // 2. Перемикаємо стан поточної секції
            currentItem.classList.toggle('is-active');
            
            console.log(`Секцію акордеона "${header.textContent.trim()}" ${!isActive ? 'відкрито' : 'закрито'}`);
        });
    });
}

/**
 * ЗАВДАННЯ 7: Модальні вікна (Popups)
 */
export function initModals() {
    // Шукаємо кнопки, що відкривають модальні вікна (наприклад, з атрибутом data-modal-target)
    const modalBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    const overlays = document.querySelectorAll('.modal-overlay');

    if (modalBtns.length === 0) return; // Вихід, якщо модалок немає

    // 1. Відкриття модального вікна
    modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Забороняємо перехід, якщо це посилання
            const modalId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('is-open'); // Показуємо вікно
                document.body.style.overflow = 'hidden'; // Забороняємо скрол сторінки під модалкою
                console.log(`Відкрито модальне вікно: ${modalId}`);
            }
        });
    });

    // Універсальна функція закриття
    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('is-open');
            document.body.style.overflow = ''; // Повертаємо скрол сторінки
        }
    };

    // 2. Закриття через кнопку "Х" (хрестик)
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // 3. Закриття при кліку на фон (overlay) навколо вікна
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            // Якщо клікнули саме по фону, а не по самому вікну
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // 4. Закриття клавішею Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.is-open');
            if (activeModal) closeModal(activeModal);
        }
    });
}