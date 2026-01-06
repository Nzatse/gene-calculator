// Complex Numbers Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator complex-calc">
                <h2 class="calc-title">Complex Numbers Calculator</h2>
                <p class="description">Perform operations on complex numbers (a + bi)</p>
                
                <div class="complex-inputs">
                    <div class="complex-number">
                        <h3>First Number</h3>
                        <div class="form-group inline">
                            <label>Real (a):</label>
                            <input type="number" id="real1" placeholder="0" step="any" value="0">
                        </div>
                        <div class="form-group inline">
                            <label>Imaginary (b):</label>
                            <input type="number" id="imag1" placeholder="0" step="any" value="0">
                        </div>
                    </div>
                    
                    <div class="complex-number">
                        <h3>Second Number</h3>
                        <div class="form-group inline">
                            <label>Real (a):</label>
                            <input type="number" id="real2" placeholder="0" step="any" value="0">
                        </div>
                        <div class="form-group inline">
                            <label>Imaginary (b):</label>
                            <input type="number" id="imag2" placeholder="0" step="any" value="0">
                        </div>
                    </div>
                </div>
                
                <div class="operation-buttons">
                    <button class="btn operator" id="complexAddBtn">Add (+)</button>
                    <button class="btn operator" id="complexSubBtn">Subtract (−)</button>
                    <button class="btn operator" id="complexMulBtn">Multiply (×)</button>
                    <button class="btn operator" id="complexDivBtn">Divide (÷)</button>
                </div>
                
                <div class="result-box" id="complexResult"></div>
                
                <div class="complex-info">
                    <h3>Complex Number Notation</h3>
                    <p>Standard form: a + bi</p>
                    <p>Where i² = -1</p>
                    <p>Example: 3 + 4i means real part = 3, imaginary part = 4</p>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    document.getElementById('complexAddBtn')?.addEventListener('click', () => performOperation('add'));
    document.getElementById('complexSubBtn')?.addEventListener('click', () => performOperation('subtract'));
    document.getElementById('complexMulBtn')?.addEventListener('click', () => performOperation('multiply'));
    document.getElementById('complexDivBtn')?.addEventListener('click', () => performOperation('divide'));
}

function getComplexNumbers() {
    const real1 = parseFloat(document.getElementById('real1').value) || 0;
    const imag1 = parseFloat(document.getElementById('imag1').value) || 0;
    const real2 = parseFloat(document.getElementById('real2').value) || 0;
    const imag2 = parseFloat(document.getElementById('imag2').value) || 0;
    
    return {
        z1: { real: real1, imag: imag1 },
        z2: { real: real2, imag: imag2 }
    };
}

function formatComplex(real, imag) {
    real = parseFloat(real.toFixed(6));
    imag = parseFloat(imag.toFixed(6));
    
    if (imag === 0) return `${real}`;
    if (real === 0) return `${imag}i`;
    
    const sign = imag >= 0 ? '+' : '-';
    return `${real} ${sign} ${Math.abs(imag)}i`;
}

function performOperation(operation) {
    const { z1, z2 } = getComplexNumbers();
    
    let result;
    let operationSymbol;
    
    switch (operation) {
        case 'add':
            result = complexAdd(z1, z2);
            operationSymbol = '+';
            break;
        case 'subtract':
            result = complexSubtract(z1, z2);
            operationSymbol = '−';
            break;
        case 'multiply':
            result = complexMultiply(z1, z2);
            operationSymbol = '×';
            break;
        case 'divide':
            result = complexDivide(z1, z2);
            operationSymbol = '÷';
            break;
    }
    
    if (result.error) {
        document.getElementById('complexResult').innerHTML = `<p style="color: red;">${result.error}</p>`;
        return;
    }
    
    const z1Str = formatComplex(z1.real, z1.imag);
    const z2Str = formatComplex(z2.real, z2.imag);
    const resultStr = formatComplex(result.real, result.imag);
    
    const magnitude = Math.sqrt(result.real * result.real + result.imag * result.imag);
    const angle = Math.atan2(result.imag, result.real) * (180 / Math.PI);
    
    document.getElementById('complexResult').innerHTML = `
        <h3>Result</h3>
        <p class="highlight">${resultStr}</p>
        <p><strong>Operation:</strong> (${z1Str}) ${operationSymbol} (${z2Str})</p>
        <hr>
        <h4>Polar Form</h4>
        <p><strong>Magnitude (r):</strong> ${magnitude.toFixed(6)}</p>
        <p><strong>Angle (θ):</strong> ${angle.toFixed(2)}°</p>
        <p><strong>Polar notation:</strong> ${magnitude.toFixed(6)} ∠ ${angle.toFixed(2)}°</p>
        <hr>
        <h4>Components</h4>
        <p><strong>Real part:</strong> ${result.real.toFixed(6)}</p>
        <p><strong>Imaginary part:</strong> ${result.imag.toFixed(6)}</p>
    `;
}

function complexAdd(z1, z2) {
    return {
        real: z1.real + z2.real,
        imag: z1.imag + z2.imag
    };
}

function complexSubtract(z1, z2) {
    return {
        real: z1.real - z2.real,
        imag: z1.imag - z2.imag
    };
}

function complexMultiply(z1, z2) {
    return {
        real: z1.real * z2.real - z1.imag * z2.imag,
        imag: z1.real * z2.imag + z1.imag * z2.real
    };
}

function complexDivide(z1, z2) {
    const denominator = z2.real * z2.real + z2.imag * z2.imag;
    
    if (denominator === 0) {
        return { error: 'Cannot divide by zero' };
    }
    
    return {
        real: (z1.real * z2.real + z1.imag * z2.imag) / denominator,
        imag: (z1.imag * z2.real - z1.real * z2.imag) / denominator
    };
}

export function cleanup() {
    // Cleanup if needed
}
