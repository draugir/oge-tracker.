// 1. БАЗА ДАННЫХ: Задаем точное количество заданий для каждого предмета в ОГЭ
const SUBJECTS_CONFIG = {
    'physics': 22,      // В ОГЭ по физике 25 заданий
    'math': 25,         // В ОГЭ по математике 25 заданий (можешь менять цифры под актуальный год)
    'russian': 13,
    'informatics': 15,
    'geography': 30,
    'biology': 26
};

// 2. ГЛАВНАЯ ФУНКЦИЯ: Считает прогресс и обновляет интерфейс
function updateSubjectProgress(subjectId) {
    const totalTasks = SUBJECTS_CONFIG[subjectId];
    if (!totalTasks) return;

    let completedTasks = 0;

    // Считаем, сколько галочек для этого предмета уже сохранено как "true"
    for (let i = 1; i <= totalTasks; i++) {
        const savedState = localStorage.getItem(`oge-${subjectId}-task-${i}`);
        if (savedState === 'true') {
            completedTasks++;
        }
    }

    // Считаем процент (округляем до целого числа)
    const percent = Math.round((completedTasks / totalTasks) * 100) || 0;

    // Ищем карточку предмета на главной странице
    const card = document.getElementById(`subject-${subjectId}`);
    if (card) {
        const progressBar = card.querySelector('.progress-bar');
        const progressText = card.querySelector('.progress-text');

        // Меняем ширину неоновой полосы и текст процента
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `Готовность: ${percent}% (${completedTasks}/${totalTasks} заданий)`;
    }
}

// 3. ФУНКЦИЯ ДЛЯ СТРАНИЦЫ ПРЕДМЕТА (вызывается при клике на галочки внутри предмета)
function initTaskCheckboxes(subjectId) {
    const totalTasks = SUBJECTS_CONFIG[subjectId];

    for (let i = 1; i <= totalTasks; i++) {
        const checkbox = document.getElementById(`task-${i}`);
        if (!checkbox) continue;

        // Восстанавливаем сохраненное состояние галочки из памяти
        const savedState = localStorage.getItem(`oge-${subjectId}-task-${i}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }

        // Слушаем клики по галочке
        checkbox.addEventListener('change', function() {
            // Сохраняем выбор пользователя в localStorage
            localStorage.setItem(`oge-${subjectId}-task-${i}`, checkbox.checked);

            // Если мы находимся на странице предмета, где есть общая карточка (или после возврата), прогресс обновится
            updateSubjectProgress(subjectId);
        });
    }
}

// 4. ЗАПУСК: Когда человек заходит на главную страницу, обновляем все карточки предметов
document.addEventListener('DOMContentLoaded', function() {
    // Проходимся по всем предметам из нашей базы данных и обновляем их полосы прогресса
    Object.keys(SUBJECTS_CONFIG).forEach(subjectId => {
        updateSubjectProgress(subjectId);
    });

    // Автоматически определяем, на странице какого предмета мы находимся (по id тега body)
    // Например, если на странице физики написать <body id="page-physics">, код сам поймет это
    const bodyId = document.body.id;
    if (bodyId && bodyId.startsWith('page-')) {
        const currentSubject = bodyId.replace('page-', '');
        initTaskCheckboxes(currentSubject);
    }
});