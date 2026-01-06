// Programmable Calculator Module
import { saveToStorage, loadFromStorage } from '../../js/utils.js';

export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper">
            <div class="calculator programmable-calc">
                <h2 class="calc-title">Programmable Calculator</h2>
                <p class="description">Create custom formulas with variables</p>
                
                <div class="formula-creator">
                    <h3>Create Formula</h3>
                    <div class="form-group">
                        <label>Formula Name</label>
                        <input type="text" id="formulaName" placeholder="e.g., Rectangle Area">
                    </div>
                    <div class="form-group">
                        <label>Variables (comma-separated)</label>
                        <input type="text" id="formulaVars" placeholder="e.g., length, width">
                    </div>
                    <div class="form-group">
                        <label>Expression</label>
                        <input type="text" id="formulaExpr" placeholder="e.g., length * width">
                    </div>
                    <button class="btn calculate-btn" id="saveFormulaBtn">Save Formula</button>
                </div>
                
                <div class="formula-executor">
                    <h3>Execute Formula</h3>
                    <div id="formulaInputs"></div>
                    <div class="result-box" id="formulaResult"></div>
                </div>
                
                <div class="saved-formulas">
                    <h3>Saved Formulas</h3>
                    <button class="btn clear" id="clearFormulasBtn">Clear All</button>
                    <div id="formulasList"></div>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
    renderFormulas();
}

function attachEventListeners() {
    document.getElementById('saveFormulaBtn')?.addEventListener('click', saveFormula);
    document.getElementById('clearFormulasBtn')?.addEventListener('click', clearFormulas);
}

function saveFormula() {
    const name = document.getElementById('formulaName').value.trim();
    const varsStr = document.getElementById('formulaVars').value.trim();
    const expr = document.getElementById('formulaExpr').value.trim();
    
    if (!name || !varsStr || !expr) {
        alert('Please fill all fields');
        return;
    }
    
    const variables = varsStr.split(',').map(v => v.trim());
    
    const formulas = loadFromStorage('programmableFormulas') || [];
    formulas.push({ name, variables, expression: expr });
    saveToStorage('programmableFormulas', formulas);
    
    document.getElementById('formulaName').value = '';
    document.getElementById('formulaVars').value = '';
    document.getElementById('formulaExpr').value = '';
    
    renderFormulas();
    alert('Formula saved successfully!');
}

function renderFormulas() {
    const formulas = loadFromStorage('programmableFormulas') || [];
    const list = document.getElementById('formulasList');
    
    if (formulas.length === 0) {
        list.innerHTML = '<p class="empty-state">No saved formulas</p>';
        return;
    }
    
    list.innerHTML = formulas.map((f, idx) => `
        <div class="formula-item">
            <strong>${f.name}</strong>
            <p>Variables: ${f.variables.join(', ')}</p>
            <p>Expression: ${f.expression}</p>
            <button class="btn" onclick="window.loadFormula(${idx})">Use</button>
            <button class="btn clear" onclick="window.deleteFormula(${idx})">Delete</button>
        </div>
    `).join('');
}

window.loadFormula = function(index) {
    const formulas = loadFromStorage('programmableFormulas') || [];
    const formula = formulas[index];
    
    if (!formula) return;
    
    const inputsDiv = document.getElementById('formulaInputs');
    inputsDiv.innerHTML = `
        <h4>${formula.name}</h4>
        ${formula.variables.map(v => `
            <div class="form-group">
                <label>${v}</label>
                <input type="number" class="formula-var" data-var="${v}" placeholder="Enter ${v}">
            </div>
        `).join('')}
        <button class="btn calculate-btn" onclick="window.executeFormula(${index})">Calculate</button>
    `;
};

window.executeFormula = function(index) {
    const formulas = loadFromStorage('programmableFormulas') || [];
    const formula = formulas[index];
    
    if (!formula) return;
    
    const varInputs = document.querySelectorAll('.formula-var');
    const values = {};
    
    let allFilled = true;
    varInputs.forEach(input => {
        const varName = input.dataset.var;
        const value = parseFloat(input.value);
        if (isNaN(value)) {
            allFilled = false;
        }
        values[varName] = value;
    });
    
    if (!allFilled) {
        document.getElementById('formulaResult').innerHTML = '<p style="color: red;">Please fill all variables</p>';
        return;
    }
    
    try {
        let expr = formula.expression;
        formula.variables.forEach(v => {
            const regex = new RegExp(v, 'g');
            expr = expr.replace(regex, values[v]);
        });
        
        expr = expr.replace(/\^/g, '**');
        const result = eval(expr);
        
        document.getElementById('formulaResult').innerHTML = `
            <h3>Result</h3>
            <p class="highlight">${result}</p>
            <p>${formula.expression} = ${result}</p>
        `;
    } catch (error) {
        document.getElementById('formulaResult').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
};

window.deleteFormula = function(index) {
    if (!confirm('Delete this formula?')) return;
    
    const formulas = loadFromStorage('programmableFormulas') || [];
    formulas.splice(index, 1);
    saveToStorage('programmableFormulas', formulas);
    renderFormulas();
    
    document.getElementById('formulaInputs').innerHTML = '';
    document.getElementById('formulaResult').innerHTML = '';
};

function clearFormulas() {
    if (!confirm('Clear all formulas?')) return;
    
    saveToStorage('programmableFormulas', []);
    renderFormulas();
    document.getElementById('formulaInputs').innerHTML = '';
    document.getElementById('formulaResult').innerHTML = '';
}

export function cleanup() {
    // Cleanup global functions
    delete window.loadFormula;
    delete window.executeFormula;
    delete window.deleteFormula;
}
