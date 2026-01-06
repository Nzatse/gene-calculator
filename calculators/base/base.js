// Base Converter Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator base-calc">
                <h2 class="calc-title">Base Converter</h2>
                <p class="description">Convert between Binary, Octal, Decimal, and Hexadecimal</p>
                
                <div class="form-group">
                    <label>Input Value</label>
                    <input type="text" id="baseInput" placeholder="Enter number">
                </div>
                
                <div class="form-group">
                    <label>From Base</label>
                    <select id="fromBase">
                        <option value="2">Binary (2)</option>
                        <option value="8">Octal (8)</option>
                        <option value="10" selected>Decimal (10)</option>
                        <option value="16">Hexadecimal (16)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>To Base</label>
                    <select id="toBase">
                        <option value="2" selected>Binary (2)</option>
                        <option value="8">Octal (8)</option>
                        <option value="10">Decimal (10)</option>
                        <option value="16">Hexadecimal (16)</option>
                    </select>
                </div>
                
                <button class="btn calculate-btn" id="convertBaseBtn">Convert</button>
                
                <div class="result-box" id="baseResult"></div>
                
                <div class="base-info">
                    <h3>All Representations</h3>
                    <div id="allBases"></div>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    document.getElementById('convertBaseBtn')?.addEventListener('click', convertBase);
}

function convertBase() {
    const input = document.getElementById('baseInput').value.trim().toUpperCase();
    const fromBase = parseInt(document.getElementById('fromBase').value);
    const toBase = parseInt(document.getElementById('toBase').value);
    
    if (!input) {
        document.getElementById('baseResult').innerHTML = '<p style="color: red;">Please enter a value</p>';
        return;
    }
    
    try {
        const decimal = parseInt(input, fromBase);
        
        if (isNaN(decimal)) {
            throw new Error('Invalid input for selected base');
        }
        
        const result = decimal.toString(toBase).toUpperCase();
        
        document.getElementById('baseResult').innerHTML = `
            <h3>Conversion Result</h3>
            <p class="highlight">${result}</p>
            <p>${input}<sub>${fromBase}</sub> = ${result}<sub>${toBase}</sub></p>
        `;
        
        document.getElementById('allBases').innerHTML = `
            <div class="base-item">
                <strong>Binary:</strong> ${decimal.toString(2)}
            </div>
            <div class="base-item">
                <strong>Octal:</strong> ${decimal.toString(8)}
            </div>
            <div class="base-item">
                <strong>Decimal:</strong> ${decimal}
            </div>
            <div class="base-item">
                <strong>Hexadecimal:</strong> ${decimal.toString(16).toUpperCase()}
            </div>
        `;
        
    } catch (error) {
        document.getElementById('baseResult').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

export function cleanup() {
    // Cleanup if needed
}
