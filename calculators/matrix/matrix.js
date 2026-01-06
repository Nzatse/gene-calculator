// Matrix Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator matrix-calc">
                <h2 class="calc-title">Matrix Calculator</h2>
                
                <div class="matrix-tabs">
                    <button class="mini-tab active" data-op="add">Add</button>
                    <button class="mini-tab" data-op="subtract">Subtract</button>
                    <button class="mini-tab" data-op="multiply">Multiply</button>
                    <button class="mini-tab" data-op="determinant">Determinant</button>
                    <button class="mini-tab" data-op="transpose">Transpose</button>
                </div>
                
                <div id="matrixInputArea"></div>
                
                <button class="btn calculate-btn" id="calculateMatrixBtn">Calculate</button>
                
                <div class="result-box" id="matrixResult"></div>
            </div>
        </div>
    `;
    
    attachEventListeners();
    showMatrixInputs('add');
}

function attachEventListeners() {
    document.querySelectorAll('.mini-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showMatrixInputs(tab.dataset.op);
        });
    });
    
    document.getElementById('calculateMatrixBtn')?.addEventListener('click', calculateMatrix);
}

function showMatrixInputs(operation) {
    const inputArea = document.getElementById('matrixInputArea');
    
    if (operation === 'determinant' || operation === 'transpose') {
        inputArea.innerHTML = `
            <h3>Matrix A (2x2 or 3x3)</h3>
            <div class="form-group">
                <label>Matrix Size</label>
                <select id="matrixSize">
                    <option value="2">2x2</option>
                    <option value="3">3x3</option>
                </select>
            </div>
            <div id="matrixAInputs"></div>
        `;
        
        document.getElementById('matrixSize').addEventListener('change', function() {
            renderMatrixInputs('A', parseInt(this.value));
        });
        
        renderMatrixInputs('A', 2);
    } else {
        inputArea.innerHTML = `
            <div class="matrix-column">
                <h3>Matrix A (2x2)</h3>
                <div id="matrixAInputs"></div>
            </div>
            <div class="matrix-column">
                <h3>Matrix B (2x2)</h3>
                <div id="matrixBInputs"></div>
            </div>
        `;
        
        renderMatrixInputs('A', 2);
        renderMatrixInputs('B', 2);
    }
}

function renderMatrixInputs(matrixId, size) {
    const container = document.getElementById(`matrix${matrixId}Inputs`);
    let html = '<div class="matrix-grid">';
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            html += `<input type="number" class="matrix-input" data-matrix="${matrixId}" data-row="${i}" data-col="${j}" placeholder="${i},${j}" value="0">`;
        }
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function getMatrixFromInputs(matrixId) {
    const inputs = document.querySelectorAll(`input[data-matrix="${matrixId}"]`);
    const size = Math.sqrt(inputs.length);
    const matrix = [];
    
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            const input = document.querySelector(`input[data-matrix="${matrixId}"][data-row="${i}"][data-col="${j}"]`);
            matrix[i][j] = parseFloat(input.value) || 0;
        }
    }
    
    return matrix;
}

function calculateMatrix() {
    const operation = document.querySelector('.mini-tab.active').dataset.op;
    
    try {
        let result;
        
        switch (operation) {
            case 'add':
                result = matrixAdd(getMatrixFromInputs('A'), getMatrixFromInputs('B'));
                break;
            case 'subtract':
                result = matrixSubtract(getMatrixFromInputs('A'), getMatrixFromInputs('B'));
                break;
            case 'multiply':
                result = matrixMultiply(getMatrixFromInputs('A'), getMatrixFromInputs('B'));
                break;
            case 'determinant':
                result = matrixDeterminant(getMatrixFromInputs('A'));
                break;
            case 'transpose':
                result = matrixTranspose(getMatrixFromInputs('A'));
                break;
        }
        
        displayResult(result, operation);
    } catch (error) {
        document.getElementById('matrixResult').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function matrixAdd(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function matrixSubtract(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

function matrixDeterminant(matrix) {
    const n = matrix.length;
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    if (n === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    }
}

function matrixTranspose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function displayResult(result, operation) {
    let html = '<h3>Result</h3>';
    
    if (operation === 'determinant') {
        html += `<p class="highlight">${result.toFixed(4)}</p>`;
    } else {
        html += '<div class="matrix-result">';
        result.forEach(row => {
            html += '<div class="matrix-row">';
            row.forEach(val => {
                html += `<span class="matrix-cell">${val.toFixed(2)}</span>`;
            });
            html += '</div>';
        });
        html += '</div>';
    }
    
    document.getElementById('matrixResult').innerHTML = html;
}

export function cleanup() {
    // Cleanup if needed
}
