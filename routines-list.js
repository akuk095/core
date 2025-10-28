// Routines List Page JavaScript

// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Render routines list
function renderRoutinesList() {
    const container = document.getElementById('routinesList');
    if (!container) return;

    const todaysRoutines = getTodaysRoutines();

    if (todaysRoutines.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-text">No routines scheduled for today</div>
            </div>
        `;
        return;
    }

    // Group routines by type for better organization
    const routinesByType = {
        daily: [],
        weekly: [],
        fortnightly: [],
        monthly: []
    };

    todaysRoutines.forEach(routine => {
        routinesByType[routine.type].push(routine);
    });

    let html = '';

    // Render each type group
    Object.entries(routinesByType).forEach(([type, routines]) => {
        if (routines.length > 0) {
            routines.forEach(routine => {
                const totalDuration = routine.tasks.reduce((sum, task) => sum + task.duration, 0);
                const endTime = calculateEndTime(routine.startTime, totalDuration);

                html += `
                    <div class="routine-list-card" onclick="openRoutine('${routine.id}')">
                        <div class="routine-icon">${routine.icon}</div>
                        <div class="routine-list-info">
                            <div class="routine-list-title">${routine.name}</div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                                <span class="routine-type-badge routine-type-${routine.type}">${routine.type}</span>
                                <span style="color: var(--text-secondary); font-size: 0.85rem;">
                                    ${routine.startTime} - ${endTime}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    });

    container.innerHTML = html;
}

// Calculate end time based on start time and duration
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

// Open routine detail page
function openRoutine(routineId) {
    window.location.href = `routines.html?id=${routineId}`;
}

// Modal management
let selectedType = 'daily';
let selectedWeekDays = [];
let selectedFortnightlyDay = null;

function openModal() {
    const modal = document.getElementById('addRoutineModal');
    modal.classList.add('active');
    resetForm();
}

function closeModal() {
    const modal = document.getElementById('addRoutineModal');
    modal.classList.remove('active');
}

function resetForm() {
    document.getElementById('routineForm').reset();
    selectedType = 'daily';
    selectedWeekDays = [];
    selectedFortnightlyDay = null;

    // Reset type selection
    document.querySelectorAll('.type-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector('.type-option[data-type="daily"]').classList.add('selected');

    // Hide all schedule configs
    document.querySelectorAll('.schedule-config').forEach(config => {
        config.classList.remove('active');
    });

    // Reset weekday buttons
    document.querySelectorAll('.weekday-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function selectType(type) {
    selectedType = type;

    // Update UI
    document.querySelectorAll('.type-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.querySelector(`.type-option[data-type="${type}"]`).classList.add('selected');

    // Show/hide schedule config
    document.querySelectorAll('.schedule-config').forEach(config => {
        config.classList.remove('active');
    });

    if (type === 'weekly') {
        document.getElementById('weeklySchedule').classList.add('active');
    } else if (type === 'fortnightly') {
        document.getElementById('fortnightlySchedule').classList.add('active');
    } else if (type === 'monthly') {
        document.getElementById('monthlySchedule').classList.add('active');
    }
}

function toggleWeekDay(day, isFortnightly = false) {
    day = parseInt(day);

    if (isFortnightly) {
        // For fortnightly, only one day can be selected
        selectedFortnightlyDay = day;

        // Update UI
        const container = document.getElementById('fortnightlySchedule');
        container.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');
    } else {
        // For weekly, multiple days can be selected
        const index = selectedWeekDays.indexOf(day);
        if (index > -1) {
            selectedWeekDays.splice(index, 1);
            event.target.classList.remove('selected');
        } else {
            selectedWeekDays.push(day);
            event.target.classList.add('selected');
        }
    }
}

function generateRoutineId(name) {
    return name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('routineName').value;
    const icon = document.getElementById('routineIcon').value;
    const description = document.getElementById('routineDescription').value;
    const startTime = document.getElementById('routineStartTime').value;

    // Build schedule based on type
    let schedule = null;

    if (selectedType === 'weekly') {
        if (selectedWeekDays.length === 0) {
            alert('Please select at least one day for the weekly routine');
            return;
        }
        schedule = { weekDays: selectedWeekDays };
    } else if (selectedType === 'fortnightly') {
        const startDate = document.getElementById('fortnightlyStartDate').value;
        if (!startDate || selectedFortnightlyDay === null) {
            alert('Please select a start date and day of the week for the fortnightly routine');
            return;
        }
        schedule = {
            startDate: startDate,
            weekDay: selectedFortnightlyDay
        };
    } else if (selectedType === 'monthly') {
        const dayOfMonth = parseInt(document.getElementById('monthlyDay').value);
        if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) {
            alert('Please enter a valid day of the month (1-31)');
            return;
        }
        schedule = { dayOfMonth: dayOfMonth };
    }

    // Create the new routine object
    const newRoutine = {
        id: generateRoutineId(name),
        name: name,
        icon: icon,
        description: description,
        type: selectedType,
        startTime: startTime,
        tasks: [], // Empty tasks array - user can add tasks later by editing
        schedule: schedule
    };

    // Add the routine
    addRoutine(newRoutine);

    // Close modal and refresh list
    closeModal();
    renderRoutinesList();

    // Show success message
    showToast(`${icon} ${name} added successfully!`);
}

function showToast(message) {
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
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    renderRoutinesList();

    // Modal event listeners
    const addBtn = document.getElementById('addRoutineBtn');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('addRoutineModal');
    const form = document.getElementById('routineForm');

    if (addBtn) addBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Type selection
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', () => {
            selectType(option.dataset.type);
        });
    });

    // Weekday selection for weekly
    const weeklySchedule = document.getElementById('weeklySchedule');
    if (weeklySchedule) {
        weeklySchedule.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWeekDay(btn.dataset.day, false);
            });
        });
    }

    // Weekday selection for fortnightly
    const fortnightlySchedule = document.getElementById('fortnightlySchedule');
    if (fortnightlySchedule) {
        fortnightlySchedule.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWeekDay(btn.dataset.day, true);
            });
        });
    }

    // Form submission
    if (form) form.addEventListener('submit', handleFormSubmit);

    // Set default start date for fortnightly to today
    const fortnightlyStartDate = document.getElementById('fortnightlyStartDate');
    if (fortnightlyStartDate) {
        const today = new Date().toISOString().split('T')[0];
        fortnightlyStartDate.value = today;
    }
});
