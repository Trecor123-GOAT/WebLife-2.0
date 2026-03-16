// Utility functions for the game

// Generate random number between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random float between min and max
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Capitalize first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format money with commas
function formatMoney(amount) {
    return '$' + amount.toLocaleString();
}

// Save game data to browser storage
function saveGame(gameData) {
    localStorage.setItem('weblife_save', JSON.stringify(gameData));
    console.log('Game saved!');
}

// Load game data from browser storage
function loadGame() {
    const savedData = localStorage.getItem('weblife_save');
    if (savedData) {
        console.log('Game loaded!');
        return JSON.parse(savedData);
    }
    return null;
}

// Delete saved game
function deleteSave() {
    localStorage.removeItem('weblife_save');
    console.log('Save deleted!');
}

// Check if there's a saved game
function hasSavedGame() {
    return localStorage.getItem('weblife_save') !== null;
}

// Create a simple unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Show a notification/alert message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 2000;
        animation: slideIn 0.3s ease-in;
    `;
    
    if (type === 'success') {
        notification.style.background = '#51cf66';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.background = '#ffd43b';
        notification.style.color = '#333';
    } else if (type === 'error') {
        notification.style.background = '#ff6b6b';
        notification.style.color = 'white';
    } else {
        notification.style.background = '#667eea';
        notification.style.color = 'white';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth transition between screens
function switchScreen(fromElement, toElement) {
    if (fromElement) {
        fromElement.classList.remove('active');
    }
    toElement.classList.add('active');
}
