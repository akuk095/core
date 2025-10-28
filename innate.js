/* ==========================================
   INNATE PAGE - TRAIT SELECTION SYSTEM
   ==========================================

   This file handles the interactive trait selection system:
   - Expanding/collapsing trait cards
   - Opening selection menus for each subtrait
   - Managing dialogue flows for user responses
   - Storing and displaying user selections
   - Showing collapsed summary views

   ========================================== */

// ==========================================
// SELECTION MENU DATA
// Contains all the options for each subtrait
// ==========================================

const selectionData = {
    // Temperament trait options
    'optimism-pessimism': [
        { value: 'highly-optimistic', text: 'Highly Optimistic – See the positive in nearly every situation.' },
        { value: 'moderately-optimistic', text: 'Moderately Optimistic – Generally hopeful, with occasional doubts.' },
        { value: 'realistic', text: 'Realistic/Pragmatic – Balance hope with practical expectations.' },
        { value: 'moderately-pessimistic', text: 'Moderately Pessimistic – Often anticipate problems but can adjust.' },
        { value: 'highly-pessimistic', text: 'Highly Pessimistic – Expect the worst and struggles to see the positive.' }
    ],

    // Disposition trait options
    'introversion-extroversion': [
        { value: 'highly-extroverted', text: 'Highly Extroverted – Energised by social interaction; enjoy crowds and engagement.' },
        { value: 'moderately-extroverted', text: 'Moderately Extroverted – Socially confident, enjoy groups but needs some alone time.' },
        { value: 'ambiverted', text: 'Ambiverted – Comfortable alone or in groups; flexible social energy.' },
        { value: 'moderately-introverted', text: 'Moderately Introverted – Prefer small groups and one-on-one interactions.' },
        { value: 'highly-introverted', text: 'Highly Introverted – Drain quickly in social situations; need significant alone time.' }
    ],

    // Natural Resilience options
    'resilience': [
        { value: 'exceptionally-resilient', text: 'Exceptionally Resilient – Bounce back quickly, thrive under pressure.' },
        { value: 'resilient', text: 'Resilient – Handle setbacks reasonably well with minor recovery time.' },
        { value: 'moderately-resilient', text: 'Moderately Resilient – Recover after stress but need support.' },
        { value: 'low-resilience', text: 'Low Resilience – Struggle to recover from setbacks.' },
        { value: 'highly-vulnerable', text: 'Highly Vulnerable – Easily overwhelmed by stress; slow recovery.' }
    ],

    // Stress Tolerance options
    'stress-tolerance': [
        { value: 'high', text: 'High Stress Tolerance – Function effectively under high pressure.' },
        { value: 'moderate', text: 'Moderate Stress Tolerance – Can handle stress in short bursts, struggles under chronic stress.' },
        { value: 'low', text: 'Low Stress Tolerance – Find most stressors challenging, performance declines under pressure.' }
    ],

    // Natural Talents & Inclinations options
    'talents': [
        { value: 'analytical', text: 'Analytical – Strong pattern recognition and problem-solving.' },
        { value: 'creative', text: 'Creative – Excel at generating original ideas or artistic expression.' },
        { value: 'practical', text: 'Practical – Skilled at applying knowledge to real-world tasks.' },
        { value: 'mechanical', text: 'Mechanical/Technical – Aptitude for tools, machines, or technical systems.' },
        { value: 'social', text: 'Social/Emotional – Naturally empathetic and skilled with people.' },
        { value: 'curious', text: 'Curious – Drawn to learning and exploring new concepts.' },
        { value: 'detail-oriented', text: 'Detail-Oriented – Notice small but significant details.' },
        { value: 'big-picture', text: 'Big-Picture Thinker – Focused on overarching patterns, vision, or strategy.' },
        { value: 'intuitive', text: 'Intuitive – Rely on gut feeling or instinct for decisions.' },
        { value: 'disciplined', text: 'Disciplined – Strong self-control, persistence, and organisation.' }
    ],

    // Core Personality Traits - Curiosity
    'curiosity': [
        { value: 'curious', text: 'Curious – Naturally inquisitive, enjoy exploring ideas.' },
        { value: 'moderately-curious', text: 'Moderately Curious – Interested in learning, selectively engaged.' },
        { value: 'low-curiosity', text: 'Low Curiosity – Prefer routine or familiar knowledge.' }
    ],

    // Core Personality Traits - Patience
    'patience': [
        { value: 'patient', text: 'Patient – Can wait and work through processes without frustration.' },
        { value: 'moderately-patient', text: 'Moderately Patient – Patience varies by context.' },
        { value: 'impatient', text: 'Impatient – Easily frustrated by delay or repetition.' }
    ],

    // Core Personality Traits - Courage
    'courage': [
        { value: 'courageous', text: 'Courageous – Willing to take risks or stand for beliefs.' },
        { value: 'moderately-courageous', text: 'Moderately Courageous – Courage depends on context or stakes.' },
        { value: 'cautious', text: 'Cautious/Timid – Avoids risk and confrontation where possible.' }
    ],

    // Core Personality Traits - Empathy
    'empathy': [
        { value: 'empathetic', text: 'Empathetic – Strong understanding of others\' feelings.' },
        { value: 'moderately-empathetic', text: 'Moderately Empathetic – Sympathetic but sometimes detached.' },
        { value: 'low-empathy', text: 'Low Empathy – Focused on self or logic rather than emotions.' }
    ],

    // Core Personality Traits - Adaptability
    'adaptability': [
        { value: 'adaptable', text: 'Adaptable – Easily adjust to new conditions.' },
        { value: 'moderately-adaptable', text: 'Moderately Adaptable – Can adjust but may resist change initially.' },
        { value: 'rigid', text: 'Rigid – Prefer routine and struggles with change.' },
        { value: 'flexible', text: 'Flexible – Open to adjusting methods or goals when necessary.' }
    ]
};

// ==========================================
// STATE MANAGEMENT
// Track current selections and user responses
// ==========================================

let currentSubtrait = null;  // Currently selected subtrait element
let currentSelection = null;  // Current selection being processed
let userResponses = {};       // All saved user responses (persisted to localStorage)

// ==========================================
// DATA PERSISTENCE
// Load and save user data from/to browser localStorage
// ==========================================

/**
 * Load saved user responses from localStorage
 * Called on page load to restore previous selections
 */
function loadUserData() {
    const saved = localStorage.getItem('innateData');
    if (saved) {
        userResponses = JSON.parse(saved);
        renderCompletedSubtraits();
        updateAllTraitSummaries(); // Show collapsed summaries for completed traits
    }
}

/**
 * Save current user responses to localStorage
 * Called after each completed selection
 */
function saveUserData() {
    localStorage.setItem('innateData', JSON.stringify(userResponses));
}

// ==========================================
// INITIALIZATION
// Set up event listeners when page loads
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
});

/**
 * Set up all click event listeners for trait cards and subtrait cards
 */
function setupEventListeners() {
    // Trait card headers - expand/collapse on click
    document.querySelectorAll('.trait-card').forEach(card => {
        const header = card.querySelector('.trait-header');
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTraitCard(card);
        });
    });

    // Subtrait cards - open selection menu or reset dialogue
    document.querySelectorAll('.subtrait-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const subtraitId = card.getAttribute('data-subtrait');

            // If already completed, show reset dialogue
            if (userResponses[subtraitId]) {
                showResetDialogue(subtraitId, card);
            } else {
                // Otherwise, show selection menu
                showSelectionMenu(card);
            }
        });
    });
}

// ==========================================
// TRAIT CARD EXPAND/COLLAPSE
// ==========================================

/**
 * Toggle a trait card between expanded and collapsed states
 * Also updates the summary view when collapsing
 *
 * @param {HTMLElement} card - The trait card element to toggle
 */
function toggleTraitCard(card) {
    const isExpanded = card.classList.contains('expanded');

    // Close all other trait cards first (accordion behavior)
    document.querySelectorAll('.trait-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });

    // Toggle current card
    card.classList.toggle('expanded');

    // Update summary when collapsing
    if (isExpanded) {
        updateTraitSummary(card);
    }
}

// ==========================================
// COLLAPSED SUMMARY VIEW
// Show selected answer when trait is collapsed
// ==========================================

/**
 * Update or create summary view for a single trait card
 * Shows the main selected value and action type when collapsed
 *
 * @param {HTMLElement} traitCard - The trait card to update
 */
function updateTraitSummary(traitCard) {
    const traitId = traitCard.getAttribute('data-trait');

    // Remove existing summary if present
    const existingSummary = traitCard.querySelector('.trait-summary');
    if (existingSummary) {
        existingSummary.remove();
    }

    // Check if this trait has any completed subtraits
    const subtraits = traitCard.querySelectorAll('.subtrait-card');
    const completedSubtraits = Array.from(subtraits).filter(subtrait => {
        const subtraitId = subtrait.getAttribute('data-subtrait');
        return userResponses[subtraitId];
    });

    // Only show summary if there are completed subtraits
    if (completedSubtraits.length > 0) {
        const header = traitCard.querySelector('.trait-header');

        // Create summary container
        const summary = document.createElement('div');
        summary.className = 'trait-summary';

        // For now, show first completed subtrait's info
        // (In the future, this could aggregate multiple subtraits)
        const firstCompleted = completedSubtraits[0];
        const subtraitId = firstCompleted.getAttribute('data-subtrait');
        const data = userResponses[subtraitId];

        // Create value text (the main answer like "Flexible")
        const valueEl = document.createElement('div');
        valueEl.className = 'trait-summary-value';
        valueEl.textContent = data.selection.mainWord;

        // Create action badge (Improve/Modify/Accept)
        const actionEl = document.createElement('div');
        actionEl.className = `trait-summary-action ${data.action}`;
        actionEl.textContent = data.action.charAt(0).toUpperCase() + data.action.slice(1);

        summary.appendChild(valueEl);
        summary.appendChild(actionEl);

        // Insert summary after header
        header.parentNode.insertBefore(summary, header.nextSibling);
    }
}

/**
 * Update summaries for all trait cards
 * Called after loading data or when multiple traits are updated
 */
function updateAllTraitSummaries() {
    document.querySelectorAll('.trait-card').forEach(card => {
        if (!card.classList.contains('expanded')) {
            updateTraitSummary(card);
        }
    });
}

// ==========================================
// SELECTION MENU
// Popup menu for choosing a value
// ==========================================

/**
 * Show the selection menu for a subtrait
 * Positions the menu appropriately based on available space
 *
 * @param {HTMLElement} subtraitCard - The subtrait card element that was clicked
 */
function showSelectionMenu(subtraitCard) {
    currentSubtrait = subtraitCard;
    const subtraitId = subtraitCard.getAttribute('data-subtrait');
    const options = selectionData[subtraitId];

    if (!options) {
        console.error('No selection data for:', subtraitId);
        return;
    }

    // Prevent body scroll and layout shift when menu opens
    // This fixes the extra space issue
    document.body.classList.add('menu-open');

    // Add visual feedback to clicked tile
    subtraitCard.classList.add('menu-opening');

    const menu = document.querySelector('.selection-menu');
    const overlay = document.querySelector('.menu-overlay');

    // Populate menu with options
    menu.innerHTML = '';
    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'menu-option';
        optionEl.textContent = option.text;
        optionEl.dataset.value = option.value;
        optionEl.addEventListener('click', () => selectOption(option));
        menu.appendChild(optionEl);
    });

    // Calculate optimal menu positioning
    const rect = subtraitCard.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const bottomNavHeight = 100;  // Height of fixed bottom navigation
    const menuPadding = 20;
    const maxMenuHeight = viewportHeight * 0.7; // Maximum 70% of viewport

    // Calculate available space above and below the clicked tile
    const spaceBelow = viewportHeight - rect.bottom - bottomNavHeight - menuPadding;
    const spaceAbove = rect.top - menuPadding;

    // Reset previous max-height to allow recalculation
    menu.style.maxHeight = '';

    // Position menu based on available space
    if (spaceBelow >= 300) {
        // DROPDOWN: Enough space below - menu appears below the tile
        const topPosition = rect.bottom + 10;
        const availableHeight = Math.min(spaceBelow - 10, maxMenuHeight);

        menu.style.top = topPosition + 'px';
        menu.style.bottom = 'auto';
        menu.style.maxHeight = availableHeight + 'px';
        menu.classList.add('dropdown');
        menu.classList.remove('dropup');

        // Menu grows downward from top
        menu.style.transformOrigin = 'top center';

    } else if (spaceAbove >= 300) {
        // DROPUP: Enough space above - menu appears above the tile
        const bottomPosition = viewportHeight - rect.top + 10;
        const availableHeight = Math.min(spaceAbove - 10, maxMenuHeight);

        menu.style.bottom = bottomPosition + 'px';
        menu.style.top = 'auto';
        menu.style.maxHeight = availableHeight + 'px';
        menu.classList.add('dropup');
        menu.classList.remove('dropdown');

        // Menu grows upward from bottom
        menu.style.transformOrigin = 'bottom center';

    } else {
        // LIMITED SPACE: Not enough space either way - center it
        const safeTop = 60;
        const safeBottom = bottomNavHeight + 20;
        const availableHeight = viewportHeight - safeTop - safeBottom;

        menu.style.top = safeTop + 'px';
        menu.style.bottom = safeBottom + 'px';
        menu.style.maxHeight = availableHeight + 'px';
        menu.classList.add('dropdown');
        menu.classList.remove('dropup');
        menu.style.transformOrigin = 'center center';
    }

    // Show menu with slight delay to allow CSS transition
    overlay.classList.add('active');
    setTimeout(() => menu.classList.add('active'), 10);

    // Close menu when clicking overlay
    overlay.onclick = closeSelectionMenu;
}

/**
 * Close the selection menu
 * Removes highlighting from the clicked tile
 */
function closeSelectionMenu() {
    const menu = document.querySelector('.selection-menu');
    const overlay = document.querySelector('.menu-overlay');

    menu.classList.remove('active');
    overlay.classList.remove('active');

    // Restore body scroll
    document.body.classList.remove('menu-open');

    // Remove highlight from clicked tile after animation completes
    if (currentSubtrait) {
        setTimeout(() => {
            currentSubtrait.classList.remove('menu-opening');
        }, 400);
    }
}

/**
 * Handle selection of an option from the menu
 * Extracts the main word and starts the dialogue sequence
 *
 * @param {Object} option - The selected option object {value, text}
 */
function selectOption(option) {
    // Extract main word before the dash (e.g., "Flexible" from "Flexible – ...")
    const mainWord = option.text.split('–')[0].trim();

    currentSelection = {
        value: option.value,
        mainWord: mainWord,
        fullText: option.text
    };

    closeSelectionMenu();

    // Initialize response object for this subtrait
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId] = {
        selection: currentSelection,
        reason: '',
        action: '',
        plan: ''
    };

    // Start the 4-step dialogue flow
    showDialogue1();
}

// ==========================================
// DIALOGUE FLOW
// Four-step questionnaire after selection
// ==========================================

/**
 * Dialogue 1: "Why do you feel that way?"
 * Asks user to explain their selection
 */
function showDialogue1() {
    showDialogue(
        'Why do you feel that way?',
        true,  // has text input
        [
            { text: 'Done', primary: true, onClick: (input) => {
                const subtraitId = currentSubtrait.getAttribute('data-subtrait');
                userResponses[subtraitId].reason = input.value.trim();
                if (userResponses[subtraitId].reason) {
                    closeDialogue();
                    showDialogue2();
                }
            }},
            { text: 'Cancel', primary: false, onClick: () => {
                const subtraitId = currentSubtrait.getAttribute('data-subtrait');
                delete userResponses[subtraitId];
                closeDialogue();
            }}
        ]
    );
}

/**
 * Dialogue 2: "Will you like to: Improve/Modify/Accept?"
 * Asks user what they want to do with this trait
 */
function showDialogue2() {
    showDialogue(
        'Will you like to:',
        false,  // no text input
        [
            { text: 'Improve', class: 'improve', onClick: () => onActionSelected('improve') },
            { text: 'Modify', class: 'modify', onClick: () => onActionSelected('modify') },
            { text: 'Accept it', class: 'accept', onClick: () => onActionSelected('accept') }
        ]
    );
}

/**
 * Handle action selection (Improve/Modify/Accept)
 * Stores the choice and moves to next dialogue
 *
 * @param {string} action - The selected action ('improve', 'modify', or 'accept')
 */
function onActionSelected(action) {
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId].action = action;
    closeDialogue();
    showDialogue3();
}

/**
 * Dialogue 3: "How do you plan to achieve that?"
 * Asks user for their action plan
 */
function showDialogue3() {
    showDialogue(
        'How do you plan to achieve that?',
        true,  // has text input
        [
            { text: 'Done', primary: true, onClick: (input) => {
                const subtraitId = currentSubtrait.getAttribute('data-subtrait');
                userResponses[subtraitId].plan = input.value.trim();
                if (userResponses[subtraitId].plan) {
                    closeDialogue();
                    showDialogue4();
                }
            }}
        ]
    );
}

/**
 * Dialogue 4: "Do you want to open the toolbox?"
 * Final dialogue, saves data and optionally opens toolbox
 */
function showDialogue4() {
    showDialogue(
        'Do you want to open the toolbox?',
        false,  // no text input
        [
            { text: 'Yes', primary: true, onClick: () => {
                closeDialogue();
                saveUserData();
                renderCompletedSubtrait(currentSubtrait);
                updateAllTraitSummaries();
                // TODO: Navigate to toolbox (functionality to be implemented later)
                console.log('Navigate to toolbox');
            }},
            { text: 'No', primary: false, onClick: () => {
                closeDialogue();
                saveUserData();
                renderCompletedSubtrait(currentSubtrait);
                updateAllTraitSummaries();
            }}
        ]
    );
}

/**
 * Generic dialogue box creator
 * Creates a custom dialogue with title, optional input, and buttons
 *
 * @param {string} title - The dialogue title text
 * @param {boolean} hasInput - Whether to show a text input field
 * @param {Array} buttons - Array of button configs {text, onClick, primary?, class?}
 */
function showDialogue(title, hasInput, buttons) {
    const overlay = document.createElement('div');
    overlay.className = 'dialogue-overlay active';
    overlay.id = 'current-dialogue';

    const box = document.createElement('div');
    box.className = 'dialogue-box';

    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'dialogue-title';
    titleEl.textContent = title;
    box.appendChild(titleEl);

    // Optional text input
    let inputEl = null;
    if (hasInput) {
        inputEl = document.createElement('textarea');
        inputEl.className = 'dialogue-input';
        inputEl.placeholder = 'Type your answer here...';
        box.appendChild(inputEl);
    }

    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'dialogue-buttons';

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'dialogue-btn';
        if (btn.class) button.classList.add(btn.class);
        if (btn.primary === false) button.classList.add('secondary');
        button.textContent = btn.text;
        button.addEventListener('click', () => {
            if (hasInput && inputEl) {
                btn.onClick(inputEl);
            } else {
                btn.onClick();
            }
        });
        buttonsContainer.appendChild(button);
    });

    box.appendChild(buttonsContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

/**
 * Close the current dialogue
 */
function closeDialogue() {
    const overlay = document.getElementById('current-dialogue');
    if (overlay) {
        overlay.remove();
    }
}

// ==========================================
// COMPLETED SUBTRAIT RENDERING
// Display completed selections
// ==========================================

/**
 * Render a subtrait as completed
 * Shows the selected value, action, reason, and plan
 *
 * @param {HTMLElement} subtraitCard - The subtrait card to render
 */
function renderCompletedSubtrait(subtraitCard) {
    const subtraitId = subtraitCard.getAttribute('data-subtrait');
    const data = userResponses[subtraitId];

    if (!data) return;

    subtraitCard.classList.add('completed');
    subtraitCard.innerHTML = '';

    // Main selected value (e.g., "Flexible")
    const valueEl = document.createElement('div');
    valueEl.className = 'subtrait-value';
    valueEl.textContent = data.selection.mainWord;
    subtraitCard.appendChild(valueEl);

    // Action badge (Improve/Modify/Accept)
    const actionEl = document.createElement('span');
    actionEl.className = `subtrait-action ${data.action}`;
    actionEl.textContent = data.action.charAt(0).toUpperCase() + data.action.slice(1);
    subtraitCard.appendChild(actionEl);

    // User's reason
    const reasonEl = document.createElement('div');
    reasonEl.className = 'subtrait-reason';
    reasonEl.textContent = data.reason;
    subtraitCard.appendChild(reasonEl);

    // User's plan
    const planEl = document.createElement('div');
    planEl.className = 'subtrait-plan';
    planEl.textContent = `I plan to ${data.action} on this by ${data.plan}`;
    subtraitCard.appendChild(planEl);

    // Update progress ring
    updateProgressRing();
}

/**
 * Render all completed subtraits
 * Called on page load to restore previous selections
 */
function renderCompletedSubtraits() {
    Object.keys(userResponses).forEach(subtraitId => {
        const subtraitCard = document.querySelector(`[data-subtrait="${subtraitId}"]`);
        if (subtraitCard) {
            renderCompletedSubtrait(subtraitCard);
        }
    });
}

// ==========================================
// RESET/EDIT FUNCTIONALITY
// Allow users to change completed selections
// ==========================================

/**
 * Show reset/edit dialogue for a completed subtrait
 *
 * @param {string} subtraitId - The ID of the subtrait
 * @param {HTMLElement} subtraitCard - The subtrait card element
 */
function showResetDialogue(subtraitId, subtraitCard) {
    showDialogue(
        'Do you want to reset and change your selection?',
        false,  // no input
        [
            { text: 'Yes', primary: true, onClick: () => resetSubtrait(subtraitId, subtraitCard) },
            { text: 'Cancel', primary: false, onClick: closeDialogue },
            { text: 'Edit answers', class: 'modify', onClick: () => editAnswers(subtraitId, subtraitCard) }
        ]
    );
}

/**
 * Reset a subtrait to its initial state
 * Deletes saved data and restores original UI
 *
 * @param {string} subtraitId - The ID of the subtrait
 * @param {HTMLElement} subtraitCard - The subtrait card element
 */
function resetSubtrait(subtraitId, subtraitCard) {
    delete userResponses[subtraitId];
    saveUserData();
    closeDialogue();

    // Reset the card to initial state
    subtraitCard.classList.remove('completed');
    const originalText = subtraitCard.getAttribute('data-original-text') || 'Select';
    subtraitCard.innerHTML = `<span>${originalText}</span>`;

    // Update parent trait summary
    const traitCard = subtraitCard.closest('.trait-card');
    if (traitCard && !traitCard.classList.contains('expanded')) {
        updateTraitSummary(traitCard);
    }
}

/**
 * Edit answers for a completed subtrait
 * Allows user to update their previous responses
 *
 * @param {string} subtraitId - The ID of the subtrait
 * @param {HTMLElement} subtraitCard - The subtrait card element
 */
function editAnswers(subtraitId, subtraitCard) {
    closeDialogue();
    currentSubtrait = subtraitCard;
    const data = userResponses[subtraitId];
    currentSelection = data.selection;

    // Show edit dialogue with pre-filled reason
    showDialogue(
        'Edit: Why do you feel that way?',
        true,  // has input
        [
            { text: 'Done', primary: true, onClick: (input) => {
                userResponses[subtraitId].reason = input.value.trim();
                closeDialogue();
                showDialogue2(); // Continue to next dialogue
            }}
        ]
    );

    // Pre-fill the input with existing reason
    setTimeout(() => {
        const input = document.querySelector('.dialogue-input');
        if (input) input.value = data.reason;
    }, 10);
}

// ==========================================
// INITIALIZATION HELPER
// Store original text for reset functionality
// ==========================================

// ==========================================
// PROGRESS TRACKING
// Updates the circular progress ring and text
// ==========================================

function updateProgressRing() {
    const totalTraits = 6; // Total number of trait categories
    const traitCards = document.querySelectorAll('.trait-card');
    let completedCount = 0;

    traitCards.forEach(card => {
        const subtraits = card.querySelectorAll('.subtrait-card');
        let allCompleted = true;

        subtraits.forEach(subtrait => {
            if (!subtrait.classList.contains('completed')) {
                allCompleted = false;
            }
        });

        if (allCompleted && subtraits.length > 0) {
            completedCount++;
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });

    const percentage = Math.round((completedCount / totalTraits) * 100);

    // Update percentage text
    const percentageEl = document.getElementById('progressPercentage');
    if (percentageEl) {
        percentageEl.textContent = percentage + '%';
    }

    // Update progress text
    const progressTextEl = document.getElementById('progressText');
    if (progressTextEl) {
        progressTextEl.textContent = `${completedCount} of ${totalTraits} traits completed`;
    }

    // Update circular progress ring
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subtrait-card').forEach(card => {
        const originalText = card.querySelector('span')?.textContent;
        if (originalText) {
            card.setAttribute('data-original-text', originalText);
        }
    });

    // Initialize progress ring
    updateProgressRing();
});
