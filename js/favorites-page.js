import { getItems } from './api.js';
import { getFavorites, toggleFavorite, isFavorite } from './favorites.js';

export async function initFavoritesPage() {
    const container = document.querySelector('[data-favorites]');
    if (!container) return;

    try {
        const allItems = await getItems();
        const favIds = getFavorites(); // Отримуємо масив ID з localStorage

        // Фільтруємо: залишаємо тільки ті об'єкти, чий ID є в обраному
        const favoriteItems = allItems.filter(item => favIds.includes(item.id));

        renderFavorites(favoriteItems, container);
    } catch (error) {
        container.innerHTML = '<p>Помилка завантаження обраного.</p>';
    }
}

function renderFavorites(items, container) {
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state card">
                <h3>Список порожній 🤍</h3>
                <p>Ви ще не додали жодної послуги в обране.</p>
                <a href="catalog.html" class="btn-primary">Перейти до каталогу</a>
            </div>`;
        return;
    }

    // Тут використовуємо таку ж логіку рендерингу, як у каталозі
    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'item-card card animate-in';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <button class="btn-remove" data-id="${item.id}">Видалити</button>
        `;

        card.querySelector('.btn-remove').addEventListener('click', () => {
            toggleFavorite(item.id); // Видаляємо з localStorage
            initFavoritesPage(); // Перезавантажуємо сторінку для оновлення списку
        });

        container.appendChild(card);
    });
}