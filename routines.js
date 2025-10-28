// Routines Page JavaScript

// State management
const ROUTINE_STATE_KEY = 'routine_start_of_day_state';

// Task states
const TaskState = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    SKIPPED: 'skipped'
};

// Load routine state from localStorage
function loadRoutineState() {
    const saved = localStorage.getItem(ROUTINE_STATE_KEY);
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
function saveRoutineState(state) {
    try {
        localStorage.setItem(ROUTINE_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Error saving routine state:', e);
    }
}

// Get current state of a task
function getTaskState(taskId) {
    const state = loadRoutineState();
    return state[taskId] || TaskState.PENDING;
}

// Update task state
function updateTaskState(taskId, newState) {
    const state = loadRoutineState();
    state[taskId] = newState;
    saveRoutineState(state);
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
