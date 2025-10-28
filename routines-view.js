// Routines View Page - Dynamic Rendering

function renderRoutinePage() {
    // Get routine ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const routineId = urlParams.get('id') || 'start_of_day';

    // Load routine data
    const routine = getRoutineById(routineId);

    if (!routine) {
        // Redirect to routines list if routine not found
        window.location.href = 'routines-list.html';
        return;
    }

    // Update page title
    document.title = `${routine.name} - Core`;

    // Update routine header
    const routineTitle = document.querySelector('.routine-title');
    if (routineTitle) {
        routineTitle.textContent = routine.name;
    }

    // Calculate and update time
    const totalDuration = routine.tasks.reduce((sum, task) => sum + task.duration, 0);
    const endTime = calculateEndTime(routine.startTime, totalDuration);
    const routineTime = document.querySelector('.routine-time');
    if (routineTime) {
        const startHours = parseInt(routine.startTime.split(':')[0]);
        const startMinutes = parseInt(routine.startTime.split(':')[1]);
        const startPeriod = startHours >= 12 ? 'pm' : 'am';
        const displayStartHours = startHours % 12 || 12;
        routineTime.textContent = `${displayStartHours}:${startMinutes.toString().padStart(2, '0')} ${startPeriod} - ${endTime}`;
    }

    // Update description
    const routineDescription = document.querySelector('.routine-description');
    if (routineDescription) {
        routineDescription.textContent = routine.description || '';
    }

    // Render tasks
    renderTasks(routine);
}

function calculateEndTime(startTime, durationMinutes) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);

    const endHours = startDate.getHours();
    const endMinutes = startDate.getMinutes();
    const period = endHours >= 12 ? 'pm' : 'am';
    const displayHours = endHours % 12 || 12;

    return `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${period}`;
}

function renderTasks(routine) {
    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) return;

    if (routine.tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                <p>No tasks added yet. Edit this routine to add tasks.</p>
            </div>
        `;
        return;
    }

    let html = '';
    routine.tasks.forEach((task, index) => {
        const taskState = getTaskState(routine.id, task.id);
        const stateClass = taskState !== TaskState.PENDING ? taskState : '';

        html += `
            <div class="task-card ${stateClass}" data-task-id="${task.id}">
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

    tasksContainer.innerHTML = html;
}

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderRoutinePage();
});
