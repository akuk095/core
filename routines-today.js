// Today's Routines Page - Shows combined tasks from all applicable routines

// Display current date and context
function displayHeader() {
    const dateElement = document.querySelector('#todayDate');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    // Highlight current context
    updateContextUI();
}

// Update context switcher UI
function updateContextUI() {
    const currentContext = getCurrentContext();
    const labelEl = document.querySelector('#currentContextLabel');
    if (labelEl) {
        // Capitalize first letter
        labelEl.textContent = currentContext.charAt(0).toUpperCase() + currentContext.slice(1);
    }

    // Update dropdown options
    renderContextOptions();
}

// Render context options in dropdown
function renderContextOptions() {
    const container = document.querySelector('#contextOptionsContainer');
    if (!container) return;

    const allContexts = getAllContexts();
    const currentContext = getCurrentContext();

    let html = '';
    allContexts.forEach(context => {
        const isActive = context === currentContext;
        html += `
            <div class="context-option ${isActive ? 'active' : ''}" data-context="${context}">
                <span class="context-option-name">${context.charAt(0).toUpperCase() + context.slice(1)}</span>
                ${isActive ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
        `;
    });

    container.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.context-option').forEach(option => {
        option.addEventListener('click', () => {
            switchContext(option.dataset.context);
            closeContextDropdown();
        });
    });
}

// Switch context
function switchContext(context) {
    setCurrentContext(context);
    updateContextUI();
    renderTodaysTasks();
}

// Show context dropdown
function showContextDropdown() {
    const dropdown = document.querySelector('#contextDropdown');
    if (dropdown) {
        dropdown.classList.add('active');
        renderContextOptions();
    }
}

// Close context dropdown
function closeContextDropdown() {
    const dropdown = document.querySelector('#contextDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// Render all tasks for today
function renderTodaysTasks() {
    const container = document.querySelector('.tasks-container');
    if (!container) return;

    const todaysTasks = getTodaysTasks();

    if (todaysTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 4rem; margin-bottom: 16px; opacity: 0.5;">✨</div>
                <div style="color: var(--text-secondary); font-size: 1.1rem;">
                    No routines scheduled for today
                </div>
                <a href="manage-routines.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--accent-color); color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
                    Add Your First Routine
                </a>
            </div>
        `;
        return;
    }

    // Group tasks by routine
    const tasksByRoutine = {};
    todaysTasks.forEach(task => {
        if (!tasksByRoutine[task.routineId]) {
            tasksByRoutine[task.routineId] = {
                routine: {
                    id: task.routineId,
                    name: task.routineName,
                    icon: task.routineIcon,
                    startTime: task.routineStartTime
                },
                tasks: []
            };
        }
        tasksByRoutine[task.routineId].tasks.push(task);
    });

    // Render tasks grouped by routine
    let html = '';
    Object.values(tasksByRoutine).forEach(group => {
        const totalDuration = group.tasks.reduce((sum, task) => sum + task.duration, 0);

        html += `
            <div class="routine-section">
                <div class="routine-section-header">
                    <div class="routine-section-info">
                        <span class="routine-section-icon">${group.routine.icon}</span>
                        <div>
                            <h3 class="routine-section-title">${group.routine.name}</h3>
                            <p class="routine-section-time">${formatTime(group.routine.startTime)} • ${totalDuration} min</p>
                        </div>
                    </div>
                </div>
        `;

        group.tasks.forEach(task => {
            const taskState = getTaskState(task.taskId);
            const stateClass = taskState !== TaskState.PENDING ? taskState : '';

            html += `
                <div class="task-card ${stateClass}" data-task-id="${task.taskId}">
                    <div class="task-content">
                        <div class="task-icon">${task.icon}</div>
                        <div class="task-info">
                            <h3 class="task-name">${task.name}</h3>
                            ${task.details ? `<p class="task-details">${task.details}</p>` : ''}
                        </div>
                        <div class="task-duration">${task.duration} min</div>
                        <button class="task-status-btn ${stateClass}">
                            ${getTaskButtonHTML(taskState)}
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
    });

    container.innerHTML = html;
}

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Get HTML for task button based on state
function getTaskButtonHTML(state) {
    switch (state) {
        case TaskState.COMPLETED:
            return `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
        case TaskState.SKIPPED:
            return `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            `;
        default:
            return '<div class="empty-circle"></div>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayHeader();
    renderTodaysTasks();

    // Context selector button
    const contextSelectorBtn = document.querySelector('#contextSelectorBtn');
    if (contextSelectorBtn) {
        contextSelectorBtn.addEventListener('click', showContextDropdown);
    }

    // Close context dropdown
    const closeMenuBtn = document.querySelector('#closeContextMenu');
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeContextDropdown);
    }

    // Close dropdown when clicking backdrop
    const contextDropdown = document.querySelector('#contextDropdown');
    if (contextDropdown) {
        contextDropdown.addEventListener('click', (e) => {
            if (e.target === contextDropdown) {
                closeContextDropdown();
            }
        });
    }

    // Add context button
    const addContextBtn = document.querySelector('#addContextBtn');
    if (addContextBtn) {
        addContextBtn.addEventListener('click', () => {
            const contextName = prompt('Enter a name for the new routine type:');
            if (contextName && contextName.trim()) {
                addNewContext(contextName.trim().toLowerCase());
                renderContextOptions();
            }
        });
    }

    // Add routine button
    const addRoutineBtn = document.querySelector('#addRoutineBtn');
    if (addRoutineBtn) {
        addRoutineBtn.addEventListener('click', () => {
            window.location.href = 'manage-routines.html?action=add';
        });
    }

    // Manage routines button
    const manageBtn = document.querySelector('#manageRoutinesBtn');
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            window.location.href = 'manage-routines.html';
        });
    }
});
