// Character sets
const uCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lCase = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbol = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// DOM elements
const pLength = document.getElementById('plength');
const lengthDisplay = document.getElementById('lengthDisplay');
const upperCase = document.getElementById('puppercase');
const lowerCase = document.getElementById('plowercase');
const pNumber = document.getElementById('pnumber');
const pSymbol = document.getElementById('psymbol');
const submit = document.getElementById('submit');
const password = document.getElementById('pwd');
const copyBtn = document.getElementById('copy');
const copyFeedback = document.getElementById('pwdcopy');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const strengthIndicator = document.getElementById('strengthIndicator');
const strengthText = strengthIndicator.querySelector('.strength-text');

// Update length display
pLength.addEventListener('input', () => {
    lengthDisplay.textContent = pLength.value;
});

// Theme toggle functionality
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-mode';
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.className = newTheme + '-mode';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// Update option item styling
function updateOptionItem(checkbox, labelId, itemElement) {
    if (checkbox.checked) {
        itemElement.classList.add('active');
        document.getElementById(labelId).style.color = '';
    } else {
        itemElement.classList.remove('active');
        document.getElementById(labelId).style.color = '';
    }
}

// Add event listeners for checkboxes
const optionItems = document.querySelectorAll('.option-item');
upperCase.addEventListener('change', () => updateOptionItem(upperCase, 'uppertxt', optionItems[0]));
lowerCase.addEventListener('change', () => updateOptionItem(lowerCase, 'lowertxt', optionItems[1]));
pNumber.addEventListener('change', () => updateOptionItem(pNumber, 'numtxt', optionItems[2]));
pSymbol.addEventListener('change', () => updateOptionItem(pSymbol, 'spltxt', optionItems[3]));

// Initialize option items
updateOptionItem(upperCase, 'uppertxt', optionItems[0]);
updateOptionItem(lowerCase, 'lowertxt', optionItems[1]);
updateOptionItem(pNumber, 'numtxt', optionItems[2]);
updateOptionItem(pSymbol, 'spltxt', optionItems[3]);

// Improved password generation function
function generatePassword(length, includeUpper, includeLower, includeNumber, includeSymbol) {
    // Build character pool
    let charPool = '';
    const requiredChars = [];

    if (includeUpper) {
        charPool += uCase;
        requiredChars.push(uCase);
    }
    if (includeLower) {
        charPool += lCase;
        requiredChars.push(lCase);
    }
    if (includeNumber) {
        charPool += number;
        requiredChars.push(number);
    }
    if (includeSymbol) {
        charPool += symbol;
        requiredChars.push(symbol);
    }

    // Check if at least one option is selected
    if (charPool === '') {
        return '';
    }

    // Generate password ensuring at least one character from each selected category
    let password = '';

    // First, add one character from each selected category
    requiredChars.forEach(charSet => {
        const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
        password += randomChar;
    });

    // Fill the rest with random characters from the pool
    for (let i = password.length; i < length; i++) {
        password += charPool[Math.floor(Math.random() * charPool.length)];
    }

    // Shuffle the password to avoid predictable patterns
    return shuffleString(password);
}

// Fisher-Yates shuffle algorithm
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// Calculate password strength
function calculateStrength(pwd) {
    if (!pwd) return { level: 'none', text: 'Password strength will appear here' };

    let strength = 0;
    const length = pwd.length;

    // Length scoring
    if (length >= 12) strength += 2;
    else if (length >= 8) strength += 1;

    // Character variety scoring
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    // Determine strength level
    if (strength <= 2) {
        return { level: 'weak', text: 'Weak password - consider adding more characters and types' };
    } else if (strength <= 4) {
        return { level: 'medium', text: 'Medium strength - good, but could be stronger' };
    } else {
        return { level: 'strong', text: 'Strong password - excellent security!' };
    }
}

// Update strength indicator
function updateStrengthIndicator(pwd) {
    const strength = calculateStrength(pwd);
    strengthIndicator.className = 'strength-indicator ' + strength.level;
    strengthText.textContent = strength.text;
}

// Generate password on button click
submit.addEventListener('click', () => {
    const length = parseInt(pLength.value);
    const includeUpper = upperCase.checked;
    const includeLower = lowerCase.checked;
    const includeNumber = pNumber.checked;
    const includeSymbol = pSymbol.checked;

    // Validate that at least one option is selected
    if (!includeUpper && !includeLower && !includeNumber && !includeSymbol) {
        alert('Please select at least one character type!');
        return;
    }

    // Validate length
    if (length < 4 || length > 50) {
        alert('Password length must be between 4 and 50 characters!');
        return;
    }

    const generatedPassword = generatePassword(
        length,
        includeUpper,
        includeLower,
        includeNumber,
        includeSymbol
    );

    password.value = generatedPassword;
    updateStrengthIndicator(generatedPassword);

    // Enable the input field
    password.disabled = false;
});

// Copy password to clipboard
copyBtn.addEventListener('click', async () => {
    if (!password.value) {
        alert('Please generate a password first!');
        return;
    }

    try {
        // Use modern Clipboard API
        await navigator.clipboard.writeText(password.value);

        // Show feedback
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 3000);

        // Visual feedback on button
        copyBtn.style.transform = 'translateY(-50%) scale(0.95)';
        setTimeout(() => {
            copyBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    } catch (err) {
        // Fallback for older browsers
        password.select();
        document.execCommand('copy');
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 3000);
    }
});

// Generate password on Enter key in length input
pLength.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submit.click();
    }
});

// Initialize strength indicator
updateStrengthIndicator('');
