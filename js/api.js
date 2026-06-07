const API_URL = 'http://localhost:3000/items';

/**
 *  ЗАВДАННЯ 1: Отримання списку об'єктів (GET)
 */
export async function getItems() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Не вдалося отримати список');
    }

    return response.json();
}

/**
 *  ЗАВДАННЯ 2: Отримання одного об'єкта за ID (GET)
 */
export async function getItemById(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error('Не вдалося отримати запис');
    }

    return response.json();
}

/**
 *  ЗАВДАННЯ 3: Створення запису (POST)
 */
export async function createItem(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Не вдалося створити запис');
    }

    return response.json();
}

/**
 *  ЗАВДАННЯ 4: Оновлення запису (PATCH)
 */
export async function updateItem(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Не вдалося оновити запис');
    }

    return response.json();
}

/**
 *  ЗАВДАННЯ 5: Видалення запису (DELETE)
 */
export async function deleteItem(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Не вдалося видалити запис');
    }
}