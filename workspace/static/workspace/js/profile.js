// Показ/скрытие формы добавления доски
document.querySelectorAll('.add-board-card').forEach(btn => {
    btn.addEventListener('click', function() {
        // Находим ближайший контейнер с формой
        const container = this.closest('.boards-container');
        // Находим форму внутри этого контейнера
        const form = container.querySelector('.add-form');

        // Скрываем все другие формы добавления досок
        document.querySelectorAll('.add-form').forEach(f => {
            if (f !== form) f.classList.remove('visible');
        });

        // Переключаем видимость текущей формы
        form.classList.toggle('visible');
    });
});

// Показ/скрытие формы добавления рабочего пространства
document.querySelector('.add-workspace-btn').addEventListener('click', function() {
    const form = document.getElementById('add-workspace-form');
    // Скрываем все формы добавления досок
    document.querySelectorAll('.add-form:not(#add-workspace-form)').forEach(f => {
        f.classList.remove('visible');
    });
    form.classList.toggle('visible');
});

// Обработчики для кнопок отмены
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Находим ближайшую форму и скрываем её
        this.closest('.add-form').classList.remove('visible');
    });
});


// Включение режима редактирования
function enableEdit(button, type, id) {
    const container = button.closest('.title-view').parentNode;
    const viewMode = container.querySelector('.title-view');
    const editMode = container.querySelector('.title-edit');
    const input = editMode.querySelector('.edit-input');

    // Сохраняем оригинальное значение
    input.dataset.original = input.value;

    // Переключаем режимы
    viewMode.style.display = 'none';
    editMode.style.display = 'block';

    // Фокусируем и выделяем текст в инпуте
    input.focus();
    input.select();

    // Обработка нажатия Enter
    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            saveTitle(button, type, id);
        } else if (e.key === 'Escape') {
            cancelEdit(button, type);
        }
    };
}

// Сохранение изменений
async function saveTitle(button, type, id) {
    const container = button.closest('.title-edit').parentNode;
    const input = container.querySelector('.edit-input');
    const newTitle = input.value.trim();

    if (newTitle === '') {
        alert('Название не может быть пустым');
        return;
    }

    try {
        const response = await fetch(`/api/${type}s/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ title: newTitle }),
        });

        if (response.ok) {
            const viewMode = container.querySelector('.title-view');
            const editMode = container.querySelector('.title-edit');
            const titleElement = viewMode.querySelector(`.${type}-title`);

            // Обновляем отображаемое название
            titleElement.textContent = newTitle;

            // Возвращаем в режим просмотра
            viewMode.style.display = 'flex';
            editMode.style.display = 'none';
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        alert('Не удалось сохранить изменения: ' + error.message);
    }
}

// Отмена редактирования
function cancelEdit(button, type) {
    const container = button.closest('.title-edit').parentNode;
    const viewMode = container.querySelector('.title-view');
    const editMode = container.querySelector('.title-edit');
    const input = editMode.querySelector('.edit-input');

    // Восстанавливаем оригинальное значение
    input.value = input.dataset.original;

    // Возвращаем в режим просмотра
    viewMode.style.display = 'flex';
    editMode.style.display = 'none';
}

// Получение CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функции показа/скрытия форм
function showForm(button, formClass, buttonClass, containerClass) {
    const container = button.closest(`.${containerClass}`);
    const form = container.querySelector(`.${formClass}`);
    const triggerButton = container.querySelector(`.${buttonClass}`);

    if (triggerButton) triggerButton.style.display = 'none';
    if (form) form.style.display = 'flex';
}

function hideForm(button, formClass, buttonClass, containerClass) {
    const container = button.closest(`.${containerClass}`);
    const form = container.querySelector(`.${formClass}`);
    const triggerButton = container.querySelector(`.${buttonClass}`);

    if (triggerButton) triggerButton.style.display = 'block';
    if (form) form.style.display = 'none';
}