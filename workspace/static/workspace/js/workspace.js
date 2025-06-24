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