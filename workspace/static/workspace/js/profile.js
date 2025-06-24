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