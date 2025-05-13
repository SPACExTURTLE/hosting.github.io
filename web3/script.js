document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const taskCount = document.getElementById('taskCount');
    const dateElement = document.getElementById('date');
    
    // Current date
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Filter state
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCount();
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateTaskCount();
            taskInput.value = '';
        }
    }
    
    // Toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Clear completed tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    // Filter tasks
    function filterTasks(filter) {
        currentFilter = filter;
        
        // Update active filter button
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        
        if (filter === 'all') allBtn.classList.add('active');
        if (filter === 'active') activeBtn.classList.add('active');
        if (filter === 'completed') completedBtn.classList.add('active');
        
        renderTasks();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = [];
        
        if (currentFilter === 'all') {
            filteredTasks = tasks;
        } else if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' 
                ? 'No tasks yet. Add one above!' 
                : currentFilter === 'active' 
                    ? 'No active tasks' 
                    : 'No completed tasks';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                const checkbox = taskItem.querySelector('.task-checkbox');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                
                checkbox.addEventListener('change', () => toggleTask(task.id));
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                taskList.appendChild(taskItem);
            });
        }
    }
    
    // Update task count
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    allBtn.addEventListener('click', () => filterTasks('all'));
    activeBtn.addEventListener('click', () => filterTasks('active'));
    completedBtn.addEventListener('click', () => filterTasks('completed'));
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Initialize the app
    init();
});