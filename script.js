document.addEventListener("DOMContentLoaded", function () {
    console.log("🔥 Navigator OГЭ: универсальный скрипт запущен!");

    // Находим все чекбоксы на странице
    const checkboxes = document.querySelectorAll('input[type="checkbox"][id^="task-"]');
    const isSubjectPage = checkboxes.length > 0;

    // === 1. ЛОГИКА ДЛЯ СТРАНИЦЫ ПРЕДМЕТА (physics.html, math.html и т.д.) ===
    if (isSubjectPage) {
        // Автоматически вычисляем имя предмета по ID тега body (например, page-physics -> physics)
        const bodyId = document.body.id || "";
        const subjectName = bodyId.replace("page-", "");

        console.log("Открыта страница предмета: " + subjectName);

        const progressBar = document.querySelector(".progress-fill");
        const progressText = document.querySelector(".progress-text");

        function updateSubjectProgress() {
            let checkedCount = 0;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) checkedCount++;
            });

            const totalTasks = checkboxes.length;
            const percentage = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0;

            if (progressBar) progressBar.style.width = percentage + "%";
            if (progressText) progressText.textContent = `Выполнено: ${percentage}% (${checkedCount} из ${totalTasks})`;

            // Сохраняем строго под именем предмета
            if (subjectName) {
                localStorage.setItem(subjectName + "-total-percentage", percentage);
            }
        }

        checkboxes.forEach(checkbox => {
            const savedState = localStorage.getItem(checkbox.id);
            if (savedState === "true") {
                checkbox.checked = true;
            }

            checkbox.addEventListener("change", function () {
                localStorage.setItem(checkbox.id, checkbox.checked);
                updateSubjectProgress();
            });
        });

        updateSubjectProgress();
    }

    // === 2. ЛОГИКА ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (index.html) ===
    if (!isSubjectPage) {
        console.log("Открыта главная страница сайта.");

        // Находим вообще все карточки предметов на экране
        const subjectCards = document.querySelectorAll(".subject-card");

        subjectCards.forEach(card => {
            // Вытаскиваем имя предмета из ID карточки (из id="subject-physics" получаем "physics")
            const cardId = card.id || "";
            const subjectName = cardId.replace("subject-", "");

            if (subjectName) {
                // Достаем сохраненный процент из памяти
                const savedPercentage = localStorage.getItem(subjectName + "-total-percentage") || 0;

                // Находим элементы прогресса СТРОГО внутри этой конкретной карточки
                const progressBar = card.querySelector(".progress-fill");
                const progressText = card.querySelector(".progress-text");

                if (progressBar) {
                    progressBar.style.width = savedPercentage + "%";
                }
                if (progressText) {
                    progressText.textContent = `Готовность: ${savedPercentage}%`;
                }
            }
        });
    }
});