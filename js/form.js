// 🔥 FULL WORKING js/form.js
// Replace ENTIRE file

import {
    createItem,
    updateItem,
    getItemById
} from './api.js';

export function initItemFormPage() {
    const form = document.getElementById('item-form');

    // 🔥 If not form page — stop
    if (!form) {
        return;
    }

    console.log('FORM INIT WORKS');

    const message = document.getElementById('form-message');
    const titleEl = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    /**
     * VALIDATION
     */
    function validate(data) {
        if (!data.title?.trim()) {
            return 'Назва обовʼязкова';
        }

        if (!data.category?.trim()) {
            return 'Категорія обовʼязкова';
        }

        if (!data.description?.trim()) {
            return 'Опис обовʼязковий';
        }

        if (!data.price || Number(data.price) <= 0) {
            return 'Ціна має бути більше 0';
        }

        return null;
    }

    /**
     * LOAD FOR EDIT
     */
    async function loadEditData() {
        if (!editId) return;

        try {
            const item = await getItemById(editId);

            if (titleEl) {
                titleEl.textContent = 'Редагування запису';
            }

            if (submitBtn) {
                submitBtn.textContent = 'Оновити';
            }

            form.elements.title.value = item.title || '';
            form.elements.category.value = item.category || '';
            form.elements.price.value = item.price || '';
            form.elements.image.value = item.image || '';
            form.elements.description.value = item.description || '';

        } catch (error) {
            if (message) {
                message.innerHTML = `
                    <p style="color:red;">
                        ${error.message}
                    </p>
                `;
            }
        }
    }

    /**
     * SUBMIT
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log('SUBMIT TRIGGERED');

        const formData = new FormData(form);

        const data = {
            title: formData.get('title')?.trim(),
            category: formData.get('category')?.trim(),
            price: Number(formData.get('price')),
            image: formData.get('image')?.trim() || '',
            description: formData.get('description')?.trim(),
            rating: 0,
            featured: false
        };

        console.log('FORM DATA:', data);

        const validationError = validate(data);

        if (validationError) {
            if (message) {
                message.innerHTML = `
                    <p style="color:red;">
                        ${validationError}
                    </p>
                `;
            }
            return;
        }

        try {
            if (message) {
                message.innerHTML = `
                    <p>Збереження...</p>
                `;
            }

            /**
             * PATCH
             */
            if (editId) {
                const updated = await updateItem(
                    editId,
                    data
                );

                console.log('UPDATED:', updated);

                if (message) {
                    message.innerHTML = `
                        <p style="color:green;">
                            Запис успішно оновлено ✅
                        </p>
                    `;
                }

            } else {
                /**
                 * POST
                 */
                const created = await createItem(data);

                console.log('CREATED:', created);

                if (message) {
                    message.innerHTML = `
                        <p style="color:green;">
                            Запис успішно створено ✅
                        </p>
                    `;
                }

                form.reset();
            }

        } catch (error) {
            console.error('SAVE ERROR:', error);

            if (message) {
                message.innerHTML = `
                    <p style="color:red;">
                        ${error.message}
                    </p>
                `;
            }
        }
    });

    loadEditData();
}