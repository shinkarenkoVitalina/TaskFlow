function toggleDescription() {
    const content = document.getElementById('descriptionContent');
    const btn = document.querySelector('.btn-toggle-description i');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.classList.remove('fa-chevron-up');
        btn.classList.add('fa-chevron-down');
    } else {
        content.style.display = 'none';
        btn.classList.remove('fa-chevron-down');
        btn.classList.add('fa-chevron-up');
    }
}

function enableDescriptionEdit() {
    document.getElementById('descriptionView').style.display = 'none';
    document.getElementById('descriptionEdit').style.display = 'block';
    document.querySelector('.edit-description-input').focus();
}

function cancelDescriptionEdit() {
    document.getElementById('descriptionView').style.display = 'block';
    document.getElementById('descriptionEdit').style.display = 'none';
}

async function saveDescription(id) {
    const newDescription = document.querySelector('.edit-description-input').value.trim();
    const deskId = id;

    try {
        const response = await fetch(`/api/desks/${deskId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ description: newDescription })
        });

        if (response.ok) {
            const data = await response.json();
            document.querySelector('.description-text').textContent = data.description || 'Описание отсутствует';
            cancelDescriptionEdit();
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        alert('Не удалось сохранить описание: ' + error.message);
    }
    cancelDescriptionEdit();
}

// Управление опциями участников
function toggleMemberOptions(element) {
    const menu = element.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    event.stopPropagation();
}

document.addEventListener('click', function() {
    document.querySelectorAll('.member-options-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});

// Вспомогательная функция для получения CSRF токена
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



// Показываем форму изменения прав
//function showPermissionForm(button) {
//    const menu = button.closest('.member-options-menu');
//    const permissionForm = menu.querySelector('.permission-form');
//    const currentRole = menu.closest('.member-card').querySelector('.member-role').textContent.trim().toLowerCase();
//
//    // Скрываем другие элементы меню
//    menu.querySelectorAll('form, .btn-update-permission').forEach(el => {
//        el.style.display = 'none';
//    });
//
//    // Показываем форму
//    permissionForm.style.display = 'block';
//
//    // Устанавливаем текущую роль в селекторе
//    const select = permissionForm.querySelector('.permission-select');
//    select.value = currentRole;
//
//    event.stopPropagation();
//}
//
//// Скрываем форму изменения прав
//function hidePermissionForm(button) {
//    const permissionForm = button.closest('.permission-form');
//    const menu = permissionForm.closest('.member-options-menu');
//
//    // Показываем другие элементы меню
//    menu.querySelectorAll('form, .btn-update-permission').forEach(el => {
//        el.style.display = 'block';
//    });
//
//    // Скрываем форму
//    permissionForm.style.display = 'none';
//
//    event.stopPropagation();
//}
//
//// Сохраняем новые права
//async function savePermissions(button) {
//    const permissionForm = button.closest('.permission-form');
//    const select = permissionForm.querySelector('.permission-select');
//    const newRole = select.value;
//    const memberCard = permissionForm.closest('.member-card');
//    const memberId = memberCard.dataset.memberId; // Предполагается, что у карточки есть data-атрибут с ID
//
//    try {
//        const response = await fetch(`/api/members/${memberId}/`, {
//            method: 'PATCH',
//            headers: {
//                'Content-Type': 'application/json',
//                'X-CSRFToken': getCookie('csrftoken'),
//            },
//            body: JSON.stringify({ role: newRole })
//        });
//
//        if (response.ok) {
//            // Обновляем отображаемую роль
//            const roleElement = memberCard.querySelector('.member-role');
//            roleElement.textContent = getRoleDisplayName(newRole);
//
//            // Скрываем форму
//            hidePermissionForm(button);
//        } else {
//            throw new Error('Ошибка сохранения прав');
//        }
//    } catch (error) {
//        alert('Не удалось сохранить права: ' + error.message);
//    }
//}
//
//// Вспомогательная функция для отображения названия роли
//function getRoleDisplayName(role) {
//    const roles = {
//        'reader': 'Читатель',
//        'editor': 'Редактор',
//        'admin': 'Администратор'
//    };
//    return roles[role] || role;
//}