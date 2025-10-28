// Profile Page JavaScript

// Update user name from localStorage or default
document.addEventListener('DOMContentLoaded', function() {
    // Get user name from localStorage or use default
    const userName = localStorage.getItem('userName') || 'Ammar';
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement) {
        profileNameElement.textContent = userName;
    }

    // Initialize toggle switches from localStorage
    initializeToggles();

    // Add event listeners
    addEventListeners();
});

// Initialize toggle switches
function initializeToggles() {
    // Push notifications toggle
    const pushToggle = document.querySelector('.setting-item:nth-child(1) .toggle-switch input');
    if (pushToggle) {
        const pushNotificationsEnabled = localStorage.getItem('pushNotifications') !== 'false';
        pushToggle.checked = pushNotificationsEnabled;
    }

    // Email notifications toggle
    const emailToggle = document.querySelector('.setting-item:nth-child(2) .toggle-switch input');
    if (emailToggle) {
        const emailNotificationsEnabled = localStorage.getItem('emailNotifications') === 'true';
        emailToggle.checked = emailNotificationsEnabled;
    }
}

// Add event listeners to interactive elements
function addEventListeners() {
    // Edit avatar button
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', handleEditAvatar);
    }

    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', handleEditProfile);
    }

    // Toggle switches
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', handleToggleChange);
    });

    // Sign out button
    const signOutBtn = document.querySelector('.sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }

    // Clickable settings
    addClickableSettingsListeners();
}

// Handle edit avatar
function handleEditAvatar() {
    // In a real app, this would open an image picker
    showToast('Avatar editing coming soon!');
}

// Handle edit profile
function handleEditProfile() {
    const newName = prompt('Enter your name:', localStorage.getItem('userName') || 'Ammar');
    if (newName && newName.trim()) {
        localStorage.setItem('userName', newName.trim());
        document.getElementById('profileName').textContent = newName.trim();

        // Update name on home page as well
        const homeUserName = document.getElementById('userName');
        if (homeUserName) {
            homeUserName.textContent = newName.trim();
        }

        showToast('Profile updated successfully!');
    }
}

// Handle toggle changes
function handleToggleChange(event) {
    const settingItem = event.target.closest('.setting-item');
    const settingTitle = settingItem.querySelector('h4').textContent;
    const isEnabled = event.target.checked;

    // Save to localStorage
    if (settingTitle === 'Push Notifications') {
        localStorage.setItem('pushNotifications', isEnabled);
        showToast(`Push notifications ${isEnabled ? 'enabled' : 'disabled'}`);
    } else if (settingTitle === 'Email Notifications') {
        localStorage.setItem('emailNotifications', isEnabled);
        showToast(`Email notifications ${isEnabled ? 'enabled' : 'disabled'}`);
    }
}

// Add listeners to clickable settings
function addClickableSettingsListeners() {
    const clickableSettings = document.querySelectorAll('.setting-item.clickable');

    clickableSettings.forEach(item => {
        const settingTitle = item.querySelector('h4').textContent;

        item.addEventListener('click', () => {
            switch (settingTitle) {
                case 'Default View':
                    handleDefaultView();
                    break;
                case 'Theme':
                    handleTheme();
                    break;
                case 'Language':
                    handleLanguage();
                    break;
                case 'Privacy Policy':
                    handlePrivacyPolicy();
                    break;
                case 'Export Data':
                    handleExportData();
                    break;
                case 'Terms of Service':
                    handleTermsOfService();
                    break;
                case 'Connected Accounts':
                    handleConnectedAccounts();
                    break;
                case 'Backup & Restore':
                    handleBackupRestore();
                    break;
                case 'Delete Account':
                    handleDeleteAccount();
                    break;
                case 'Help & Support':
                    handleHelpSupport();
                    break;
            }
        });
    });
}

// Setting handlers
function handleDefaultView() {
    const options = ['Home', 'Dashboard', 'Toolbox'];
    const current = localStorage.getItem('defaultView') || 'Home';
    const currentIndex = options.indexOf(current);
    const nextIndex = (currentIndex + 1) % options.length;
    const newView = options[nextIndex];

    localStorage.setItem('defaultView', newView);

    // Update the display
    const viewText = document.querySelector('.setting-item.clickable:nth-of-type(1) .setting-text p');
    if (viewText) {
        viewText.textContent = newView;
    }

    showToast(`Default view set to ${newView}`);
}

function handleTheme() {
    showToast('Theme customization coming soon!');
}

function handleLanguage() {
    showToast('Language selection coming soon!');
}

function handlePrivacyPolicy() {
    showToast('Opening Privacy Policy...');
    // In a real app, this would open the privacy policy page
}

function handleExportData() {
    if (confirm('Export all your data? This will download a JSON file with your information.')) {
        showToast('Exporting data...');

        // Simulate data export
        setTimeout(() => {
            const data = {
                profile: {
                    name: localStorage.getItem('userName') || 'Ammar',
                    email: 'ammar@example.com'
                },
                settings: {
                    pushNotifications: localStorage.getItem('pushNotifications') !== 'false',
                    emailNotifications: localStorage.getItem('emailNotifications') === 'true',
                    defaultView: localStorage.getItem('defaultView') || 'Home'
                },
                exportDate: new Date().toISOString()
            };

            // In a real app, this would trigger a download
            console.log('Exported data:', data);
            showToast('Data exported successfully!');
        }, 1000);
    }
}

function handleTermsOfService() {
    showToast('Opening Terms of Service...');
}

function handleConnectedAccounts() {
    showToast('Account connections coming soon!');
}

function handleBackupRestore() {
    showToast('Backup & Restore coming soon!');
}

function handleDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('Final confirmation: Delete your account permanently?')) {
            showToast('Account deletion feature coming soon');
            // In a real app, this would delete the account
        }
    }
}

function handleHelpSupport() {
    showToast('Opening Help & Support...');
}

// Handle sign out
function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear user session data (but keep preferences)
        showToast('Signing out...');

        setTimeout(() => {
            // In a real app, this would redirect to login page
            // For now, just refresh the page
            window.location.href = 'index.html';
        }, 500);
    }
}

// Toast notification function
function showToast(message) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Add toast to body
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add toast CSS
const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(127, 255, 212, 0.95);
    color: #1e3a4f;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
    max-width: 80%;
    text-align: center;
}

.toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}
`;
document.head.appendChild(style);
