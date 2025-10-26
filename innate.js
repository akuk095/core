// State management
let currentTrait = null;
let currentSubtrait = null;
let currentSelection = null;
let dialogueStep = 0;
let userResponses = {};

// Load saved data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('innateData');
    if (saved) {
        userResponses = JSON.parse(saved);
        renderCompletedSubtraits();
    }
}

// Save data to localStorage
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
            if (!e.target.closest('.subtrait-card')) {
                toggleTraitCard(card);
            }
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
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
    }
}

function showSelectionMenu(subtraitCard) {
    currentSubtrait = subtraitCard;
    const menu = subtraitCard.querySelector('.selection-menu');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    // Show menu
    setTimeout(() => {
        overlay.classList.add('active');
        menu.classList.add('active');
    }, 10);

    // Setup menu option clicks
    menu.querySelectorAll('.menu-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedText = this.textContent.trim();
            const selectedValue = this.getAttribute('data-value');

            // Extract main word (before the dash)
            const mainWord = selectedText.split('–')[0].trim();

            currentSelection = {
                value: selectedValue,
                mainWord: mainWord,
                fullText: selectedText
            };

            // Close menu
            menu.classList.remove('active');
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);

            // Start dialogue sequence
            startDialogueSequence(subtraitCard);
        });
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    });
}

function startDialogueSequence(subtraitCard) {
    dialogueStep = 0;
    const subtraitId = subtraitCard.getAttribute('data-subtrait');

    userResponses[subtraitId] = {
        selection: currentSelection,
        reason: '',
        action: '',
        plan: ''
    };

    showDialogue1(); // Why do you feel that way?
}

function showDialogue1() {
    const dialogue = createDialogueBox(
        'Why do you feel that way?',
        'textarea',
        [
            { text: 'Done', action: onDialogue1Done, primary: true },
            { text: 'Cancel', action: closeDialogue, primary: false }
        ]
    );
    showDialogueOverlay(dialogue);
}

function onDialogue1Done(input) {
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId].reason = input.value.trim();
    closeDialogue();

    if (userResponses[subtraitId].reason) {
        showDialogue2();
    }
}

function showDialogue2() {
    const dialogue = createDialogueBox(
        'Will you like to:',
        'buttons',
        [
            { text: 'Improve', action: () => onDialogue2Done('improve'), class: 'improve' },
            { text: 'Modify', action: () => onDialogue2Done('modify'), class: 'modify' },
            { text: 'Accept it', action: () => onDialogue2Done('accept'), class: 'accept' }
        ]
    );
    showDialogueOverlay(dialogue);
}

function onDialogue2Done(action) {
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId].action = action;
    closeDialogue();
    showDialogue3();
}

function showDialogue3() {
    const dialogue = createDialogueBox(
        'How do you plan to achieve that?',
        'textarea',
        [
            { text: 'Done', action: onDialogue3Done, primary: true }
        ]
    );
    showDialogueOverlay(dialogue);
}

function onDialogue3Done(input) {
    const subtraitId = currentSubtrait.getAttribute('data-subtrait');
    userResponses[subtraitId].plan = input.value.trim();
    closeDialogue();

    if (userResponses[subtraitId].plan) {
        showDialogue4();
    }
}

function showDialogue4() {
    const dialogue = createDialogueBox(
        'Do you want to open the toolbox?',
        'buttons',
        [
            { text: 'Yes', action: onToolboxYes, primary: true },
            { text: 'No', action: onToolboxNo, primary: false }
        ]
    );
    showDialogueOverlay(dialogue);
}

function onToolboxYes() {
    closeDialogue();
    saveUserData();
    renderCompletedSubtrait(currentSubtrait);
    // TODO: Navigate to toolbox (functionality to be implemented later)
    console.log('Navigate to toolbox');
}

function onToolboxNo() {
    closeDialogue();
    saveUserData();
    renderCompletedSubtrait(currentSubtrait);
}

function createDialogueBox(title, type, buttons) {
    const dialogue = document.createElement('div');
    dialogue.className = 'dialogue-box';

    const titleEl = document.createElement('div');
    titleEl.className = 'dialogue-title';
    titleEl.textContent = title;
    dialogue.appendChild(titleEl);

    let inputEl = null;
    if (type === 'textarea') {
        inputEl = document.createElement('textarea');
        inputEl.className = 'dialogue-input';
        inputEl.placeholder = 'Type your answer here...';
        dialogue.appendChild(inputEl);
    }

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'dialogue-buttons';

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'dialogue-btn';
        if (btn.class) button.classList.add(btn.class);
        if (!btn.primary) button.classList.add('secondary');
        button.textContent = btn.text;
        button.addEventListener('click', () => {
            if (type === 'textarea' && inputEl) {
                btn.action(inputEl);
            } else {
                btn.action();
            }
        });
        buttonsContainer.appendChild(button);
    });

    dialogue.appendChild(buttonsContainer);
    return dialogue;
}

function showDialogueOverlay(dialogueBox) {
    const overlay = document.createElement('div');
    overlay.className = 'dialogue-overlay';
    overlay.id = 'current-dialogue';
    overlay.appendChild(dialogueBox);
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeDialogue() {
    const overlay = document.getElementById('current-dialogue');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

function renderCompletedSubtrait(subtraitCard) {
    const subtraitId = subtraitCard.getAttribute('data-subtrait');
    const data = userResponses[subtraitId];

    if (!data) return;

    subtraitCard.classList.add('completed');

    // Clear existing content
    subtraitCard.innerHTML = '';

    // Create display elements
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
    const dialogue = createDialogueBox(
        'Do you want to reset and change your selection?',
        'buttons',
        [
            { text: 'Yes', action: () => onResetYes(subtraitId, subtraitCard), primary: true },
            { text: 'Cancel', action: closeDialogue, primary: false },
            { text: 'Edit answers', action: () => onEditAnswers(subtraitId, subtraitCard), class: 'modify' }
        ]
    );
    showDialogueOverlay(dialogue);
}

function onResetYes(subtraitId, subtraitCard) {
    delete userResponses[subtraitId];
    saveUserData();
    closeDialogue();

    // Reset the subtrait card
    subtraitCard.classList.remove('completed');
    subtraitCard.innerHTML = `
        <span>${subtraitCard.getAttribute('data-original-text') || 'Select'}</span>
        <svg class="select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7"/>
        </svg>
    `;

    // Re-add selection menu
    const menu = document.createElement('div');
    menu.className = 'selection-menu';
    // Add menu options based on subtrait type
    subtraitCard.appendChild(menu);
}

function onEditAnswers(subtraitId, subtraitCard) {
    closeDialogue();
    currentSubtrait = subtraitCard;

    const data = userResponses[subtraitId];
    currentSelection = data.selection;

    // Show edit dialogue for reason
    showEditDialogue1(subtraitId);
}

function showEditDialogue1(subtraitId) {
    const data = userResponses[subtraitId];

    const dialogue = document.createElement('div');
    dialogue.className = 'dialogue-box';

    const title = document.createElement('div');
    title.className = 'dialogue-title';
    title.textContent = 'Edit: Why do you feel that way?';
    dialogue.appendChild(title);

    const input = document.createElement('textarea');
    input.className = 'dialogue-input';
    input.value = data.reason;
    dialogue.appendChild(input);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'dialogue-buttons';

    const doneBtn = document.createElement('button');
    doneBtn.className = 'dialogue-btn';
    doneBtn.textContent = 'Done';
    doneBtn.addEventListener('click', () => {
        userResponses[subtraitId].reason = input.value.trim();
        closeDialogue();
        showDialogue2(); // Continue to next dialogue
    });

    buttonsContainer.appendChild(doneBtn);
    dialogue.appendChild(buttonsContainer);

    showDialogueOverlay(dialogue);
}

// Store original text for reset functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.subtrait-card').forEach(card => {
        const originalText = card.querySelector('span')?.textContent;
        if (originalText) {
            card.setAttribute('data-original-text', originalText);
        }
    });
});
