// Shared Utility Functions
// Common functions used across multiple calculators

/**
 * Safely escape HTML to prevent XSS
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Evaluate mathematical expression
 * Used by scientific calculator and others
 */
export function evaluateExpression(expr) {
    // Replace mathematical notation with JavaScript equivalents
    let processed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^2/g, '**2')
        .replace(/\^/g, '**')
        .replace(/pi/g, Math.PI)
        .replace(/e(?![0-9])/g, Math.E);
    
    // Handle functions
    processed = processed
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(');
    
    // Handle factorial
    if (processed.includes('!')) {
        processed = processed.replace(/(\d+(?:\.\d+)?)\!/g, (match, num) => {
            return factorial(parseFloat(num));
        });
    }
    
    // Handle percentage
    if (processed.includes('%')) {
        processed = processed.replace(/(\d+(?:\.\d+)?)%/g, (match, num) => {
            return parseFloat(num) / 100;
        });
    }
    
    // Evaluate using Function constructor (safer than eval)
    const result = new Function('return ' + processed)();
    return result;
}

/**
 * Calculate factorial of a number
 */
export function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // JavaScript limit
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Format number with commas
 */
export function formatNumber(num, decimals = 2) {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Save data to localStorage
 */
export function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Debounce function - delays execution until after wait period
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create a download link for file export
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Math constants
 */
export const MATH_CONSTANTS = {
    PI: Math.PI,
    E: Math.E,
    PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
    SQRT2: Math.SQRT2
};
