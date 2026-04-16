// Treasure Map: Making the Todo Card Come Alive!

// Get all our treasure elements
const todoCard = document.querySelector('.todo-card');
const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const todoTitle = document.querySelector('.todo-title');
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');

// Set the due date (April 22, 2026 at 6:00 PM)
const dueDate = new Date(2026, 3, 22, 18, 0, 0); // Month is 0-indexed, so 3 = April



// Function to calculate and update time remaining
function updateTimeRemaining() {
    const now = new Date();
    const timeDiff = dueDate - now;
    
    const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
    const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
    
    let message = '';
    let isOverdue = false;
    
    // Check if task is Done - if yes, stop updating
    if (statusBadge && statusBadge.textContent === 'Done') {
        if (timeRemainingElement) {
            timeRemainingElement.textContent = '✓ Completed';
        }
        if (overdueIndicator) {
            overdueIndicator.style.display = 'none';
        }
        return;
    }
    
    if (timeDiff <= 0) {
        // Overdue
        isOverdue = true;
        const overdueMs = Math.abs(timeDiff);
        const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
        const overdueDays = Math.floor(overdueHours / 24);
        
        if (overdueDays > 0) {
            message = `⏰ Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
        } else if (overdueHours > 0) {
            message = `⏰ Overdue by ${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;
        } else {
            const overdueMinutes = Math.floor(overdueMs / (1000 * 60));
            message = `⏰ Overdue by ${overdueMinutes} minute${overdueMinutes > 1 ? 's' : ''}`;
        }
    } else {
        // Not overdue yet
        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
        const daysLeft = Math.floor(hoursLeft / 24);
        
        if (daysLeft > 0) {
            message = `📅 Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
        } else if (hoursLeft > 0) {
            message = `⏱️ Due in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
        } else {
            const minutesLeft = Math.floor(timeDiff / (1000 * 60));
            if (minutesLeft > 0) {
                message = `⏱️ Due in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
            } else {
                message = `⏰ Due very soon!`;
            }
        }
    }
    
    // Update the time remaining display
    if (timeRemainingElement) {
        timeRemainingElement.textContent = message;
    }
    
    // Show/hide overdue indicator and add visual styling
    if (overdueIndicator) {
        if (isOverdue) {
            overdueIndicator.style.display = 'inline-block';
            // Add red accent to the card
            todoCard.style.borderRight = '3px solid #f44336';
            todoCard.style.backgroundColor = '#ffebee';
        } else {
            overdueIndicator.style.display = 'none';
            // Remove red accent if not overdue
            if (todoCard.style.borderRight === '3px solid #f44336') {
                todoCard.style.borderRight = '';
            }
        }
    }
}

// Handle checkbox toggle (completion)
function handleCompleteToggle() {
    if (checkbox.checked) {
        // Task is completed
        todoCard.classList.add('completed');
        statusBadge.textContent = '✅ Done';
        statusBadge.style.backgroundColor = '#006747';
        statusBadge.style.color = 'white';

        // Add celebratory animation
        todoCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            todoCard.style.transform = 'scale(1)';
        }, 300);
    } else {
        // Task is not completed
        todoCard.classList.remove('completed');
        statusBadge.textContent = 'Pending';
        statusBadge.style.backgroundColor = 'var(--status)';
        statusBadge.style.color = 'var(--black)';
    }
}


// Status Control functionality
function handleStatusChange() {
    const statusSelect = document.querySelector('[data-testid="test-todo-status-control"]');
    const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
    const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
    const todoCard = document.querySelector('.todo-card');
    const todoTitle = document.querySelector('[data-testid="test-todo-title"]');

    const newStatus = statusSelect.value;

    // Update status badge
    statusBadge.textContent = newStatus;

    // Sync checkbox
    if (newStatus === 'Done') {
        checkbox.checked = true;
        // Add done styling
        todoCard.classList.add('completed');
        todoTitle.style.textDecoration = 'line-through';
        todoTitle.style.opacity = '0.7';
    } else {
        checkbox.checked = false;
        todoCard.classList.remove('completed');
        todoTitle.style.textDecoration = 'none';
        todoTitle.style.opacity = '1';
    }

    // Change styling based on status
    if (newStatus === 'In Progress') {
        todoCard.style.borderLeft = '4px solid #ff9800';
        todoCard.style.backgroundColor = '#fff8e1';
    } else if (newStatus === 'Pending') {
        todoCard.style.borderLeft = 'none';
        todoCard.style.backgroundColor = '';
    } else if (newStatus === 'Done') {
        todoCard.style.backgroundColor = '#e8f5e9';
    }
}

// Sync checkbox back to status dropdown
function handleCheckboxSync() {
    const statusSelect = document.querySelector('[data-testid="test-todo-status-control"]');
    const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');

    if (checkbox.checked) {
        statusSelect.value = 'Done';
        // Trigger the status change manually
        const event = new Event('change');
        statusSelect.dispatchEvent(event);
    } else {
        // Only change if it's currently Done
        if (statusSelect.value === 'Done') {
            statusSelect.value = 'Pending';
            const event = new Event('change');
            statusSelect.dispatchEvent(event);
        }
    }
}

// Handle Save button
function handleSave() {
    // 1. Get all the new values from edit form
    const newTitle = document.querySelector('[data-testid="test-todo-edit-title-input"]').value;
    const newDescription = document.querySelector('[data-testid="test-todo-edit-description-input"]').value;
    const newPriority = document.querySelector('[data-testid="test-todo-edit-priority-select"]').value;
    const newDueDate = document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value;

    // 2. Update the display with new values
    // Update title
    document.querySelector('[data-testid="test-todo-title"]').textContent = newTitle;

    // Update description
    document.querySelector('[data-testid="test-todo-description"]').textContent = newDescription;

    // Update priority (add "Priority" word back if your display shows it)
    document.querySelector('[data-testid="test-todo-priority"]').textContent = newPriority + ' Priority';

    // update priority dot
    const priorityDot = document.querySelector('[data-testid="test-todo-priority-indicator"]');
    if (priorityDot) {
        priorityDot.setAttribute('data-priority', newPriority);
    }


    // Update due date (convert from YYYY-MM-DD to readable format)
    const dueDateObj = new Date(newDueDate);
    const formattedDate = dueDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
    dueDateElement.textContent = formattedDate;
    dueDateElement.setAttribute('datetime', newDueDate);

    // 3. Hide edit form and show normal view
    const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
    const todoCard = document.querySelector('.todo-card');

    editForm.style.display = 'none';

    const children = todoCard.children;
    for (let child of children) {
        if (child !== editForm) {
            child.style.display = '';
        }
    }

    // 4. Update time remaining (bonus!)
    if (typeof updateTimeRemaining === 'function') {
        // Update your due date variable if you have one
        // Then call updateTimeRemaining()
    }

    // 5. Show success feedback (optional)
    const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✅ Saved!';
    setTimeout(() => {
        saveBtn.textContent = originalText;
    }, 1000);
}

// Handle Edit button
function handleEdit() {
    // Get the edit form and normal view
    const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
    const todoCard = document.querySelector('.todo-card');

    // Get current values to fill the form
    const currentTitle = document.querySelector('[data-testid="test-todo-title"]').textContent;
    const currentDesc = document.querySelector('[data-testid="test-todo-description"]').textContent;
    const currentPriority = document.querySelector('[data-testid="test-todo-priority"]').textContent;
    const currentDueDate = document.querySelector('[data-testid="test-todo-due-date"]').getAttribute('datetime');

    // Fill the edit form with current values
    document.querySelector('[data-testid="test-todo-edit-title-input"]').value = currentTitle;
    document.querySelector('[data-testid="test-todo-edit-description-input"]').value = currentDesc;

    // Set priority dropdown (remove "Priority" word if present)
    let priorityValue = currentPriority.replace(' Priority', '');
    document.querySelector('[data-testid="test-todo-edit-priority-select"]').value = priorityValue;

    // Set due date (convert from "April 15, 2026" to YYYY-MM-DD)
    const dueDateElement = document.querySelector('[data-testid="test-todo-due-date"]');
    const dueDateText = dueDateElement.textContent;
    // Simple conversion - you might need to adjust this
    const dateObj = new Date(dueDateText);
    const formattedDate = dateObj.toISOString().split('T')[0];
    document.querySelector('[data-testid="test-todo-edit-due-date-input"]').value = formattedDate;

    // HIDE all normal content
    const children = todoCard.children;
    for (let child of children) {
        if (child !== editForm) {
            child.style.display = 'none';
        }
    }

    // SHOW the edit form
    editForm.style.display = 'block';
}

// Handle Cancel button
function handleCancel() {
    const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
    const todoCard = document.querySelector('.todo-card');

    // HIDE the edit form
    editForm.style.display = 'none';

    // SHOW all normal content back
    const children = todoCard.children;
    for (let child of children) {
        if (child !== editForm) {
            child.style.display = '';  // Empty string restores default display
        }
    }
}

// Handle expand/collapse
function checkDescriptionLength() {
    const fullDescDiv = document.querySelector('[data-testid="test-todo-collapsible-section"]');
    const fullDescText = fullDescDiv?.querySelector('[data-testid="test-todo-description"]')?.textContent || '';
    const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');

    if (fullDescText.length > 100) {
        expandBtn.style.display = 'inline-block';
    } else {
        expandBtn.style.display = 'none';
    }
}

function toggleDescription() {
    const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
    const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
    const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        collapsibleSection.style.display = 'none';
        expandBtn.setAttribute('aria-expanded', 'false');
        expandBtn.textContent = 'Show More 🔽';
    } else {
        collapsibleSection.style.display = 'block';
        expandBtn.setAttribute('aria-expanded', 'true');
        expandBtn.textContent = 'Show Less 🔼';
    }
}

// Add event listener (put this with your other event listeners)
const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
if (expandBtn) {
    expandBtn.addEventListener('click', toggleDescription);
}



// Handle Delete button
function handleDelete() {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
        todoCard.style.opacity = '0';
        todoCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            todoCard.remove();
            // Show a message that task was deleted
            const container = document.querySelector('.page-container');
            const message = document.createElement('div');
            message.textContent = '🗑️ Task deleted successfully!';
            message.style.cssText = `
                background: #006747;
                color: white;
                padding: 12px 24px;
                border-radius: 12px;
                text-align: center;
                animation: fadeOut 2s forwards;
            `;
            container.appendChild(message);
            setTimeout(() => message.remove(), 2000);
        }, 300);
    }
}

// Add animation keyframes to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        70% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-20px); visibility: hidden; }
    }
`;
document.head.appendChild(style);

// Set up event listeners
if (checkbox) {
    checkbox.addEventListener('change', handleCompleteToggle);
}

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
if (editBtn) {
    editBtn.addEventListener('click', handleEdit);
}

const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDelete);
}

const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');
if (cancelBtn) {
    cancelBtn.addEventListener('click', handleCancel);
}

const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
if (saveBtn) {
    saveBtn.addEventListener('click', handleSave);
}

const statusSelect = document.querySelector('[data-testid="test-todo-status-control"]');
if (statusSelect) {
    statusSelect.addEventListener('change', handleStatusChange);
}

const currentStatus = statusBadge.textContent.trim();
if (statusSelect) {
    statusSelect.value = currentStatus;
}

// Initialize time remaining and update every 60 seconds
updateTimeRemaining();

// Call this after loading
checkDescriptionLength();

setInterval(updateTimeRemaining, 60000);