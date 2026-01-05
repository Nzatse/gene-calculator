// Calculator State
let currentInput = '0';
let lastAnswer = '0';
let history = [];

// DOM Elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('historyDisplay');
const historyList = document.getElementById('historyList');
const historyPanel = document.getElementById('historyPanel');

// Math Constants
const CONSTANTS = {
    'pi': Math.PI,
    'e': Math.E
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    updateDisplay();
    attachEventListeners();
    initializeTabs();
    loadFormulas();
});

// Tab Management
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    // Financial calculator mini tabs
    const miniTabs = document.querySelectorAll('.mini-tab');
    miniTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            miniTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const calcType = tab.dataset.calc;
            document.querySelectorAll('.financial-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(calcType + '-panel').classList.add('active');
        });
    });
}

// Event Listeners
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

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Input Handling
function handleInput(value) {
    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function handleFunction(func) {
    // Handle special cases
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
    historyDisplay.textContent = '';
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

// Calculation
function calculate() {
    try {
        const expression = currentInput;
        historyDisplay.textContent = expression;
        
        // Evaluate the expression
        const result = evaluateExpression(expression);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Round to prevent floating point errors
        const roundedResult = Math.round(result * 1e10) / 1e10;
        
        // Add to history
        addToHistory(expression, roundedResult);
        
        // Update state
        lastAnswer = String(roundedResult);
        currentInput = String(roundedResult);
        
        updateDisplay();
    } catch (error) {
        historyDisplay.textContent = 'Error';
        currentInput = '0';
        updateDisplay();
    }
}

function evaluateExpression(expr) {
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

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // JavaScript limit
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// History Management
function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(historyItem);
    
    // Limit history to 50 items
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

function loadHistory() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
        history = JSON.parse(saved);
        renderHistory();
    }
}

function clearHistory() {
    if (confirm('Clear all calculation history?')) {
        history = [];
        saveHistory();
        renderHistory();
    }
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No calculations yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="loadFromHistory('${item.expression}', '${item.result}')">
            <div class="history-expression">${escapeHtml(item.expression)}</div>
            <div class="history-result">= ${item.result}</div>
        </div>
    `).join('');
}

function loadFromHistory(expression, result) {
    currentInput = String(result);
    historyDisplay.textContent = expression;
    updateDisplay();
}

function toggleHistory() {
    historyPanel.classList.toggle('hidden');
}

// Display
function updateDisplay() {
    display.value = currentInput;
}

// ============================================
// KEYBOARD SUPPORT FOR SCIENTIFIC CALCULATOR
// ============================================
// This function handles keyboard shortcuts for the scientific calculator.
// IMPORTANT FIX: We only intercept keyboard events when:
// 1. The user is on the scientific calculator tab (not other tabs)
// 2. The user is NOT typing in any input field or textarea
// This prevents the keyboard handler from blocking normal typing in 
// Financial, Graphing, Programmable, and Printing calculator input fields.
function handleKeyboard(e) {
    // Check if scientific calculator tab is active
    // If user is on a different tab, let them type normally
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab || activeTab.id !== 'scientific-tab') {
        return; // Exit early - don't intercept keyboard on other tabs
    }
    
    // Check if user is typing in an input field or textarea
    // If so, let them type normally without interference
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Exit early - allow normal typing in input fields
    }
    
    // Only prevent default behavior if we're actually handling the key
    // Only prevent default behavior if we're actually handling the key
    e.preventDefault();
    
    // Handle numeric input (0-9)
    if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
    } 
    // Handle decimal point
    else if (e.key === '.') {
        handleInput('.');
    } 
    // Handle basic operators
    else if (e.key === '+') {
        handleInput('+');
    } else if (e.key === '-') {
        handleInput('-');
    } else if (e.key === '*') {
        handleInput('*');
    } else if (e.key === '/') {
        handleInput('/');
    } 
    // Handle parentheses for grouping
    else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
    } 
    // Handle calculation trigger (Enter or =)
    else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } 
    // Handle backspace to delete last character
    else if (e.key === 'Backspace') {
        backspace();
    } 
    // Handle clear (Escape or C key)
    else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clear();
    }
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// FINANCIAL CALCULATOR FUNCTIONS
// ============================================

function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
    const term = parseFloat(document.getElementById('loanTerm').value) * 12;
    
    if (!amount || !rate || !term) {
        document.getElementById('loanResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;
    
    document.getElementById('loanResult').innerHTML = `
        <h3>Loan Summary</h3>
        <p class="highlight">Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Total Payment: $${totalPayment.toFixed(2)}</p>
        <p>Total Interest: $${totalInterest.toFixed(2)}</p>
        <p>Principal: $${amount.toFixed(2)}</p>
    `;
}

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const rate = parseFloat(document.getElementById('mortgageRate').value) / 100 / 12;
    const term = parseFloat(document.getElementById('mortgageTerm').value) * 12;
    
    if (!homePrice || !downPayment || !rate || !term) {
        document.getElementById('mortgageResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const loanAmount = homePrice - downPayment;
    const monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('mortgageResult').innerHTML = `
        <h3>Mortgage Summary</h3>
        <p class="highlight">Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Loan Amount: $${loanAmount.toFixed(2)}</p>
        <p>Down Payment: $${downPayment.toFixed(2)} (${((downPayment/homePrice)*100).toFixed(1)}%)</p>
        <p>Total Payment: $${totalPayment.toFixed(2)}</p>
        <p>Total Interest: $${totalInterest.toFixed(2)}</p>
    `;
}

function calculateInvestment() {
    const initial = parseFloat(document.getElementById('initialInvestment').value);
    const monthly = parseFloat(document.getElementById('monthlyContribution').value);
    const rate = parseFloat(document.getElementById('returnRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('investmentYears').value);
    const months = years * 12;
    
    if (isNaN(initial) || isNaN(monthly) || !rate || !years) {
        document.getElementById('investmentResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    // Future value of initial investment
    const fvInitial = initial * Math.pow(1 + rate, months);
    
    // Future value of monthly contributions
    const fvMonthly = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    
    const totalValue = fvInitial + fvMonthly;
    const totalContributions = initial + (monthly * months);
    const totalEarnings = totalValue - totalContributions;
    
    document.getElementById('investmentResult').innerHTML = `
        <h3>Investment Projection</h3>
        <p class="highlight">Future Value: $${totalValue.toFixed(2)}</p>
        <p>Total Contributions: $${totalContributions.toFixed(2)}</p>
        <p>Total Earnings: $${totalEarnings.toFixed(2)}</p>
        <p>Return on Investment: ${((totalEarnings/totalContributions)*100).toFixed(1)}%</p>
    `;
}

function calculateSavings() {
    const initial = parseFloat(document.getElementById('initialDeposit').value);
    const monthly = parseFloat(document.getElementById('monthlyDeposit').value);
    const rate = parseFloat(document.getElementById('savingsRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('savingsYears').value);
    const months = years * 12;
    
    if (isNaN(initial) || isNaN(monthly) || !rate || !years) {
        document.getElementById('savingsResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const fvInitial = initial * Math.pow(1 + rate, months);
    const fvMonthly = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    
    const totalSavings = fvInitial + fvMonthly;
    const totalDeposits = initial + (monthly * months);
    const interestEarned = totalSavings - totalDeposits;
    
    document.getElementById('savingsResult').innerHTML = `
        <h3>Savings Summary</h3>
        <p class="highlight">Total Savings: $${totalSavings.toFixed(2)}</p>
        <p>Total Deposits: $${totalDeposits.toFixed(2)}</p>
        <p>Interest Earned: $${interestEarned.toFixed(2)}</p>
    `;
}

// ============================================
// GRAPHING CALCULATOR FUNCTIONS
// ============================================

function plotGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const funcStr = document.getElementById('graphFunction').value;
    
    if (!funcStr) {
        alert('Please enter a function');
        return;
    }
    
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
    
    // Plot function
    try {
        plotFunction(ctx, funcStr, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
    } catch (error) {
        alert('Error plotting function: ' + error.message);
    }
}

function drawAxes(ctx, width, height, xMin, xMax, yMin, yMax) {
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    
    // Calculate center position
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);
    const xZero = -xMin * xScale;
    const yZero = yMax * yScale;
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
        const x = xZero + i * xScale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
        const y = yZero - i * yScale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, height);
    ctx.stroke();
}

function plotFunction(ctx, funcStr, width, height, xMin, xMax, yMin, yMax) {
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);
    const xZero = -xMin * xScale;
    const yZero = yMax * yScale;
    
    // Prepare function
    let processedFunc = funcStr
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![0-9])/g, 'Math.E');
    
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    const step = (xMax - xMin) / width;
    
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const func = new Function('x', 'return ' + processedFunc);
            const y = func(x);
            
            if (isFinite(y) && y >= yMin && y <= yMax) {
                const canvasX = xZero + x * xScale;
                const canvasY = yZero - y * yScale;
                
                if (firstPoint) {
                    ctx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } else {
                firstPoint = true;
            }
        } catch (e) {
            firstPoint = true;
        }
    }
    
    ctx.stroke();
}

function clearGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
}

// ============================================
// PROGRAMMABLE CALCULATOR FUNCTIONS
// ============================================

let savedFormulas = [];

function loadFormulas() {
    const saved = localStorage.getItem('savedFormulas');
    if (saved) {
        savedFormulas = JSON.parse(saved);
        renderFormulas();
    }
}

function saveFormula() {
    const name = document.getElementById('formulaName').value.trim();
    const varsStr = document.getElementById('formulaVars').value.trim();
    const expression = document.getElementById('formulaExpression').value.trim();
    
    if (!name || !varsStr || !expression) {
        alert('Please fill all fields');
        return;
    }
    
    const vars = varsStr.split(',').map(v => v.trim());
    
    const formula = {
        name: name,
        variables: vars,
        expression: expression,
        timestamp: new Date().toISOString()
    };
    
    savedFormulas.unshift(formula);
    localStorage.setItem('savedFormulas', JSON.stringify(savedFormulas));
    
    // Clear inputs
    document.getElementById('formulaName').value = '';
    document.getElementById('formulaVars').value = '';
    document.getElementById('formulaExpression').value = '';
    
    renderFormulas();
    alert('Formula saved successfully!');
}

function renderFormulas() {
    const list = document.getElementById('formulasList');
    
    if (savedFormulas.length === 0) {
        list.innerHTML = '<p class="empty-history">No formulas saved yet</p>';
        return;
    }
    
    list.innerHTML = savedFormulas.map((formula, index) => `
        <div class="formula-item" onclick="loadFormula(${index})">
            <div class="formula-name">${escapeHtml(formula.name)}</div>
            <div class="formula-expression">Vars: ${formula.variables.join(', ')}</div>
            <div class="formula-expression">${escapeHtml(formula.expression)}</div>
        </div>
    `).join('');
}

function loadFormula(index) {
    const formula = savedFormulas[index];
    const inputsDiv = document.getElementById('formulaInputs');
    
    inputsDiv.innerHTML = '<h4>' + escapeHtml(formula.name) + '</h4>';
    
    formula.variables.forEach(varName => {
        inputsDiv.innerHTML += `
            <div class="form-group">
                <label>${escapeHtml(varName)}</label>
                <input type="number" id="var_${varName}" step="any">
            </div>
        `;
    });
    
    document.getElementById('executeBtn').style.display = 'block';
    document.getElementById('executeBtn').dataset.formulaIndex = index;
}

function executeFormula() {
    const index = document.getElementById('executeBtn').dataset.formulaIndex;
    const formula = savedFormulas[index];
    
    let expression = formula.expression;
    
    // Replace variables with values
    for (const varName of formula.variables) {
        const value = parseFloat(document.getElementById('var_' + varName).value);
        if (isNaN(value)) {
            alert('Please enter a value for ' + varName);
            return;
        }
        expression = expression.replace(new RegExp(varName, 'g'), value);
    }
    
    try {
        const result = evaluateExpression(expression);
        
        document.getElementById('programResult').innerHTML = `
            <h3>Result</h3>
            <p class="highlight">${result}</p>
            <p>Expression: ${escapeHtml(expression)}</p>
        `;
    } catch (error) {
        document.getElementById('programResult').innerHTML = `
            <p style="color: red;">Error: ${error.message}</p>
        `;
    }
}

function clearFormulas() {
    if (confirm('Clear all saved formulas?')) {
        savedFormulas = [];
        localStorage.setItem('savedFormulas', JSON.stringify(savedFormulas));
        renderFormulas();
        document.getElementById('formulaInputs').innerHTML = '';
        document.getElementById('executeBtn').style.display = 'none';
        document.getElementById('programResult').innerHTML = '';
    }
}

// ============================================
// PRINTING CALCULATOR FUNCTIONS
// ============================================

let printCurrentInput = '0';
let printCurrentOperator = null;
let printPreviousValue = null;
let printTape = [];
let printRunningTotal = 0;

function printInput(value) {
    const display = document.getElementById('printDisplay');
    if (printCurrentInput === '0') {
        printCurrentInput = value;
    } else {
        printCurrentInput += value;
    }
    display.value = printCurrentInput;
}

function printOperator(op) {
    if (printCurrentOperator && printPreviousValue !== null) {
        printCalculate();
    }
    
    printPreviousValue = parseFloat(printCurrentInput);
    printCurrentOperator = op;
    printCurrentInput = '0';
    
    addToTape(printPreviousValue, op);
}

function printCalculate() {
    if (printCurrentOperator === null || printPreviousValue === null) return;
    
    const current = parseFloat(printCurrentInput);
    let result = 0;
    
    switch (printCurrentOperator) {
        case '+':
            result = printPreviousValue + current;
            printRunningTotal += printPreviousValue;
            break;
        case '-':
            result = printPreviousValue - current;
            printRunningTotal -= printPreviousValue;
            break;
        case '*':
            result = printPreviousValue * current;
            break;
        case '/':
            result = printPreviousValue / current;
            break;
    }
    
    addToTape(current, '=');
    addToTape(result, null, true);
    
    printCurrentInput = String(result);
    document.getElementById('printDisplay').value = printCurrentInput;
    printCurrentOperator = null;
    printPreviousValue = null;
    
    updateTapeTotal();
}

function printClear() {
    printCurrentInput = '0';
    printCurrentOperator = null;
    printPreviousValue = null;
    document.getElementById('printDisplay').value = '0';
}

function printClearTape() {
    if (confirm('Clear calculation tape?')) {
        printTape = [];
        printRunningTotal = 0;
        renderTape();
        updateTapeTotal();
    }
}

function addToTape(value, operator, isResult = false) {
    const entry = {
        value: value,
        operator: operator,
        isResult: isResult,
        timestamp: new Date().toLocaleTimeString()
    };
    
    printTape.push(entry);
    renderTape();
}

function renderTape() {
    const tapeList = document.getElementById('tapeList');
    
    if (printTape.length === 0) {
        tapeList.innerHTML = '<p class="empty-history">No calculations yet</p>';
        return;
    }
    
    tapeList.innerHTML = printTape.map(entry => {
        const className = entry.isResult ? 'tape-entry total' : 'tape-entry';
        const opDisplay = entry.operator ? ' ' + entry.operator : '';
        return `
            <div class="${className}">
                <span>${entry.timestamp}</span>
                <span>${entry.value.toFixed(2)}${opDisplay}</span>
            </div>
        `;
    }).join('');
    
    tapeList.scrollTop = tapeList.scrollHeight;
}

function updateTapeTotal() {
    const total = printTape
        .filter(e => e.isResult)
        .reduce((sum, e) => sum + e.value, 0);
    
    document.getElementById('tapeTotal').textContent = `Total: $${total.toFixed(2)}`;
}

function exportTape() {
    if (printTape.length === 0) {
        alert('No calculations to export');
        return;
    }
    
    let content = 'CALCULATION TAPE\n';
    content += '================\n\n';
    
    printTape.forEach(entry => {
        const op = entry.operator ? ' ' + entry.operator : '';
        const marker = entry.isResult ? '= ' : '  ';
        content += `${entry.timestamp}  ${marker}${entry.value.toFixed(2)}${op}\n`;
    });
    
    content += '\n================\n';
    content += `GRAND TOTAL: $${printTape.filter(e => e.isResult).reduce((sum, e) => sum + e.value, 0).toFixed(2)}\n`;
    
    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculation-tape-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
