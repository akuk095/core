// Routines Page JavaScript

// Storage keys
const ROUTINES_DATA_KEY = 'routines_data';
const ROUTINE_STATE_KEY = 'routine_start_of_day_state';

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

// Load all routines from localStorage
function loadRoutines() {
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
function saveRoutines(routines) {
    try {
        localStorage.setItem(ROUTINES_DATA_KEY, JSON.stringify(routines));
    } catch (e) {
        console.error('Error saving routines:', e);
    }
}

// Get default routine (the existing one)
function getDefaultRoutines() {
    return [
        {
            id: 'start_of_day',
            name: 'Start of the day',
            description: 'The morning sets the tone for the entire day, which is especially important if you are an anxious person.',
            type: RoutineType.DAILY,
            startTime: '9:00',
            icon: '☀️',
            tasks: [
                { id: '1', name: 'Drinking water', icon: '💧', duration: 2, details: 'Take 2 glasses, 250 ml each' },
                { id: '2', name: 'Make your bed', icon: '🛏️', duration: 3, details: '' },
                { id: '3', name: 'Drink coffee', icon: '☕', duration: 15, details: '' },
                { id: '4', name: 'Skincare', icon: '🧴', duration: 10, details: 'Cleanse and then serum + massage' },
                { id: '5', name: 'Taking vitamins', icon: '💊', duration: 2, details: '<span class="supplement-label">Mo:</span> C + Zn, <span class="supplement-label">Tue:</span> D+Omega3, <span class="supplement-label">We:</span> B-complex, <span class="supplement-label">Th:</span> Mg + D, <span class="supplement-label">Fri:</span> Fe + C, <span class="supplement-label">Sa:</span> Probiotics, <span class="supplement-label">Su:</span> Multivitamin' }
            ],
            // For daily routines, no schedule needed
            schedule: null
        }
    ];
}

// Get routine by ID
function getRoutineById(routineId) {
    const routines = loadRoutines();
    return routines.find(r => r.id === routineId);
}

// Add a new routine
function addRoutine(routine) {
    const routines = loadRoutines();
    routines.push(routine);
    saveRoutines(routines);
}

// Delete a routine
function deleteRoutine(routineId) {
    const routines = loadRoutines();
    const filtered = routines.filter(r => r.id !== routineId);
    saveRoutines(filtered);
}

// Load routine state from localStorage
function loadRoutineState(routineId) {
    const key = `routine_${routineId}_state`;
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading routine state:', e);
            return {};
        }
    }
    return {};
}

// Save routine state to localStorage
function saveRoutineState(routineId, state) {
    try {
        const key = `routine_${routineId}_state`;
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error('Error saving routine state:', e);
    }
}

// Get current state of a task
function getTaskState(routineId, taskId) {
    const state = loadRoutineState(routineId);
    return state[taskId] || TaskState.PENDING;
}

// Update task state
function updateTaskState(routineId, taskId, newState) {
    const state = loadRoutineState(routineId);
    state[taskId] = newState;
    saveRoutineState(routineId, state);
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

// Get routines that should be shown today
function getTodaysRoutines(date = new Date()) {
    const routines = loadRoutines();
    return routines.filter(routine => shouldShowRoutineToday(routine, date));
}

// Cycle task state (pending -> completed -> skipped -> pending)
function cycleTaskState(taskCard, routineId) {
    const taskId = taskCard.dataset.taskId;
    const currentState = getTaskState(routineId, taskId);

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

    updateTaskState(routineId, taskId, newState);
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
function initializeTaskCards(routineId) {
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach(taskCard => {
        const taskId = taskCard.dataset.taskId;
        const savedState = getTaskState(routineId, taskId);

        // Apply saved state
        applyTaskState(taskCard, savedState);

        // Add click handler to status button
        const statusBtn = taskCard.querySelector('.task-status-btn');
        if (statusBtn) {
            statusBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                cycleTaskState(taskCard, routineId);
            });
        }
    });
}

// Play button functionality
function initializePlayButton(routineId) {
    const playBtn = document.querySelector('.play-btn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            // Find first pending task
            const taskCards = document.querySelectorAll('.task-card');
            let firstPendingTask = null;

            for (const taskCard of taskCards) {
                const taskId = taskCard.dataset.taskId;
                const state = getTaskState(routineId, taskId);
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
    // Get routine ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const routineId = urlParams.get('id') || 'start_of_day';

    initializeTaskCards(routineId);
    initializePlayButton(routineId);
    addToastAnimations();
});
