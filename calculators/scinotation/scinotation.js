// Scientific Notation Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator scinotation-calc">
                <h2 class="calc-title">Scientific Notation Calculator</h2>
                
                <div class="scinotation-tabs">
                    <button class="mini-tab active" data-direction="toScientific">To Scientific</button>
                    <button class="mini-tab" data-direction="fromScientific">From Scientific</button>
                </div>
                
                <!-- To Scientific Notation -->
                <div class="scinotation-panel active" id="toScientific-panel">
                    <div class="form-group">
                        <label>Enter Number</label>
                        <input type="text" id="standardNumber" placeholder="e.g., 1234567890 or 0.0000123">
                    </div>
                    <button class="btn calculate-btn" id="toScientificBtn">Convert to Scientific</button>
                </div>
                
                <!-- From Scientific Notation -->
                <div class="scinotation-panel" id="fromScientific-panel">
                    <div class="form-group">
                        <label>Coefficient</label>
                        <input type="number" id="coefficient" placeholder="e.g., 1.23" step="any">
                    </div>
                    <div class="form-group">
                        <label>Exponent (power of 10)</label>
                        <input type="number" id="exponent" placeholder="e.g., 9 for 10^9">
                    </div>
                    <button class="btn calculate-btn" id="fromScientificBtn">Convert to Standard</button>
                </div>
                
                <div class="result-box" id="scinotationResult"></div>
                
                <div class="scinotation-info">
                    <h3>Scientific Notation Format</h3>
                    <p>a × 10<sup>n</sup> where 1 ≤ |a| &lt; 10</p>
                    <p>Examples:</p>
                    <ul>
                        <li>1,234,000 = 1.234 × 10<sup>6</sup></li>
                        <li>0.000567 = 5.67 × 10<sup>-4</sup></li>
                        <li>299,792,458 = 2.99792458 × 10<sup>8</sup> (speed of light in m/s)</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.mini-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const direction = tab.dataset.direction;
            document.querySelectorAll('.scinotation-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(direction + '-panel').classList.add('active');
            document.getElementById('scinotationResult').innerHTML = '';
        });
    });
    
    document.getElementById('toScientificBtn')?.addEventListener('click', convertToScientific);
    document.getElementById('fromScientificBtn')?.addEventListener('click', convertFromScientific);
}

function convertToScientific() {
    const input = document.getElementById('standardNumber').value.trim();
    
    if (!input) {
        document.getElementById('scinotationResult').innerHTML = '<p style="color: red;">Please enter a number</p>';
        return;
    }
    
    const number = parseFloat(input);
    
    if (isNaN(number)) {
        document.getElementById('scinotationResult').innerHTML = '<p style="color: red;">Invalid number</p>';
        return;
    }
    
    if (number === 0) {
        document.getElementById('scinotationResult').innerHTML = `
            <h3>Result</h3>
            <p class="highlight">0 × 10<sup>0</sup></p>
        `;
        return;
    }
    
    const exponent = Math.floor(Math.log10(Math.abs(number)));
    const coefficient = number / Math.pow(10, exponent);
    
    const scientificNotation = `${coefficient.toFixed(6)} × 10<sup>${exponent}</sup>`;
    const engineeringExp = Math.floor(exponent / 3) * 3;
    const engineeringCoeff = number / Math.pow(10, engineeringExp);
    
    document.getElementById('scinotationResult').innerHTML = `
        <h3>Scientific Notation</h3>
        <p class="highlight">${scientificNotation}</p>
        <p><strong>Coefficient:</strong> ${coefficient.toFixed(6)}</p>
        <p><strong>Exponent:</strong> ${exponent}</p>
        <hr>
        <h4>Engineering Notation</h4>
        <p>${engineeringCoeff.toFixed(6)} × 10<sup>${engineeringExp}</sup></p>
        <hr>
        <h4>E-notation</h4>
        <p>${number.toExponential()}</p>
    `;
}

function convertFromScientific() {
    const coefficient = parseFloat(document.getElementById('coefficient').value);
    const exponent = parseInt(document.getElementById('exponent').value);
    
    if (isNaN(coefficient) || isNaN(exponent)) {
        document.getElementById('scinotationResult').innerHTML = '<p style="color: red;">Please enter valid coefficient and exponent</p>';
        return;
    }
    
    const result = coefficient * Math.pow(10, exponent);
    
    let formattedResult;
    if (Math.abs(result) >= 1e15 || (Math.abs(result) < 1e-6 && result !== 0)) {
        formattedResult = result.toExponential();
    } else {
        formattedResult = result.toLocaleString('en-US', { maximumFractionDigits: 10 });
    }
    
    document.getElementById('scinotationResult').innerHTML = `
        <h3>Standard Form</h3>
        <p class="highlight">${formattedResult}</p>
        <p><strong>Original:</strong> ${coefficient} × 10<sup>${exponent}</sup></p>
        <p><strong>Exact value:</strong> ${result}</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
