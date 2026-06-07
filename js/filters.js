/**
 * FILTERS.JS — Логіка фільтрації контенту (Завдання 6)
 */

/**
 * Ініціалізація системи фільтрації
 * Працює через data-атрибути: data-filter на кнопках та data-category на картках
 */
export function initFilters() {
    // 1. Знаходимо всі кнопки фільтрації
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // 2. Знаходимо всі елементи, які можна фільтрувати (картки)
    const filterItems = document.querySelectorAll('.filter-item');

    // Перевірка: якщо на сторінці немає кнопок або карток — зупиняємо роботу
    if (filterButtons.length === 0 || filterItems.length === 0) return;

    console.log("🔍 Система фільтрації готова до роботи");

    // 3. Додаємо обробник події "клік" для кожної кнопки
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Отримуємо значення фільтра з атрибута data-filter (наприклад: 'web', 'design' або 'all')
            const filterValue = button.getAttribute('data-filter');

            // --- КРОК А: Оновлюємо стан кнопок ---
            // Видаляємо клас .is-active у всіх кнопок
            filterButtons.forEach(btn => btn.classList.remove('is-active'));
            // Додаємо клас .is-active тій кнопці, на яку натиснули
            button.classList.add('is-active');

            // --- КРОК Б: Фільтруємо картки ---
            filterItems.forEach(item => {
                // Отримуємо категорію конкретної картки
                const itemCategory = item.getAttribute('data-category');

                // Логіка показу:
                // Якщо обрано "all" (Всі) — показуємо все.
                // Якщо категорія картки збігається з фільтром — показуємо її.
                if (filterValue === 'all' || filterValue === itemCategory) {
                    // Показуємо елемент (прибираємо атрибут hidden та додаємо клас для анімації)
                    item.hidden = false;
                    item.classList.add('animate-in'); // Клас для плавного з'явлення в CSS
                } else {
                    // Ховаємо елемент
                    item.hidden = true;
                    item.classList.remove('animate-in');
                }
            });

            console.log(`Фільтр застосовано: ${filterValue}`);
        });
    });
}