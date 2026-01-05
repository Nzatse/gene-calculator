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

// ============================================
// UNIT CONVERTER FUNCTIONS
// ============================================

// Currency exchange rates (approximate - in production, use API)
const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CNY: 7.24,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.88,
    INR: 83.12
};

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    
    if (!amount) {
        document.getElementById('currencyResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / currencyRates[from];
    const result = amountInUSD * currencyRates[to];
    
    document.getElementById('currencyResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}</p>
        <p>Exchange Rate: 1 ${from} = ${(currencyRates[to] / currencyRates[from]).toFixed(4)} ${to}</p>
        <p style="font-size: 12px; color: #718096; margin-top: 10px;">
            Note: Rates are approximate. For accurate rates, use a real-time currency API.
        </p>
    `;
}

// Length conversion factors (to meters)
const lengthFactors = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254
};

function convertLength() {
    const value = parseFloat(document.getElementById('lengthValue').value);
    const from = document.getElementById('lengthFrom').value;
    const to = document.getElementById('lengthTo').value;
    
    if (!value) {
        document.getElementById('lengthResult').innerHTML = '<p style="color: red;">Please enter a value</p>';
        return;
    }
    
    const meters = value * lengthFactors[from];
    const result = meters / lengthFactors[to];
    
    document.getElementById('lengthResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${value} ${from} = ${result.toFixed(4)} ${to}</p>
    `;
}

// Weight conversion factors (to kilograms)
const weightFactors = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000
};

function convertWeight() {
    const value = parseFloat(document.getElementById('weightValue').value);
    const from = document.getElementById('weightFrom').value;
    const to = document.getElementById('weightTo').value;
    
    if (!value) {
        document.getElementById('weightResult').innerHTML = '<p style="color: red;">Please enter a value</p>';
        return;
    }
    
    const kg = value * weightFactors[from];
    const result = kg / weightFactors[to];
    
    document.getElementById('weightResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${value} ${from} = ${result.toFixed(4)} ${to}</p>
    `;
}

function convertTemperature() {
    const value = parseFloat(document.getElementById('tempValue').value);
    const from = document.getElementById('tempFrom').value;
    const to = document.getElementById('tempTo').value;
    
    if (isNaN(value)) {
        document.getElementById('tempResult').innerHTML = '<p style="color: red;">Please enter a value</p>';
        return;
    }
    
    let celsius;
    
    // Convert to Celsius first
    if (from === 'C') celsius = value;
    else if (from === 'F') celsius = (value - 32) * 5/9;
    else if (from === 'K') celsius = value - 273.15;
    
    // Convert from Celsius to target
    let result;
    if (to === 'C') result = celsius;
    else if (to === 'F') result = (celsius * 9/5) + 32;
    else if (to === 'K') result = celsius + 273.15;
    
    document.getElementById('tempResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${value}°${from} = ${result.toFixed(2)}°${to}</p>
    `;
}

// Volume conversion factors (to liters)
const volumeFactors = {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    cup: 0.236588,
    floz: 0.0295735
};

function convertVolume() {
    const value = parseFloat(document.getElementById('volumeValue').value);
    const from = document.getElementById('volumeFrom').value;
    const to = document.getElementById('volumeTo').value;
    
    if (!value) {
        document.getElementById('volumeResult').innerHTML = '<p style="color: red;">Please enter a value</p>';
        return;
    }
    
    const liters = value * volumeFactors[from];
    const result = liters / volumeFactors[to];
    
    document.getElementById('volumeResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${value} ${from} = ${result.toFixed(4)} ${to}</p>
    `;
}

// ============================================
// STATISTICS CALCULATOR FUNCTIONS
// ============================================

function calculateStatistics() {
    const input = document.getElementById('statsData').value;
    const numbers = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        document.getElementById('statsResult').innerHTML = '<p style="color: red;">Please enter valid numbers</p>';
        return;
    }
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    
    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    
    // Mode
    const frequency = {};
    let maxFreq = 0;
    numbers.forEach(n => {
        frequency[n] = (frequency[n] || 0) + 1;
        maxFreq = Math.max(maxFreq, frequency[n]);
    });
    const modes = Object.keys(frequency).filter(k => frequency[k] === maxFreq);
    const mode = maxFreq > 1 ? modes.join(', ') : 'No mode';
    
    // Standard Deviation
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    // Range
    const range = sorted[sorted.length - 1] - sorted[0];
    
    document.getElementById('statsResult').innerHTML = `
        <h3>Statistical Analysis</h3>
        <p><strong>Count:</strong> ${numbers.length}</p>
        <p><strong>Sum:</strong> ${sum.toFixed(4)}</p>
        <p class="highlight">Mean: ${mean.toFixed(4)}</p>
        <p><strong>Median:</strong> ${median.toFixed(4)}</p>
        <p><strong>Mode:</strong> ${mode}</p>
        <p><strong>Std Deviation:</strong> ${stdDev.toFixed(4)}</p>
        <p><strong>Variance:</strong> ${variance.toFixed(4)}</p>
        <p><strong>Range:</strong> ${range.toFixed(4)}</p>
        <p><strong>Min:</strong> ${sorted[0]}</p>
        <p><strong>Max:</strong> ${sorted[sorted.length - 1]}</p>
    `;
}

// ============================================
// BASE CONVERTER FUNCTIONS
// ============================================

function convertBase() {
    const decimal = document.getElementById('decimal').value;
    const binary = document.getElementById('binary').value;
    const octal = document.getElementById('octal').value;
    const hex = document.getElementById('hexadecimal').value;
    
    let decValue;
    
    // Determine which field has input
    if (decimal) {
        decValue = parseInt(decimal, 10);
    } else if (binary) {
        decValue = parseInt(binary, 2);
    } else if (octal) {
        decValue = parseInt(octal, 8);
    } else if (hex) {
        decValue = parseInt(hex, 16);
    } else {
        alert('Please enter a value in any field');
        return;
    }
    
    if (isNaN(decValue)) {
        alert('Invalid input');
        return;
    }
    
    // Convert to all bases
    document.getElementById('decimal').value = decValue.toString(10);
    document.getElementById('binary').value = decValue.toString(2);
    document.getElementById('octal').value = decValue.toString(8);
    document.getElementById('hexadecimal').value = decValue.toString(16).toUpperCase();
}

// ============================================
// MATRIX CALCULATOR FUNCTIONS
// ============================================

function parseMatrix(str) {
    return str.trim().split(';').map(row => 
        row.split(',').map(val => parseFloat(val.trim()))
    );
}

function matrixToString(matrix) {
    return matrix.map(row => row.map(n => n.toFixed(2)).join('  ')).join('<br>');
}

function matrixAdd() {
    try {
        const a = parseMatrix(document.getElementById('matrixA1').value);
        const b = parseMatrix(document.getElementById('matrixB1').value);
        
        if (a.length !== b.length || a[0].length !== b[0].length) {
            throw new Error('Matrices must have same dimensions');
        }
        
        const result = a.map((row, i) => row.map((val, j) => val + b[i][j]));
        
        document.getElementById('matrixAddResult').innerHTML = `
            <h3>Result (A + B)</h3>
            <p style="font-family: monospace; line-height: 1.8;">${matrixToString(result)}</p>
        `;
    } catch (error) {
        document.getElementById('matrixAddResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function matrixSubtract() {
    try {
        const a = parseMatrix(document.getElementById('matrixA1').value);
        const b = parseMatrix(document.getElementById('matrixB1').value);
        
        if (a.length !== b.length || a[0].length !== b[0].length) {
            throw new Error('Matrices must have same dimensions');
        }
        
        const result = a.map((row, i) => row.map((val, j) => val - b[i][j]));
        
        document.getElementById('matrixAddResult').innerHTML = `
            <h3>Result (A - B)</h3>
            <p style="font-family: monospace; line-height: 1.8;">${matrixToString(result)}</p>
        `;
    } catch (error) {
        document.getElementById('matrixAddResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function matrixMultiply() {
    try {
        const a = parseMatrix(document.getElementById('matrixA2').value);
        const b = parseMatrix(document.getElementById('matrixB2').value);
        
        if (a[0].length !== b.length) {
            throw new Error('Matrix A columns must equal Matrix B rows');
        }
        
        const result = [];
        for (let i = 0; i < a.length; i++) {
            result[i] = [];
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        
        document.getElementById('matrixMultResult').innerHTML = `
            <h3>Result (A × B)</h3>
            <p style="font-family: monospace; line-height: 1.8;">${matrixToString(result)}</p>
        `;
    } catch (error) {
        document.getElementById('matrixMultResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function matrixDeterminant() {
    try {
        const matrix = parseMatrix(document.getElementById('matrixDet').value);
        
        if (matrix.length !== matrix[0].length) {
            throw new Error('Matrix must be square');
        }
        
        let det;
        if (matrix.length === 2) {
            det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (matrix.length === 3) {
            det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                  matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                  matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        } else {
            throw new Error('Only 2×2 and 3×3 matrices supported');
        }
        
        document.getElementById('matrixDetResult').innerHTML = `
            <h3>Determinant</h3>
            <p class="highlight">${det.toFixed(4)}</p>
        `;
    } catch (error) {
        document.getElementById('matrixDetResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

function matrixTranspose() {
    try {
        const matrix = parseMatrix(document.getElementById('matrixTrans').value);
        const result = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
        
        document.getElementById('matrixTransResult').innerHTML = `
            <h3>Transposed Matrix</h3>
            <p style="font-family: monospace; line-height: 1.8;">${matrixToString(result)}</p>
        `;
    } catch (error) {
        document.getElementById('matrixTransResult').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
}

// ============================================
// DATE/TIME CALCULATOR FUNCTIONS
// ============================================

function calculateDateDifference() {
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);
    
    if (!document.getElementById('startDate').value || !document.getElementById('endDate').value) {
        document.getElementById('dateDiffResult').innerHTML = '<p style="color: red;">Please select both dates</p>';
        return;
    }
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffDays / 365.25);
    
    document.getElementById('dateDiffResult').innerHTML = `
        <h3>Date Difference</h3>
        <p class="highlight">${diffDays} days</p>
        <p>${diffWeeks} weeks</p>
        <p>${diffMonths} months (approx)</p>
        <p>${diffYears} years (approx)</p>
        <p>${(diffDays / 7).toFixed(2)} weeks (exact)</p>
        <p>${(diffTime / (1000 * 60 * 60)).toFixed(0)} hours</p>
    `;
}

function addSubtractDays() {
    const base = new Date(document.getElementById('baseDate').value);
    const days = parseInt(document.getElementById('daysToAdd').value);
    
    if (!document.getElementById('baseDate').value || isNaN(days)) {
        document.getElementById('dateAddResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    document.getElementById('dateAddResult').innerHTML = `
        <h3>Result</h3>
        <p class="highlight">${result.toLocaleDateString('en-US', options)}</p>
        <p>ISO Format: ${result.toISOString().split('T')[0]}</p>
    `;
}

function calculateAge() {
    const birth = new Date(document.getElementById('birthDate').value);
    
    if (!document.getElementById('birthDate').value) {
        document.getElementById('ageResult').innerHTML = '<p style="color: red;">Please select your birth date</p>';
        return;
    }
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    
    document.getElementById('ageResult').innerHTML = `
        <h3>Your Age</h3>
        <p class="highlight">${age} years old</p>
        <p>You've lived ${totalDays.toLocaleString()} days</p>
        <p>Next birthday in ${daysUntilBirthday} days</p>
        <p>Birth date: ${birth.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    `;
}

// ============================================
// GEOMETRY CALCULATOR FUNCTIONS
// ============================================

function calculateCircle() {
    const r = parseFloat(document.getElementById('circleRadius').value);
    
    if (!r || r <= 0) {
        document.getElementById('circleResult').innerHTML = '<p style="color: red;">Please enter a valid radius</p>';
        return;
    }
    
    const area = Math.PI * r * r;
    const circumference = 2 * Math.PI * r;
    
    document.getElementById('circleResult').innerHTML = `
        <h3>Circle Calculations</h3>
        <p class="highlight">Area: ${area.toFixed(2)}</p>
        <p>Circumference: ${circumference.toFixed(2)}</p>
        <p>Diameter: ${(2 * r).toFixed(2)}</p>
    `;
}

function calculateTriangle() {
    const base = parseFloat(document.getElementById('triangleBase').value);
    const height = parseFloat(document.getElementById('triangleHeight').value);
    
    if (!base || !height || base <= 0 || height <= 0) {
        document.getElementById('triangleResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const area = (base * height) / 2;
    
    document.getElementById('triangleResult').innerHTML = `
        <h3>Triangle Area</h3>
        <p class="highlight">${area.toFixed(2)}</p>
    `;
}

function calculateRectangle() {
    const length = parseFloat(document.getElementById('rectLength').value);
    const width = parseFloat(document.getElementById('rectWidth').value);
    
    if (!length || !width || length <= 0 || width <= 0) {
        document.getElementById('rectResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const area = length * width;
    const perimeter = 2 * (length + width);
    
    document.getElementById('rectResult').innerHTML = `
        <h3>Rectangle Calculations</h3>
        <p class="highlight">Area: ${area.toFixed(2)}</p>
        <p>Perimeter: ${perimeter.toFixed(2)}</p>
    `;
}

function calculateSphere() {
    const r = parseFloat(document.getElementById('sphereRadius').value);
    
    if (!r || r <= 0) {
        document.getElementById('sphereResult').innerHTML = '<p style="color: red;">Please enter a valid radius</p>';
        return;
    }
    
    const volume = (4/3) * Math.PI * Math.pow(r, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(r, 2);
    
    document.getElementById('sphereResult').innerHTML = `
        <h3>Sphere Calculations</h3>
        <p class="highlight">Volume: ${volume.toFixed(2)}</p>
        <p>Surface Area: ${surfaceArea.toFixed(2)}</p>
    `;
}

function calculateCylinder() {
    const r = parseFloat(document.getElementById('cylinderRadius').value);
    const h = parseFloat(document.getElementById('cylinderHeight').value);
    
    if (!r || !h || r <= 0 || h <= 0) {
        document.getElementById('cylinderResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const volume = Math.PI * Math.pow(r, 2) * h;
    const surfaceArea = 2 * Math.PI * r * (r + h);
    
    document.getElementById('cylinderResult').innerHTML = `
        <h3>Cylinder Calculations</h3>
        <p class="highlight">Volume: ${volume.toFixed(2)}</p>
        <p>Surface Area: ${surfaceArea.toFixed(2)}</p>
    `;
}

// ============================================
// HEALTH & FITNESS CALCULATOR FUNCTIONS
// ============================================

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // convert to meters
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        document.getElementById('bmiResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const bmi = weight / (height * height);
    
    let category, color;
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3182ce';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#48bb78';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#ed8936';
    } else {
        category = 'Obese';
        color = '#f56565';
    }
    
    document.getElementById('bmiResult').innerHTML = `
        <h3>BMI Result</h3>
        <p class="highlight">${bmi.toFixed(1)}</p>
        <p style="color: ${color}; font-weight: 600; font-size: 18px;">${category}</p>
        <p style="margin-top: 10px; font-size: 13px; color: #4a5568;">
            <strong>BMI Ranges:</strong><br>
            Underweight: < 18.5<br>
            Normal: 18.5 - 24.9<br>
            Overweight: 25 - 29.9<br>
            Obese: ≥ 30
        </p>
    `;
}

function calculateCalories() {
    const age = parseInt(document.getElementById('calAge').value);
    const gender = document.getElementById('calGender').value;
    const weight = parseFloat(document.getElementById('calWeight').value);
    const height = parseFloat(document.getElementById('calHeight').value);
    const activity = parseFloat(document.getElementById('calActivity').value);
    
    if (!age || !weight || !height) {
        document.getElementById('caloriesResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const tdee = bmr * activity;
    const lose = tdee - 500;
    const gain = tdee + 500;
    
    document.getElementById('caloriesResult').innerHTML = `
        <h3>Daily Calorie Needs</h3>
        <p><strong>BMR (Base Metabolic Rate):</strong> ${Math.round(bmr)} calories</p>
        <p class="highlight">Maintenance: ${Math.round(tdee)} calories/day</p>
        <p><strong>Weight Loss:</strong> ${Math.round(lose)} calories/day</p>
        <p><strong>Weight Gain:</strong> ${Math.round(gain)} calories/day</p>
    `;
}

function calculateBodyFat() {
    const gender = document.getElementById('bfGender').value;
    const age = parseInt(document.getElementById('bfAge').value);
    const weight = parseFloat(document.getElementById('bfWeight').value);
    const height = parseFloat(document.getElementById('bfHeight').value);
    
    if (!age || !weight || !height) {
        document.getElementById('bodyFatResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    // BMI-based estimation (simplified)
    const bmi = weight / Math.pow(height / 100, 2);
    
    let bodyFat;
    if (gender === 'male') {
        bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
    } else {
        bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
    }
    
    let category;
    if (gender === 'male') {
        if (bodyFat < 6) category = 'Essential Fat';
        else if (bodyFat < 14) category = 'Athletes';
        else if (bodyFat < 18) category = 'Fitness';
        else if (bodyFat < 25) category = 'Average';
        else category = 'Obese';
    } else {
        if (bodyFat < 14) category = 'Essential Fat';
        else if (bodyFat < 21) category = 'Athletes';
        else if (bodyFat < 25) category = 'Fitness';
        else if (bodyFat < 32) category = 'Average';
        else category = 'Obese';
    }
    
    document.getElementById('bodyFatResult').innerHTML = `
        <h3>Body Fat Estimate</h3>
        <p class="highlight">${bodyFat.toFixed(1)}%</p>
        <p><strong>Category:</strong> ${category}</p>
        <p style="font-size: 12px; color: #718096; margin-top: 10px;">
            Note: This is an estimate. For accurate body fat %, use specialized equipment.
        </p>
    `;
}

// ============================================
// TAX & TIP CALCULATOR FUNCTIONS
// ============================================

function calculateTaxTip() {
    const bill = parseFloat(document.getElementById('billAmount').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value) / 100;
    const tipPercent = parseFloat(document.getElementById('tipPercent').value) / 100;
    const numPeople = parseInt(document.getElementById('numPeople').value);
    
    if (!bill || bill <= 0) {
        document.getElementById('taxTipResult').innerHTML = '<p style="color: red;">Please enter a valid bill amount</p>';
        return;
    }
    
    const tax = bill * taxRate;
    const subtotal = bill + tax;
    const tip = subtotal * tipPercent;
    const total = subtotal + tip;
    const perPerson = total / numPeople;
    
    document.getElementById('taxTipResult').innerHTML = `
        <h3>Bill Breakdown</h3>
        <p><strong>Original Bill:</strong> $${bill.toFixed(2)}</p>
        <p><strong>Tax (${(taxRate * 100).toFixed(1)}%):</strong> $${tax.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>Tip (${(tipPercent * 100).toFixed(0)}%):</strong> $${tip.toFixed(2)}</p>
        <p class="highlight">Total: $${total.toFixed(2)}</p>
        ${numPeople > 1 ? `<p><strong>Per Person:</strong> $${perPerson.toFixed(2)}</p>` : ''}
    `;
}

// ============================================
// SCIENTIFIC NOTATION CONVERTER FUNCTIONS
// ============================================

function convertScientific() {
    const standard = document.getElementById('standardNumber').value;
    const scientific = document.getElementById('scientificNumber').value;
    
    let result = '';
    
    if (standard) {
        const num = parseFloat(standard);
        if (!isNaN(num)) {
            const sciNotation = num.toExponential();
            result = `<p><strong>Standard:</strong> ${num}</p>
                     <p class="highlight">Scientific: ${sciNotation}</p>`;
        } else {
            result = '<p style="color: red;">Invalid number</p>';
        }
    } else if (scientific) {
        const num = parseFloat(scientific);
        if (!isNaN(num)) {
            result = `<p class="highlight">Standard: ${num}</p>
                     <p><strong>Scientific:</strong> ${num.toExponential()}</p>`;
        } else {
            result = '<p style="color: red;">Invalid scientific notation</p>';
        }
    } else {
        result = '<p style="color: red;">Please enter a value</p>';
    }
    
    document.getElementById('sciNotationResult').innerHTML = result;
}

// ============================================
// COMPLEX NUMBER CALCULATOR FUNCTIONS
// ============================================

function complexAdd() {
    const r1 = parseFloat(document.getElementById('complex1Real').value) || 0;
    const i1 = parseFloat(document.getElementById('complex1Imag').value) || 0;
    const r2 = parseFloat(document.getElementById('complex2Real').value) || 0;
    const i2 = parseFloat(document.getElementById('complex2Imag').value) || 0;
    
    const realResult = r1 + r2;
    const imagResult = i1 + i2;
    
    document.getElementById('complexResult').innerHTML = `
        <h3>Addition Result</h3>
        <p>(${r1} + ${i1}i) + (${r2} + ${i2}i)</p>
        <p class="highlight">${realResult} + ${imagResult}i</p>
    `;
}

function complexSubtract() {
    const r1 = parseFloat(document.getElementById('complex1Real').value) || 0;
    const i1 = parseFloat(document.getElementById('complex1Imag').value) || 0;
    const r2 = parseFloat(document.getElementById('complex2Real').value) || 0;
    const i2 = parseFloat(document.getElementById('complex2Imag').value) || 0;
    
    const realResult = r1 - r2;
    const imagResult = i1 - i2;
    
    document.getElementById('complexResult').innerHTML = `
        <h3>Subtraction Result</h3>
        <p>(${r1} + ${i1}i) - (${r2} + ${i2}i)</p>
        <p class="highlight">${realResult} + ${imagResult}i</p>
    `;
}

function complexMultiply() {
    const r1 = parseFloat(document.getElementById('complex1Real').value) || 0;
    const i1 = parseFloat(document.getElementById('complex1Imag').value) || 0;
    const r2 = parseFloat(document.getElementById('complex2Real').value) || 0;
    const i2 = parseFloat(document.getElementById('complex2Imag').value) || 0;
    
    // (a + bi)(c + di) = (ac - bd) + (ad + bc)i
    const realResult = r1 * r2 - i1 * i2;
    const imagResult = r1 * i2 + i1 * r2;
    
    document.getElementById('complexResult').innerHTML = `
        <h3>Multiplication Result</h3>
        <p>(${r1} + ${i1}i) × (${r2} + ${i2}i)</p>
        <p class="highlight">${realResult.toFixed(2)} + ${imagResult.toFixed(2)}i</p>
    `;
}

function complexDivide() {
    const r1 = parseFloat(document.getElementById('complex1Real').value) || 0;
    const i1 = parseFloat(document.getElementById('complex1Imag').value) || 0;
    const r2 = parseFloat(document.getElementById('complex2Real').value) || 0;
    const i2 = parseFloat(document.getElementById('complex2Imag').value) || 0;
    
    if (r2 === 0 && i2 === 0) {
        document.getElementById('complexResult').innerHTML = '<p style="color: red;">Cannot divide by zero</p>';
        return;
    }
    
    // (a + bi)/(c + di) = [(ac + bd) + (bc - ad)i] / (c² + d²)
    const denominator = r2 * r2 + i2 * i2;
    const realResult = (r1 * r2 + i1 * i2) / denominator;
    const imagResult = (i1 * r2 - r1 * i2) / denominator;
    
    document.getElementById('complexResult').innerHTML = `
        <h3>Division Result</h3>
        <p>(${r1} + ${i1}i) ÷ (${r2} + ${i2}i)</p>
        <p class="highlight">${realResult.toFixed(4)} + ${imagResult.toFixed(4)}i</p>
    `;
}

