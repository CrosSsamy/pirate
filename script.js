document.addEventListener('DOMContentLoaded', function() {
    const addTaskForm = document.getElementById('addTaskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    
    // Загрузка задач из localStorage при загрузке страницы
    loadTasks();
    
    // Обработчик отправки формы
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        
        if (title) {
            addTask(title, description);
            taskTitleInput.value = '';
            taskDescriptionInput.value = '';
            taskTitleInput.focus();
        }
    });
    
    // Функция добавления задачи
    function addTask(title, description) {
        // Создаем элемент задачи
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <h3 class="task-title">${escapeHtml(title)}</h3>
            ${description ? `<p class="task-description">${escapeHtml(description)}</p>` : ''}
            <div class="task-actions">
                <button class="btn-delete">Удалить</button>
            </div>
        `;
        
        // Добавляем обработчик для кнопки удаления
        const deleteBtn = taskCard.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', function() {
            taskCard.remove();
            saveTasks();
            checkEmptyState();
        });
        
        // Убираем сообщение о пустом списке, если оно есть
        const emptyState = tasksContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        
        // Добавляем задачу в контейнер
        tasksContainer.appendChild(taskCard);
        
        // Сохраняем задачи в localStorage
        saveTasks();
    }
    
    // Функция сохранения задач в localStorage
    function saveTasks() {
        const tasks = [];
        const taskCards = tasksContainer.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const title = card.querySelector('.task-title').textContent;
            const descriptionElement = card.querySelector('.task-description');
            const description = descriptionElement ? descriptionElement.textContent : '';
            
            tasks.push({
                title: title,
                description: description
            });
        });
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Функция загрузки задач из localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            
            // Очищаем контейнер
            tasksContainer.innerHTML = '';
            
            if (tasks.length === 0) {
                showEmptyState();
            } else {
                tasks.forEach(task => {
                    addTask(task.title, task.description);
                });
            }
        }
    }
    
    // Функция проверки пустого состояния
    function checkEmptyState() {
        const taskCards = tasksContainer.querySelectorAll('.task-card');
        if (taskCards.length === 0) {
            showEmptyState();
        }
    }
    
    // Функция показа сообщения о пустом списке
    function showEmptyState() {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <h3>У вас пока нет задач</h3>
                <p>Добавьте свою первую задачу с помощью формы выше</p>
            </div>
        `;
    }
    
    // Функция экранирования HTML для безопасности
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});