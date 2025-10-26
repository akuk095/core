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

// Add touch feedback for mobile
document.querySelectorAll('.domain-card, .nav-item, .tool-btn, .menu-btn').forEach(element => {
    element.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
    });

    element.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
});
