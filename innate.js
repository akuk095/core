// Selection menu data for each subtrait
const selectionData = {
    'optimism-pessimism': [
        { value: 'highly-optimistic', text: 'Highly Optimistic – See the positive in nearly every situation.' },
        { value: 'moderately-optimistic', text: 'Moderately Optimistic – Generally hopeful, with occasional doubts.' },
        { value: 'realistic', text: 'Realistic/Pragmatic – Balance hope with practical expectations.' },
        { value: 'moderately-pessimistic', text: 'Moderately Pessimistic – Often anticipate problems but can adjust.' },
        { value: 'highly-pessimistic', text: 'Highly Pessimistic – Expect the worst and struggles to see the positive.' }
    ],
    'introversion-extroversion': [
        { value: 'highly-extroverted', text: 'Highly Extroverted – Energised by social interaction; enjoy crowds and engagement.' },
        { value: 'moderately-extroverted', text: 'Moderately Extroverted – Socially confident, enjoy groups but needs some alone time.' },
        { value: 'ambiverted', text: 'Ambiverted – Comfortable alone or in groups; flexible social energy.' },
        { value: 'moderately-introverted', text: 'Moderately Introverted – Prefer small groups and one-on-one interactions.' },
        { value: 'highly-introverted', text: 'Highly Introverted – Drain quickly in social situations; need significant alone time.' }
    ],
    'resilience': [
        { value: 'exceptionally-resilient', text: 'Exceptionally Resilient – Bounce back quickly, thrive under pressure.' },
        { value: 'resilient', text: 'Resilient – Handle setbacks reasonably well with minor recovery time.' },
        { value: 'moderately-resilient', text: 'Moderately Resilient – Recover after stress but need support.' },
        { value: 'low-resilience', text: 'Low Resilience – Struggle to recover from setbacks.' },
        { value: 'highly-vulnerable', text: 'Highly Vulnerable – Easily overwhelmed by stress; slow recovery.' }
    ],
    'stress-tolerance': [
        { value: 'high', text: 'High Stress Tolerance – Function effectively under high pressure.' },
        { value: 'moderate', text: 'Moderate Stress Tolerance – Can handle stress in short bursts, struggles under chronic stress.' },
        { value: 'low', text: 'Low Stress Tolerance – Find most stressors challenging, performance declines under pressure.' }
    ],
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
    'curiosity': [
        { value: 'curious', text: 'Curious – Naturally inquisitive, enjoy exploring ideas.' },
        { value: 'moderately-curious', text: 'Moderately Curious – Interested in learning, selectively engaged.' },
        { value: 'low-curiosity', text: 'Low Curiosity – Prefer routine or familiar knowledge.' }
    ],
    'patience': [
        { value: 'patient', text: 'Patient – Can wait and work through processes without frustration.' },
        { value: 'moderately-patient', text: 'Moderately Patient – Patience varies by context.' },
        { value: 'impatient', text: 'Impatient – Easily frustrated by delay or repetition.' }
    ],
    'courage': [
        { value: 'courageous', text: 'Courageous – Willing to take risks or stand for beliefs.' },
        { value: 'moderately-courageous', text: 'Moderately Courageous – Courage depends on context or stakes.' },
        { value: 'cautious', text: 'Cautious/Timid – Avoids risk and confrontation where possible.' }
    ],
    'empathy': [
        { value: 'empathetic', text: 'Empathetic – Strong understanding of others\' feelings.' },
        { value: 'moderately-empathetic', text: 'Moderately Empathetic – Sympathetic but sometimes detached.' },
        { value: 'low-empathy', text: 'Low Empathy – Focused on self or logic rather than emotions.' }
    ],
    'adaptability': [
        { value: 'adaptable', text: 'Adaptable – Easily adjust to new conditions.' },
        { value: 'moderately-adaptable', text: 'Moderately Adaptable – Can adjust but may resist change initially.' },
        { value: 'rigid', text: 'Rigid – Prefer routine and struggles with change.' },
        { value: 'flexible', text: 'Flexible – Open to adjusting methods or goals when necessary.' }
    ]
};

// State management
let currentSubtrait = null;
let currentSelection = null;
let userResponses = {};

// Load saved data
function loadUserData() {
    const saved = localStorage.getItem('innateData');
    if (saved) {
        userResponses = JSON.parse(saved);
        renderCompletedSubtraits();
    }
}

// Save data
function saveUserData() {
    localStorage.setItem('innateData', JSON.stringify(userResponses));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupEventListeners();
});

function setupEventListeners() {
    // Trait card expand/collapse
    document.querySelectorAll('.trait-card').forEach(card => {
        const header = card.querySelector('.trait-header');
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTraitCard(card);
        });
    });

    // Subtrait card clicks
    document.querySelectorAll('.subtrait-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const subtraitId = card.getAttribute('data-subtrait');

            // Check if already completed
            if (userResponses[subtraitId]) {
                showResetDialogue(subtraitId, card);
            } else {
                showSelectionMenu(card);
            }
        });
    });
}

function toggleTraitCard(card) {
    const isExpanded = card.classList.contains('expanded');

    // Close all other trait cards
    document.querySelectorAll('.trait-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });

    // Toggle current card
    card.classList.toggle('expanded');
}

function showSelectionMenu(subtraitCard) {
    currentSubtrait = subtraitCard;
    const subtraitId = subtraitCard.getAttribute('data-subtrait');
    const options = selectionData[subtraitId];

    if (!options) {
        console.error('No selection data for:', subtraitId);
        return;
    }

    // Add animation class to subtrait card
    subtraitCard.classList.add('menu-opening');

    const menu = document.querySelector('.selection-menu');
    const overlay = document.querySelector('.menu-overlay');

    // Clear and populate menu
    menu.innerHTML = '';
    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'menu-option';
        optionEl.textContent = option.text;
        optionEl.dataset.value = option.value;
        optionEl.addEventListener('click', () => selectOption(option));
        menu.appendChild(optionEl);
    });

    // Calculate menu positioning
    const rect = subtraitCard.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const bottomNavHeight = 100;
    const menuPadding = 20;
    const maxMenuHeight = viewportHeight * 0.7; // 70vh

    // Calculate available space
    const spaceBelow = viewportHeight - rect.bottom - bottomNavHeight - menuPadding;
    const spaceAbove = rect.top - menuPadding;

    // Reset any previous max-height
    menu.style.maxHeight = '';

    // Determine position and set transform origin
    if (spaceBelow >= 300) {
        // Dropdown - position below the tile
        const topPosition = rect.bottom + 10;
        const availableHeight = Math.min(spaceBelow - 10, maxMenuHeight);

        menu.style.top = topPosition + 'px';
        menu.style.bottom = 'auto';
        menu.style.maxHeight = availableHeight + 'px';
        menu.classList.add('dropdown');
        menu.classList.remove('dropup');

        // Set transform origin to top center (appears from the tile)
        menu.style.transformOrigin = 'top center';

    } else if (spaceAbove >= 300) {
        // Dropup - position above the tile
        const bottomPosition = viewportHeight - rect.top + 10;
        const availableHeight = Math.min(spaceAbove - 10, maxMenuHeight);

        menu.style.bottom = bottomPosition + 'px';
        menu.style.top = 'auto';
        menu.style.maxHeight = availableHeight + 'px';
        menu.classList.add('dropup');
        menu.classList.remove('dropdown');

        // Set transform origin to bottom center (appears from the tile)
        menu.style.transformOrigin = 'bottom center';

    } else {
        // Limited space - center it vertically with safe margins
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

    // Show menu with slight delay for animation
    overlay.classList.add('active');
    setTimeout(() => menu.classList.add('active'), 10);

    // Close on overlay click
    overlay.onclick = closeSelectionMenu;
}

function closeSelectionMenu() {
    const menu = document.querySelector('.selection-menu');
    const overlay = document.querySelector('.menu-overlay');
    menu.classList.remove('active');
    overlay.classList.remove('active');

    // Remove animation class from subtrait with delay
    if (currentSubtrait) {
        setTimeout(() => {
            currentSubtrait.classList.remove('menu-opening');
        }, 400);
    }
}

function selectOption(option) {
    // Extract main word (before dash)
    const mainWord = option.text.split('–')[0].trim();

    currentSelection = {
        value: option.value,
        mainWord: mainWord,
        fullText: option.text
    };

    closeSelectionMenu();

    // Start dialogue sequence
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId] = {
        selection: currentSelection,
        reason: '',
        action: '',
        plan: ''
    };

    showDialogue1();
}

function showDialogue1() {
    showDialogue(
        'Why do you feel that way?',
        true,
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

function showDialogue2() {
    showDialogue(
        'Will you like to:',
        false,
        [
            { text: 'Improve', class: 'improve', onClick: () => onActionSelected('improve') },
            { text: 'Modify', class: 'modify', onClick: () => onActionSelected('modify') },
            { text: 'Accept it', class: 'accept', onClick: () => onActionSelected('accept') }
        ]
    );
}

function onActionSelected(action) {
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId].action = action;
    closeDialogue();
    showDialogue3();
}

function showDialogue3() {
    showDialogue(
        'How do you plan to achieve that?',
        true,
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

function showDialogue4() {
    showDialogue(
        'Do you want to open the toolbox?',
        false,
        [
            { text: 'Yes', primary: true, onClick: () => {
                closeDialogue();
                saveUserData();
                renderCompletedSubtrait(currentSubtrait);
                // TODO: Navigate to toolbox
                console.log('Navigate to toolbox');
            }},
            { text: 'No', primary: false, onClick: () => {
                closeDialogue();
                saveUserData();
                renderCompletedSubtrait(currentSubtrait);
            }}
        ]
    );
}

function showDialogue(title, hasInput, buttons) {
    const overlay = document.createElement('div');
    overlay.className = 'dialogue-overlay active';
    overlay.id = 'current-dialogue';

    const box = document.createElement('div');
    box.className = 'dialogue-box';

    const titleEl = document.createElement('div');
    titleEl.className = 'dialogue-title';
    titleEl.textContent = title;
    box.appendChild(titleEl);

    let inputEl = null;
    if (hasInput) {
        inputEl = document.createElement('textarea');
        inputEl.className = 'dialogue-input';
        inputEl.placeholder = 'Type your answer here...';
        box.appendChild(inputEl);
    }

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

function closeDialogue() {
    const overlay = document.getElementById('current-dialogue');
    if (overlay) {
        overlay.remove();
    }
}

function renderCompletedSubtrait(subtraitCard) {
    const subtraitId = subtraitCard.getAttribute('data-subtrait');
    const data = userResponses[subtraitId];

    if (!data) return;

    subtraitCard.classList.add('completed');
    subtraitCard.innerHTML = '';

    const valueEl = document.createElement('div');
    valueEl.className = 'subtrait-value';
    valueEl.textContent = data.selection.mainWord;
    subtraitCard.appendChild(valueEl);

    const actionEl = document.createElement('span');
    actionEl.className = `subtrait-action ${data.action}`;
    actionEl.textContent = data.action.charAt(0).toUpperCase() + data.action.slice(1);
    subtraitCard.appendChild(actionEl);

    const reasonEl = document.createElement('div');
    reasonEl.className = 'subtrait-reason';
    reasonEl.textContent = data.reason;
    subtraitCard.appendChild(reasonEl);

    const planEl = document.createElement('div');
    planEl.className = 'subtrait-plan';
    planEl.textContent = `I plan to ${data.action} on this by ${data.plan}`;
    subtraitCard.appendChild(planEl);
}

function renderCompletedSubtraits() {
    Object.keys(userResponses).forEach(subtraitId => {
        const subtraitCard = document.querySelector(`[data-subtrait="${subtraitId}"]`);
        if (subtraitCard) {
            renderCompletedSubtrait(subtraitCard);
        }
    });
}

function showResetDialogue(subtraitId, subtraitCard) {
    showDialogue(
        'Do you want to reset and change your selection?',
        false,
        [
            { text: 'Yes', primary: true, onClick: () => resetSubtrait(subtraitId, subtraitCard) },
            { text: 'Cancel', primary: false, onClick: closeDialogue },
            { text: 'Edit answers', class: 'modify', onClick: () => editAnswers(subtraitId, subtraitCard) }
        ]
    );
}

function resetSubtrait(subtraitId, subtraitCard) {
    delete userResponses[subtraitId];
    saveUserData();
    closeDialogue();

    // Reset the card
    subtraitCard.classList.remove('completed');
    const originalText = subtraitCard.getAttribute('data-original-text') || 'Select';
    subtraitCard.innerHTML = `
        <span>${originalText}</span>
        <svg class="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7"/>
        </svg>
    `;
}

function editAnswers(subtraitId, subtraitCard) {
    closeDialogue();
    currentSubtrait = subtraitCard;
    const data = userResponses[subtraitId];
    currentSelection = data.selection;

    // Show edit dialogue for reason
    showDialogue(
        'Edit: Why do you feel that way?',
        true,
        [
            { text: 'Done', primary: true, onClick: (input) => {
                userResponses[subtraitId].reason = input.value.trim();
                closeDialogue();
                showDialogue2(); // Continue to next dialogue
            }}
        ]
    );

    // Pre-fill the input
    setTimeout(() => {
        const input = document.querySelector('.dialogue-input');
        if (input) input.value = data.reason;
    }, 10);
}

// Store original text for reset
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subtrait-card').forEach(card => {
        const originalText = card.querySelector('span')?.textContent;
        if (originalText) {
            card.setAttribute('data-original-text', originalText);
        }
    });
});
