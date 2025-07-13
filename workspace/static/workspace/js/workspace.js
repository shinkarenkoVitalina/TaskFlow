// Переключение видимости карточки настроек
function toggleSettings() {
    const settingsCard = document.getElementById('settingsCard');
    settingsCard.classList.toggle('active');
}

function toggleOptions(element, menuClass) {
    // Закрываем все открытые меню того же типа
    document.querySelectorAll(menuClass).forEach(menu => {
        if (menu !== element.nextElementSibling) {
            menu.style.display = 'none';
        }
    });

    // Переключаем текущее меню
    const options = element.nextElementSibling;
    options.style.display = options.style.display === 'block' ? 'none' : 'block';

    // Останавливаем всплытие события, чтобы не сработал document.click
    event.stopPropagation();
}

// Обработчик кликов для закрытия меню при клике вне их
document.addEventListener('click', (event) => {
    // Определяем все типы меню и их триггеры
    const menuTypes = [
        { trigger: '.list-options', menu: '.list-options-menu' },
        { trigger: '.checklist-options', menu: '.checklist-options-menu' },
        { trigger: '.item-dots', menu: '.item-options-menu' },
        { trigger: '.workspace-options', menu: '.workspace-options-menu' },
        { trigger: '.board-options', menu: '.board-options-menu' }
    ];

    // Для каждого типа меню проверяем, нужно ли его закрыть
    menuTypes.forEach(({ trigger, menu }) => {
        if (!event.target.closest(trigger) && !event.target.closest(menu)) {
            document.querySelectorAll(menu).forEach(menuElement => {
                menuElement.style.display = 'none';
            });
        }
    });
});

// Управление модальными окнами карточек
function openCardModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeCardModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
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

// Обработчик кликов для закрытия форм при клике вне их
document.addEventListener('click', function(event) {
    // Закрытие форм карточек
    document.querySelectorAll('.add-card-form').forEach(form => {
    const container = form.closest('.add-card-container');
    const addButton = container?.querySelector('.add-card');

    // Если клик был не по форме и не по кнопке добавления карточки
    if (!event.target.closest('.add-card-form') &&
        !event.target.closest('.add-card') &&
        form.style.display !== 'none') {
            form.style.display = 'none';
            if (addButton) addButton.style.display = 'block';
        }
});

    // Закрытие формы списка
    const listForm = document.querySelector('.add-list-form');
    const addListButton = document.querySelector('.add-list');
        if (listForm && listForm.style.display !== 'none') {
            if (!event.target.closest('.add-list-form') &&
            !event.target.closest('.add-list')) {
                listForm.style.display = 'none';
            if (addListButton) addListButton.style.display = 'block';
        }
    }
});


// Функция открывающая модальное окна дедлайна
function openDeadlineModal(cardId) {
    const modalId = `deadline-modal-${cardId}`;
    const modal = document.getElementById(modalId);
    // Создаем объект Date с текущей датой и временем
    const now = new Date();
    // Форматируем дату и время
    const formattedDate = now.toISOString().slice(0, 16);
    // Устанавливаем значение поля ввода в текущую дату и время(предварительно отформатированные)
    document.getElementById(`deadline-input-${cardId}`).value = formattedDate;
    // Делаем модальное окно видимым
    modal.style.display = 'flex';
}

// Закрытие модального окна дедлайна
function closeDeadlineModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cохранение дедлайна
function saveDeadline(cardId, deskId) {
    const deadlineInput = document.getElementById(`deadline-input-${cardId}`);
    const deadlineValue = deadlineInput.value;

    // Отправка данных на сервер через REST API
    fetch(`/api/cards/${cardId}/set_deadline/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            deadline: deadlineValue
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        closeDeadlineModal(`deadline-modal-${cardId}`);
        console.log('Deadline updated:', data);
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при сохранении дедлайна');
    });
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

    // Фокусируем и выделяем текст
    input.focus();
    input.select();

    // Обработка клавиш
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

    if (!newTitle) {
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
            body: JSON.stringify({ title: newTitle })
        });

        if (response.ok) {
            const viewMode = container.querySelector('.title-view');
            const titleElement = viewMode.querySelector('h3, h4');
            titleElement.textContent = newTitle;

            viewMode.style.display = 'flex';
            container.querySelector('.title-edit').style.display = 'none';
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить изменения');
    }
}

// Отмена редактирования
function cancelEdit(button, type) {
    const container = button.closest('.title-edit').parentNode;
    const viewMode = container.querySelector('.title-view');
    const editMode = container.querySelector('.title-edit');
    const input = editMode.querySelector('.edit-input');

    input.value = input.dataset.original;
    viewMode.style.display = 'flex';
    editMode.style.display = 'none';
}


// Включение редактирования описания
function enableDescriptionEdit(cardId) {
    const modal = document.querySelector(`#modal-${cardId}`);
    const viewMode = modal.querySelector('.description-view');
    const editMode = modal.querySelector('.description-edit');
    const textarea = editMode.querySelector('.edit-description-input');

    // Сохраняем оригинальное значение
    textarea.dataset.original = textarea.value;

    // Переключаем режимы
    viewMode.style.display = 'none';
    editMode.style.display = 'block';

    // Фокусируем textarea
    textarea.focus();
}

// Отмена редактирования
function cancelDescriptionEdit(cardId) {
    const modal = document.querySelector(`#modal-${cardId}`);
    const viewMode = modal.querySelector('.description-view');
    const editMode = modal.querySelector('.description-edit');
    const textarea = editMode.querySelector('.edit-description-input');

    // Восстанавливаем оригинальное значение
    textarea.value = textarea.dataset.original;

    // Переключаем режимы
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
}

// Сохранение описания
async function saveDescription(cardId, deskId) {
    const modal = document.querySelector(`#modal-${cardId}`);
    const textarea = modal.querySelector('.edit-description-input');
    const description = textarea.value.trim();

    try {
        const response = await fetch(`/api/cards/${cardId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ description })
        });

        if (response.ok) {
            // Обновляем текст в режиме просмотра
            const viewMode = modal.querySelector('.description-view');
            const descriptionText = viewMode.querySelector('.description-text');
            descriptionText.textContent = description || 'Добавьте описание...';

            // Возвращаемся в режим просмотра
            viewMode.style.display = 'block';
            modal.querySelector('.description-edit').style.display = 'none';

            // Можно добавить уведомление об успехе
            console.log('Описание сохранено');
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить описание');
    }
}