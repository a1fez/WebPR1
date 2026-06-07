import {getItems, deleteItem, updateItem} from './api.js';
import {toggleFavorite,isFavorite} from './favorites.js';
import {showLoading, showError, showEmpty,openModal, closeModal} from './ui.js';

let allItems = [];
let filteredItems = [];
let itemsToShow = 4;

/**
 *  ЗАВДАННЯ 6: Ініціалізація каталогу
 */
export async function initCatalog() {
    const container = document.querySelector('[data-catalog]');
    const loadMoreBtn = document.getElementById('load-more');

    if (!container) return;

    const searchInput = document.getElementById('catalog-search');
    const categorySelect = document.getElementById('filter-category');
    const sortSelect = document.getElementById('sort-items');

    try {
        showLoading(container);

        allItems = await getItems();

        /**
         *  ЗАВДАННЯ 7: Пошук + фільтрація + сортування
         */
        const updateUI = (resetPagination = true) => {
            if (resetPagination) itemsToShow = 4;

            const search = (searchInput?.value || '').trim().toLowerCase();
            const category = categorySelect?.value || 'all';
            const sort = sortSelect?.value || 'default';

            updateURLParams(category, search, sort);

            filteredItems = filterAndSort(allItems, search, category, sort);

            /**
             *  ЗАВДАННЯ 9: Пагінація
             */
            if (!filteredItems.length) {
                showEmpty(container, 'Нічого не знайдено');
                if (loadMoreBtn) loadMoreBtn.hidden = true;
                return;
            }

            renderCards(
                filteredItems.slice(0, itemsToShow),
                container
            );

            if (loadMoreBtn) {
                loadMoreBtn.hidden = itemsToShow >= filteredItems.length;
            }
        };

        /**
         *  Події
         */
        searchInput?.addEventListener('input', () => updateUI(true));
        categorySelect?.addEventListener('change', () => updateUI(true));
        sortSelect?.addEventListener('change', () => updateUI(true));

        loadMoreBtn?.addEventListener('click', () => {
            itemsToShow += 4;
            updateUI(false);
        });

        updateUI(true);

    } catch (error) {
        showError(container, error.message);
    }
}

/**
 *  Фільтрація + сортування
 */
function filterAndSort(data, search, category, sort) {
    let result = data.filter(item => {
        const matchesSearch =
            !search ||
            (item.title || '').toLowerCase().includes(search) ||
            (item.description || '').toLowerCase().includes(search);

        const matchesCategory =
            category === 'all' ||
            item.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating-desc') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'title-asc') result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
}

/**
 *  Рендер карток
 */
function renderCards(items, container) {
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'catalog-grid';

    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'item-card card';

        const fav = isFavorite(item.id);

        card.innerHTML = `
            <div class="card-header">
                <span class="item-badge">${item.category}</span>

                <button class="btn-fav ${fav ? 'active' : ''}">
                    ${fav ? '❤️' : '🤍'}
                </button>
            </div>
<img
        src="${item.image || 'https://via.placeholder.com/300x200'}"
        alt="${item.title}"
        class="card-image"
    >       
            <h3>${item.title}</h3>
            <p>${item.description?.substring(0, 60) || ''}...</p>

            <strong>${item.price} грн</strong>

            <div class="card-actions">
                <button class="btn-details">Деталі</button>
                <button class="btn-edit">Редагувати</button>
                <button class="btn-delete">Видалити</button>
            </div>
        `;

        /**
         *  Обране
         */
        card.querySelector('.btn-fav')?.addEventListener('click', () => {
            toggleFavorite(item.id);
            renderCards(filteredItems.slice(0, itemsToShow), container);
        });

        /**
         *  ЗАВДАННЯ 10: Деталі
         */
        card.querySelector('.btn-details')?.addEventListener('click', () => {
            showDetails(item.id);
        });

        /**
         *  Редагування (модалка)
         */
        card.querySelector('.btn-edit')?.addEventListener('click', () => {
            showEditModal(item.id);
        });

        /**
         *  ЗАВДАННЯ 5: Видалення
         */
        card.querySelector('.btn-delete')?.addEventListener('click', async () => {
            if (!confirm('Видалити запис?')) return;

            await deleteItem(item.id);

            allItems = allItems.filter(i => i.id !== item.id);
            filteredItems = filteredItems.filter(i => i.id !== item.id);

            renderCards(filteredItems.slice(0, itemsToShow), container);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/**
 *  Деталі (модальне вікно)
 */
function showDetails(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    openModal(`
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p>💰 ${item.price} грн</p>
    `);
}

/**
 *  Редагування (PATCH)
 */
function showEditModal(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    openModal(`
        <form id="edit-item-form">
            <input name="title" value="${item.title}" required>
            <input name="category" value="${item.category}" required>
            <input name="price" type="number" value="${item.price}" required>
            <textarea name="description">${item.description}</textarea>

            <button type="submit">Оновити</button>
        </form>
    `);

    const form = document.getElementById('edit-item-form');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const updated = await updateItem(item.id, {
            title: formData.get('title'),
            category: formData.get('category'),
            price: Number(formData.get('price')),
            description: formData.get('description')
        });

        syncUpdatedItem(updated);
        closeModal();
    });
}

/**
 *  Синхронізація UI
 */
function syncUpdatedItem(updatedItem) {
    allItems = allItems.map(i => i.id === updatedItem.id ? updatedItem : i);
    filteredItems = filteredItems.map(i => i.id === updatedItem.id ? updatedItem : i);

    const container = document.querySelector('[data-catalog]');
    renderCards(filteredItems.slice(0, itemsToShow), container);
}

/**
 *  URL параметри
 */
function updateURLParams(category, search, sort) {
    const params = new URLSearchParams();

    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    if (sort !== 'default') params.set('sort', sort);

    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState(null, '', newUrl);
}

