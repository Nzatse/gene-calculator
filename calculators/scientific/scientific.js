// Scientific Calculator Module
import { evaluateExpression, escapeHtml, saveToStorage, loadFromStorage } from '../../js/utils.js';

let currentInput = '0';
let lastAnswer = '0';
let history = [];

export async function render(container) {
    // Load history from storage
    history = loadFromStorage('scientificHistory', []);
    
    container.innerHTML = `
        <div class="calculator-wrapper">
            <div class="calculator">
                <div class="display">
                    <div class="history-display" id="historyDisplay"></div>
                    <input type="text" id="display" readonly value="0">
                </div>
                
                <div class="buttons">
                    <!-- Row 1: Functions -->
                    <button class="btn function" data-value="sin(">sin</button>
                    <button class="btn function" data-value="cos(">cos</button>
                    <button class="btn function" data-value="tan(">tan</button>
                    <button class="btn function" data-value="log(">log</button>
                    <button class="btn function" data-value="ln(">ln</button>
                    
                    <!-- Row 2: Functions -->
                    <button class="btn function" data-value="sqrt(">√</button>
                    <button class="btn function" data-value="^">x^y</button>
                    <button class="btn function" data-value="^2">x²</button>
                    <button class="btn function" data-value="abs(">|x|</button>
                    <button class="btn function" data-value="!">x!</button>
                    
                    <!-- Row 3: Functions & Clear -->
                    <button class="btn function" data-value="(">(</button>
                    <button class="btn function" data-value=")">)</button>
                    <button class="btn function" data-value="%">%</button>
                    <button class="btn clear" id="clearBtn">C</button>
                    <button class="btn clear" id="backspaceBtn">⌫</button>
                    
                    <!-- Row 4: Numbers -->
                    <button class="btn number" data-value="7">7</button>
                    <button class="btn number" data-value="8">8</button>
                    <button class="btn number" data-value="9">9</button>
                    <button class="btn operator" data-value="/">÷</button>
                    <button class="btn function" data-value="e">e</button>
                    
                    <!-- Row 5: Numbers -->
                    <button class="btn number" data-value="4">4</button>
                    <button class="btn number" data-value="5">5</button>
                    <button class="btn number" data-value="6">6</button>
                    <button class="btn operator" data-value="*">×</button>
                    <button class="btn function" data-value="pi">π</button>
                    
                    <!-- Row 6: Numbers -->
                    <button class="btn number" data-value="1">1</button>
                    <button class="btn number" data-value="2">2</button>
                    <button class="btn number" data-value="3">3</button>
                    <button class="btn operator" data-value="-">−</button>
                    <button class="btn function" id="historyBtn">📜</button>
                    
                    <!-- Row 7: Numbers -->
                    <button class="btn number" data-value="0">0</button>
                    <button class="btn number" data-value=".">.</button>
                    <button class="btn equals" id="equalsBtn">=</button>
                    <button class="btn operator" data-value="+">+</button>
                    <button class="btn function" id="ansBtn">ANS</button>
                </div>
            </div>

            <div class="history-panel" id="historyPanel">
                <div class="history-header">
                    <h2>History</h2>
                    <button class="btn clear small" id="clearHistoryBtn">Clear All</button>
                </div>
                <div class="history-list" id="historyList">
                    <p class="empty-history">No calculations yet</p>
                </div>
            </div>
        </div>
    `;
    
    // Initialize
    updateDisplay();
    renderHistory();
    attachEventListeners();
}

function attachEventListeners() {
    // Number and operator buttons
    document.querySelectorAll('.btn.number, .btn.operator').forEach(btn => {
        btn.addEventListener('click', () => handleInput(btn.dataset.value));
    });

    // Function buttons
    document.querySelectorAll('.btn.function').forEach(btn => {
        if (btn.dataset.value) {
            btn.addEventListener('click', () => handleFunction(btn.dataset.value));
        }
    });

    // Special buttons
    document.getElementById('equalsBtn').addEventListener('click', calculate);
    document.getElementById('clearBtn').addEventListener('click', clear);
    document.getElementById('backspaceBtn').addEventListener('click', backspace);
    document.getElementById('ansBtn').addEventListener('click', insertAnswer);
    document.getElementById('historyBtn').addEventListener('click', toggleHistory);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
}

function handleInput(value) {
    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function handleFunction(func) {
    if (func === '^2') {
        currentInput += '^2';
    } else if (func === 'pi') {
        currentInput = currentInput === '0' ? String(Math.PI) : currentInput + Math.PI;
    } else if (func === 'e') {
        currentInput = currentInput === '0' ? String(Math.E) : currentInput + Math.E;
    } else if (func === '!') {
        currentInput += '!';
    } else {
        currentInput = currentInput === '0' ? func : currentInput + func;
    }
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function clear() {
    currentInput = '0';
    document.getElementById('historyDisplay').textContent = '';
    updateDisplay();
}

function insertAnswer() {
    if (currentInput === '0') {
        currentInput = lastAnswer;
    } else {
        currentInput += lastAnswer;
    }
    updateDisplay();
}

function calculate() {
    try {
        const expression = currentInput;
        document.getElementById('historyDisplay').textContent = expression;
        
        const result = evaluateExpression(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        const roundedResult = Math.round(result * 1e10) / 1e10;
        
        addToHistory(expression, roundedResult);
        
        lastAnswer = String(roundedResult);
        currentInput = String(roundedResult);
        
        updateDisplay();
    } catch (error) {
        document.getElementById('historyDisplay').textContent = 'Error';
        currentInput = '0';
        updateDisplay();
    }
}

function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(historyItem);
    
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    saveToStorage('scientificHistory', history);
    renderHistory();
}

function clearHistory() {
    if (confirm('Clear all calculation history?')) {
        history = [];
        saveToStorage('scientificHistory', history);
        renderHistory();
    }
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No calculations yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="window.scientificLoadFromHistory('${item.expression}', '${item.result}')">
            <div class="history-expression">${escapeHtml(item.expression)}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function loadFromHistory(expression, result) {
    currentInput = String(result);
    document.getElementById('historyDisplay').textContent = expression;
    updateDisplay();
}

// Expose to global for onclick handlers
window.scientificLoadFromHistory = loadFromHistory;

function toggleHistory() {
    document.getElementById('historyPanel').classList.toggle('hidden');
}

function updateDisplay() {
    document.getElementById('display').value = currentInput;
}

export function cleanup() {
    // Clean up event listeners if needed
    window.scientificLoadFromHistory = null;
}
