// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Set current date
function updateDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    };

    const formattedDate = now.toLocaleDateString('en-US', options);
    dateElement.textContent = formattedDate;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();

    // Setup theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    updateDate();

    // You can customize the user name here or fetch from localStorage
    // const userName = localStorage.getItem('userName') || 'Ammar';
    // document.getElementById('userName').textContent = userName;
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add navigation for tool buttons
document.querySelectorAll('.tool-btn').forEach(button => {
    button.addEventListener('click', function() {
        const toolName = this.textContent.trim().toLowerCase();

        // Map tool names to their page URLs
        const toolPages = {
            'reminders': 'reminders.html',
            'routines': 'routines-list.html',
            'trackers': 'trackers.html',
            'journals': 'journals.html',
            'exercise logs': 'exercise-logs.html',
            'recipes': 'recipes.html',
            'people': 'people.html'
        };

        // Navigate to the corresponding page
        if (toolPages[toolName]) {
            window.location.href = toolPages[toolName];
        }
    });
});

// Add touch feedback for mobile
document.querySelectorAll('.domain-card, .nav-item, .tool-btn, .menu-btn, .theme-toggle-btn').forEach(element => {
    element.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
    });

    element.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
});
