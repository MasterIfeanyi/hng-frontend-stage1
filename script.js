// Treasure Map: Making the Todo Card Come Alive!

// Get all our treasure elements
const todoCard = document.querySelector('.todo-card');
const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const todoTitle = document.querySelector('.todo-title');
const timeRemainingElement = document.querySelector('[data-testid="test-todo-time-remaining"]');

// Set the due date (April 15, 2026 at 6:00 PM)
const dueDate = new Date(2026, 3, 15, 18, 0, 0); // Month is 0-indexed, so 3 = April

// Function to calculate and update time remaining
function updateTimeRemaining() {
    const now = new Date();
    const timeDiff = dueDate - now;
    
    let message = '';
    
    if (timeDiff <= 0) {
        // Overdue
        const overdueMs = Math.abs(timeDiff);
        const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
        const overdueDays = Math.floor(overdueHours / 24);
        
        if (overdueDays > 0) {
            message = `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
        } else if (overdueHours > 0) {
            message = `Overdue by ${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;
        } else {
            message = `Overdue now!`;
        }
    } else {
        // Not overdue yet
        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
        const daysLeft = Math.floor(hoursLeft / 24);
        
        if (daysLeft > 0) {
            message = `📅 Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
        } else if (hoursLeft > 0) {
            message = `Due in ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`;
        } else {
            const minutesLeft = Math.floor(timeDiff / (1000 * 60));
            if (minutesLeft > 0) {
                message = ` Due in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}!`;
            } else {
                message = ` Due now!`;
            }
        }
    }
    
    if (timeRemainingElement) {
        timeRemainingElement.textContent = message;
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

// Handle Edit button
function handleEdit() {
    const newTitle = prompt('Edit task title:', todoTitle.textContent);
    if (newTitle && newTitle.trim()) {
        todoTitle.textContent = newTitle.trim();
        
        // Show a temporary success message
        const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
        const originalText = editBtn.textContent;
        editBtn.textContent = '✅ Saved!';
        setTimeout(() => {
            editBtn.textContent = originalText;
        }, 1500);
    }
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

// Initialize time remaining and update every 60 seconds
updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);
