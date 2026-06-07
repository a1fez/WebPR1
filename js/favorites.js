/**
 * Функції для роботи з localStorage (Обране)
 */

export function getFavorites() {
    const favs = localStorage.getItem('catalog_favorites');
    return favs ? JSON.parse(favs) : [];
}

export function toggleFavorite(itemId) {
    let favs = getFavorites();
    const index = favs.indexOf(itemId);

    if (index === -1) {
        favs.push(itemId); // Додаємо, якщо немає
    } else {
        favs.splice(index, 1); // Видаляємо, якщо є
    }

    localStorage.setItem('catalog_favorites', JSON.stringify(favs));
    return favs;
}

export function isFavorite(itemId) {
    return getFavorites().includes(itemId);
}