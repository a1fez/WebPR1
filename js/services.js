/**
 * SERVICES.JS — Динамічне завантаження послуг з JSON
 */

export async function loadServices() {
    const container = document.querySelector('.filter-grid');
    if (!container) return;

    try {
        // 1. Отримуємо дані з файлу (шлях залежить від того, де відкрита сторінка)
        const response = await fetch('./data/services.json');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        
        const services = await response.json();

        // 2. Очищуємо контейнер від статичного контенту (якщо потрібно)
        container.innerHTML = '';

        // 3. Генеруємо HTML для кожної послуги
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'filter-item card animate-in';
            card.setAttribute('data-category', service.category);
            
            card.innerHTML = `
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <span class="badge">${service.category}</span>
            `;
            
            container.appendChild(card);
        });

        console.log("✅ Послуги успішно завантажені з JSON");

    } catch (error) {
        console.error("❌ Помилка завантаження послуг:", error);
        container.innerHTML = '<p>Вибачте, сталася помилка при завантаженні послуг.</p>';
    }
}