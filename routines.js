// Routines Page JavaScript

// Storage keys
const ROUTINES_DATA_KEY = 'routines_data';
const CURRENT_CONTEXT_KEY = 'current_routine_context';

// Routine contexts (presets)
const RoutineContext = {
    NORMAL: 'normal',
    TRAVEL: 'travel',
    HOLIDAY: 'holiday'
};

// Routine types
const RoutineType = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    FORTNIGHTLY: 'fortnightly',
    MONTHLY: 'monthly'
};

// Task states
const TaskState = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    SKIPPED: 'skipped'
};

// Get current context
function getCurrentContext() {
    const saved = localStorage.getItem(CURRENT_CONTEXT_KEY);
    return saved || RoutineContext.NORMAL;
}

// Set current context
function setCurrentContext(context) {
    localStorage.setItem(CURRENT_CONTEXT_KEY, context);
}

// Get all available contexts
function getAllContexts() {
    const allRoutines = loadAllRoutines();
    return Object.keys(allRoutines);
}

// Add a new context
function addNewContext(contextName) {
    const allRoutines = loadAllRoutines();
    const normalizedName = contextName.toLowerCase().replace(/\s+/g, '_');

    if (!allRoutines[normalizedName]) {
        allRoutines[normalizedName] = [];
        saveAllRoutines(allRoutines);
    }

    return normalizedName;
}

// Load all routines from localStorage (organized by context)
function loadAllRoutines() {
    const saved = localStorage.getItem(ROUTINES_DATA_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading routines:', e);
            return getDefaultRoutines();
        }
    }
    return getDefaultRoutines();
}

// Save all routines to localStorage
function saveAllRoutines(routinesData) {
    try {
        localStorage.setItem(ROUTINES_DATA_KEY, JSON.stringify(routinesData));
    } catch (e) {
        console.error('Error saving routines:', e);
    }
}

// Load routines for a specific context
function loadRoutines(context = null) {
    const allRoutines = loadAllRoutines();
    const targetContext = context || getCurrentContext();
    return allRoutines[targetContext] || [];
}

// Save routines for a specific context
function saveRoutines(routines, context = null) {
    const allRoutines = loadAllRoutines();
    const targetContext = context || getCurrentContext();
    allRoutines[targetContext] = routines;
    saveAllRoutines(allRoutines);
}

// Get default routines structure (organized by context)
function getDefaultRoutines() {
    return {
        [RoutineContext.NORMAL]: [
            {
                id: 'start_of_day',
                name: 'Start of the day',
                description: 'The morning sets the tone for the entire day, which is especially important if you are an anxious person.',
                type: RoutineType.DAILY,
                startTime: '09:00',
                icon: '☀️',
                tasks: [
                    { id: '1', name: 'Drinking water', icon: '💧', duration: 2, details: 'Take 2 glasses, 250 ml each' },
                    { id: '2', name: 'Make your bed', icon: '🛏️', duration: 3, details: '' },
                    { id: '3', name: 'Drink coffee', icon: '☕', duration: 15, details: '' },
                    { id: '4', name: 'Skincare', icon: '🧴', duration: 10, details: 'Cleanse and then serum + massage' },
                    { id: '5', name: 'Taking vitamins', icon: '💊', duration: 2, details: '<span class="supplement-label">Mo:</span> C + Zn, <span class="supplement-label">Tue:</span> D+Omega3, <span class="supplement-label">We:</span> B-complex, <span class="supplement-label">Th:</span> Mg + D, <span class="supplement-label">Fri:</span> Fe + C, <span class="supplement-label">Sa:</span> Probiotics, <span class="supplement-label">Su:</span> Multivitamin' }
                ],
                schedule: null
            }
        ],
        [RoutineContext.TRAVEL]: [],
        [RoutineContext.HOLIDAY]: []
    };
}

// Get routine by ID in current context
function getRoutineById(routineId, context = null) {
    const routines = loadRoutines(context);
    return routines.find(r => r.id === routineId);
}

// Add a new routine to current context
function addRoutine(routine, context = null) {
    const routines = loadRoutines(context);
    routines.push(routine);
    saveRoutines(routines, context);
}

// Update an existing routine
function updateRoutine(routineId, updatedRoutine, context = null) {
    const routines = loadRoutines(context);
    const index = routines.findIndex(r => r.id === routineId);
    if (index !== -1) {
        routines[index] = { ...routines[index], ...updatedRoutine };
        saveRoutines(routines, context);
    }
}

// Delete a routine
function deleteRoutine(routineId, context = null) {
    const routines = loadRoutines(context);
    const filtered = routines.filter(r => r.id !== routineId);
    saveRoutines(filtered, context);
}

// Load task states for today
function loadTodayTaskStates() {
    const today = new Date().toISOString().split('T')[0];
    const key = `task_states_${today}`;
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading task states:', e);
            return {};
        }
    }
    return {};
}

// Save task states for today
function saveTodayTaskStates(states) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const key = `task_states_${today}`;
        localStorage.setItem(key, JSON.stringify(states));
    } catch (e) {
        console.error('Error saving task states:', e);
    }
}

// Get current state of a task (uses combined task ID)
function getTaskState(taskId) {
    const states = loadTodayTaskStates();
    return states[taskId] || TaskState.PENDING;
}

// Update task state (uses combined task ID)
function updateTaskState(taskId, newState) {
    const states = loadTodayTaskStates();
    states[taskId] = newState;
    saveTodayTaskStates(states);
}

// Check if a routine should be displayed today
function shouldShowRoutineToday(routine, date = new Date()) {
    if (routine.type === RoutineType.DAILY) {
        return true;
    }

    if (routine.type === RoutineType.WEEKLY) {
        // schedule.weekDays is an array of days [0-6] where 0 is Sunday
        if (routine.schedule && routine.schedule.weekDays) {
            return routine.schedule.weekDays.includes(date.getDay());
        }
        return false;
    }

    if (routine.type === RoutineType.FORTNIGHTLY) {
        // schedule.startDate is the first occurrence date
        // schedule.weekDay is the day of the week (0-6)
        if (routine.schedule && routine.schedule.startDate && routine.schedule.weekDay !== undefined) {
            const startDate = new Date(routine.schedule.startDate);
            const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));

            // Check if it's the right day of the week
            if (date.getDay() !== routine.schedule.weekDay) {
                return false;
            }

            // Check if it's been 0, 14, 28, 42... days since start
            return daysDiff >= 0 && daysDiff % 14 === 0;
        }
        return false;
    }

    if (routine.type === RoutineType.MONTHLY) {
        // schedule.dayOfMonth is the day number (1-31)
        if (routine.schedule && routine.schedule.dayOfMonth) {
            return date.getDate() === routine.schedule.dayOfMonth;
        }
        return false;
    }

    return false;
}

// Get routines that should be shown today for current context
function getTodaysRoutines(date = new Date(), context = null) {
    const routines = loadRoutines(context);
    return routines.filter(routine => shouldShowRoutineToday(routine, date));
}

// Get all tasks for today (combined from all applicable routines)
function getTodaysTasks(date = new Date(), context = null) {
    const todaysRoutines = getTodaysRoutines(date, context);
    const allTasks = [];

    todaysRoutines.forEach(routine => {
        routine.tasks.forEach(task => {
            allTasks.push({
                ...task,
                routineId: routine.id,
                routineName: routine.name,
                routineIcon: routine.icon,
                routineStartTime: routine.startTime,
                taskId: `${routine.id}_${task.id}` // Unique task ID combining routine and task
            });
        });
    });

    // Sort by routine start time
    allTasks.sort((a, b) => {
        const timeA = a.routineStartTime.split(':').map(Number);
        const timeB = b.routineStartTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    return allTasks;
}

// Cycle task state (pending -> completed -> skipped -> pending)
function cycleTaskState(taskCard) {
    const taskId = taskCard.dataset.taskId;
    const currentState = getTaskState(taskId);

    let newState;
    switch (currentState) {
        case TaskState.PENDING:
            newState = TaskState.COMPLETED;
            break;
        case TaskState.COMPLETED:
            newState = TaskState.SKIPPED;
            break;
        case TaskState.SKIPPED:
            newState = TaskState.PENDING;
            break;
        default:
            newState = TaskState.COMPLETED;
    }

    updateTaskState(taskId, newState);
    applyTaskState(taskCard, newState);
}

// Apply visual state to task card
function applyTaskState(taskCard, state) {
    const statusBtn = taskCard.querySelector('.task-status-btn');

    // Remove all state classes
    taskCard.classList.remove('completed', 'skipped');
    statusBtn.classList.remove('completed', 'skipped');

    // Clear status button content
    statusBtn.innerHTML = '';

    switch (state) {
        case TaskState.COMPLETED:
            taskCard.classList.add('completed');
            statusBtn.classList.add('completed');
            statusBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            break;

        case TaskState.SKIPPED:
            taskCard.classList.add('skipped');
            statusBtn.classList.add('skipped');
            statusBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            `;
            break;

        case TaskState.PENDING:
        default:
            statusBtn.innerHTML = '<div class="empty-circle"></div>';
            break;
    }
}

// Initialize task cards with saved states
function initializeTaskCards() {
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach(taskCard => {
        const taskId = taskCard.dataset.taskId;
        const savedState = getTaskState(taskId);

        // Apply saved state
        applyTaskState(taskCard, savedState);

        // Add click handler to status button
        const statusBtn = taskCard.querySelector('.task-status-btn');
        if (statusBtn) {
            statusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cycleTaskState(taskCard);
            });
        }
    });
}

// Play button functionality
function initializePlayButton() {
    const playBtn = document.querySelector('.play-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            // Find first pending task
            const taskCards = document.querySelectorAll('.task-card');
            let firstPendingTask = null;

            for (const taskCard of taskCards) {
                const taskId = taskCard.dataset.taskId;
                const state = getTaskState(taskId);
                if (state === TaskState.PENDING) {
                    firstPendingTask = taskCard;
                    break;
                }
            }

            if (firstPendingTask) {
                // Scroll to first pending task
                firstPendingTask.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Highlight it briefly
                firstPendingTask.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    firstPendingTask.style.transform = '';
                }, 300);
            } else {
                // All tasks done - show completion message
                showCompletionMessage();
            }
        });
    }
}

// Show completion message
function showCompletionMessage() {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-color);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = '🎉 Routine completed!';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add CSS animations for toast
function addToastAnimations() {
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideUp {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTaskCards();
    initializePlayButton();
    addToastAnimations();
});
