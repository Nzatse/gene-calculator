// Printing Calculator Module
import { downloadFile } from '../../js/utils.js';

let tape = [];
let currentInput = '';
let currentOperator = null;
let firstOperand = 0;

export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper">
            <div class="calculator printing-calc">
                <h2 class="calc-title">Printing Calculator</h2>
                
                <div class="tape-display" id="tapeDisplay"></div>
                
                <div class="print-input">
                    <input type="text" id="printDisplay" readonly value="0">
                </div>
                
                <div class="button-grid">
                    <button class="btn print-btn" onclick="window.printInput('7')">7</button>
                    <button class="btn print-btn" onclick="window.printInput('8')">8</button>
                    <button class="btn print-btn" onclick="window.printInput('9')">9</button>
                    <button class="btn operator" onclick="window.printOperator('/')">÷</button>
                    
                    <button class="btn print-btn" onclick="window.printInput('4')">4</button>
                    <button class="btn print-btn" onclick="window.printInput('5')">5</button>
                    <button class="btn print-btn" onclick="window.printInput('6')">6</button>
                    <button class="btn operator" onclick="window.printOperator('*')">×</button>
                    
                    <button class="btn print-btn" onclick="window.printInput('1')">1</button>
                    <button class="btn print-btn" onclick="window.printInput('2')">2</button>
                    <button class="btn print-btn" onclick="window.printInput('3')">3</button>
                    <button class="btn operator" onclick="window.printOperator('-')">−</button>
                    
                    <button class="btn print-btn" onclick="window.printInput('0')">0</button>
                    <button class="btn print-btn" onclick="window.printInput('.')">.</button>
                    <button class="btn calculate-btn" onclick="window.printCalculate()">=</button>
                    <button class="btn operator" onclick="window.printOperator('+')">+</button>
                    
                    <button class="btn clear" onclick="window.printClear()">C</button>
                    <button class="btn clear" onclick="window.printClearEntry()">CE</button>
                    <button class="btn" onclick="window.exportTape()">Export</button>
                    <button class="btn clear" onclick="window.clearTape()">Clear Tape</button>
                </div>
            </div>
        </div>
    `;
    
    tape = [];
    currentInput = '';
    currentOperator = null;
    firstOperand = 0;
    
    attachGlobalFunctions();
    renderTape();
}

function attachGlobalFunctions() {
    window.printInput = function(digit) {
        currentInput += digit;
        document.getElementById('printDisplay').value = currentInput;
    };
    
    window.printOperator = function(op) {
        if (currentInput === '') return;
        
        if (currentOperator && currentInput) {
            printCalculate();
        }
        
        firstOperand = parseFloat(currentInput);
        currentOperator = op;
        addToTape(currentInput + ' ' + op);
        currentInput = '';
    };
    
    window.printCalculate = function() {
        if (!currentOperator || currentInput === '') return;
        
        const secondOperand = parseFloat(currentInput);
        let result = 0;
        
        switch (currentOperator) {
            case '+': result = firstOperand + secondOperand; break;
            case '-': result = firstOperand - secondOperand; break;
            case '*': result = firstOperand * secondOperand; break;
            case '/': result = secondOperand !== 0 ? firstOperand / secondOperand : 'Error'; break;
        }
        
        addToTape(currentInput);
        addToTape('= ' + result, 'result');
        addToTape('---');
        
        document.getElementById('printDisplay').value = result;
        currentInput = result.toString();
        currentOperator = null;
        firstOperand = 0;
    };
    
    window.printClear = function() {
        currentInput = '';
        currentOperator = null;
        firstOperand = 0;
        document.getElementById('printDisplay').value = '0';
    };
    
    window.printClearEntry = function() {
        currentInput = '';
        document.getElementById('printDisplay').value = '0';
    };
    
    window.exportTape = function() {
        if (tape.length === 0) {
            alert('Tape is empty');
            return;
        }
        
        const content = tape.map(t => t.text).join('\n');
        downloadFile('calculator-tape.txt', content);
    };
    
    window.clearTape = function() {
        tape = [];
        renderTape();
    };
}

function addToTape(text, type = 'normal') {
    tape.push({ text, type });
    renderTape();
}

function renderTape() {
    const tapeDisplay = document.getElementById('tapeDisplay');
    if (tape.length === 0) {
        tapeDisplay.innerHTML = '<p class="empty-state">Tape is empty</p>';
        return;
    }
    
    tapeDisplay.innerHTML = tape.map(entry => {
        const className = entry.type === 'result' ? 'tape-result' : '';
        return `<div class="tape-entry ${className}">${entry.text}</div>`;
    }).join('');
    
    tapeDisplay.scrollTop = tapeDisplay.scrollHeight;
}

export function cleanup() {
    delete window.printInput;
    delete window.printOperator;
    delete window.printCalculate;
    delete window.printClear;
    delete window.printClearEntry;
    delete window.exportTape;
    delete window.clearTape;
}
