// Trackers Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Tracker card click handlers
    const trackerCards = document.querySelectorAll('.tracker-card');
    trackerCards.forEach(card => {
        card.addEventListener('click', function() {
            const trackerType = this.getAttribute('data-tracker');
            if (trackerType) {
                window.location.href = `tracker-detail.html?type=${trackerType}`;
            }
        });
    });

    // Floating action button
    const addTrackerBtn = document.getElementById('addTrackerBtn');
    if (addTrackerBtn) {
        addTrackerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Add new tracker functionality coming soon!');
        });
    }

    const addEntryBtn = document.getElementById('addEntryBtn');
    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('Add new entry functionality coming soon!');
        });
    }

    // Period tabs functionality
    const periodTabs = document.querySelectorAll('.period-tab');
    periodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            periodTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const period = this.getAttribute('data-period');
            updateChartForPeriod(period);
        });
    });

    // Update chart based on selected period
    function updateChartForPeriod(period) {
        console.log('Updating chart for period:', period);
        // This would fetch and display data for the selected period
        // For now, it's just a placeholder
    }

    // Load tracker type from URL for detail page
    const urlParams = new URLSearchParams(window.location.search);
    const trackerType = urlParams.get('type');

    if (trackerType && document.getElementById('trackerTitle')) {
        // Update title based on tracker type
        const titles = {
            'calories': 'Calories',
            'sleep': 'Sleep',
            'water': 'Water',
            'walk': 'Walk',
            'training': 'Training',
            'heart': 'Heart'
        };

        const title = titles[trackerType] || 'Tracker';
        document.getElementById('trackerTitle').textContent = title;

        // Update progress ring color based on tracker type
        updateTrackerColor(trackerType);
    }

    // Update progress ring colors based on tracker type
    function updateTrackerColor(type) {
        const dateProgress = document.querySelector('.date-progress');
        if (!dateProgress) return;

        const colors = {
            'calories': '#ff006e',
            'sleep': '#ffbe0b',
            'water': '#4895ef',
            'walk': '#fb5607',
            'training': '#6366f1',
            'heart': '#e63946'
        };

        const color = colors[type] || '#fb5607';
        dateProgress.style.stroke = color;

        // Update highlight bar color in chart
        const highlightBar = document.querySelector('.chart-bar.highlight');
        if (highlightBar) {
            highlightBar.style.background = color;
            highlightBar.style.boxShadow = `0 0 12px ${color}80`;
        }
    }

    // Menu button handler
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            alert('Menu functionality coming soon!');
        });
    }

    // Add hover effects to tracker cards
    trackerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Animate progress rings on load
    animateProgressRings();
});

// Animate progress rings
function animateProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring-fill');

    progressRings.forEach(ring => {
        const offset = ring.style.strokeDashoffset || ring.getAttribute('stroke-dashoffset');
        ring.style.strokeDashoffset = ring.getAttribute('stroke-dasharray');

        setTimeout(() => {
            ring.style.transition = 'stroke-dashoffset 1s ease-out';
            ring.style.strokeDashoffset = offset;
        }, 100);
    });
}

// Update active nav item based on current page
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage.includes('tracker') && href === 'toolbox.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

updateActiveNav();
