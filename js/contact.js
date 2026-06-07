import { toggleFavorite, isFavorite } from './favorites.js';

let allItems = [];
let filteredAndSorted = [];
let itemsToShow = 4; // Скільки карток показувати за раз (Завдання 9)

export async function initCatalog() {
    const container = document.querySelector('[data-catalog]');
    const loadMoreBtn = document.getElementById('load-more');
    if (!container) return;

    try {
        allItems = await loadItems();
        filteredAndSorted = [...allItems];

        const updateUI = (resetPagination = true) => {
            if (resetPagination) itemsToShow = 4;
            
            // 1. Фільтрація та сортування (попередні завдання)
            const search = document.getElementById('catalog-search').value;
            const category = document.getElementById('filter-category').value;
            const sort = document.getElementById('sort-items').value;

            filteredAndSorted = filterAndSort(allItems, search, category, sort);

            // 2. Логіка "Показати ще"
            const portion = filteredAndSorted.slice(0, itemsToShow);
            renderCards(portion, container);

            // Керування видимістю кнопки
            loadMoreBtn.hidden = itemsToShow >= filteredAndSorted.length;
        };

        // Події
        document.getElementById('catalog-search').addEventListener('input', () => updateUI());
        document.getElementById('filter-category').addEventListener('change', () => updateUI());
        document.getElementById('sort-items').addEventListener('change', () => updateUI());
        
        loadMoreBtn.addEventListener('click', () => {
            itemsToShow += 4; // Додаємо ще 4 картки
            updateUI(false);
        });

        // Закриття модалки
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('item-modal').hidden = true;
        });

        updateUI();

    } catch (error) {
        container.innerHTML = '<p>Помилка завантаження даних.</p>';
    }
}

/**
 * ЗАВДАННЯ 10: Формування деталей на основі об'єкта
 */
function showDetails(itemId) {
    const item = allItems.find(i => i.id === parseInt(itemId));
    const modal = document.getElementById('item-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p class="item-badge">${item.category}</p>
        <p style="font-size: 1.2rem; margin: 20px 0;">${item.description}</p>
        <div style="background: #f0f4f8; padding: 15px; border-radius: 8px;">
            <p><strong>Повний рейтинг:</strong> ⭐ ${item.rating} / 5.0</p>
            <p><strong>Ціна послуги:</strong> ${item.price} грн</p>
            <p><strong>Термін виконання:</strong> 3-5 робочих днів</p>
        </div>
        <button class="btn-primary" style="width: 100%; margin-top: 20px;">Замовити зараз</button>
    `;
    modal.hidden = false;
}

function renderCards(items, container) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'catalog-grid';

    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'item-card card animate-in';
        card.innerHTML = `
            <div class="card-header">
                <span class="item-badge">${item.category}</span>
                <button class="btn-fav ${isFavorite(item.id) ? 'active' : ''}" data-id="${item.id}">
                    ${isFavorite(item.id) ? '❤️' : '🤍'}
                </button>
            </div>
            <h3>${item.title}</h3>
            <p><strong>${item.price} грн</strong></p>
            <button class="btn-secondary btn-details" data-id="${item.id}">Деталі</button>
        `;

        // Обробник деталей (Завдання 10)
        card.querySelector('.btn-details').addEventListener('click', () => showDetails(item.id));

        // Обробник обраного
        card.querySelector('.btn-fav').addEventListener('click', (e) => {
            toggleFavorite(item.id);
            e.target.innerHTML = isFavorite(item.id) ? '❤️' : '🤍';
        });

        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// Допоміжна функція фільтрації (об'єднана)
function filterAndSort(data, search, category, sort) {
    let result = data.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'all' || item.category === category)
    );

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating-desc') result.sort((a, b) => b.rating - a.rating);
    
    return result;
}