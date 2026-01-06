// Tax & Tip Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator taxtip-calc">
                <h2 class="calc-title">Tax & Tip Calculator</h2>
                
                <div class="form-group">
                    <label>Bill Amount ($)</label>
                    <input type="number" id="billAmount" placeholder="Enter bill amount" step="0.01">
                </div>
                
                <div class="form-group">
                    <label>Tax Rate (%)</label>
                    <input type="number" id="taxRate" placeholder="e.g., 8.5" value="0" step="0.1">
                </div>
                
                <div class="form-group">
                    <label>Tip Percentage (%)</label>
                    <input type="number" id="tipPercent" placeholder="e.g., 15, 18, 20" step="1">
                </div>
                
                <div class="tip-presets">
                    <button class="btn" onclick="window.setTip(15)">15%</button>
                    <button class="btn" onclick="window.setTip(18)">18%</button>
                    <button class="btn" onclick="window.setTip(20)">20%</button>
                    <button class="btn" onclick="window.setTip(25)">25%</button>
                </div>
                
                <div class="form-group">
                    <label>Split Bill (Number of People)</label>
                    <input type="number" id="splitCount" placeholder="1" value="1" min="1">
                </div>
                
                <button class="btn calculate-btn" id="calcTaxTipBtn">Calculate</button>
                
                <div class="result-box" id="taxtipResult"></div>
            </div>
        </div>
    `;
    
    attachEventListeners();
    attachGlobalFunctions();
}

function attachEventListeners() {
    document.getElementById('calcTaxTipBtn')?.addEventListener('click', calculateTaxTip);
}

function attachGlobalFunctions() {
    window.setTip = function(percent) {
        document.getElementById('tipPercent').value = percent;
    };
}

function calculateTaxTip() {
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);
    const splitCount = parseInt(document.getElementById('splitCount').value) || 1;
    
    if (!billAmount || billAmount <= 0) {
        document.getElementById('taxtipResult').innerHTML = '<p style="color: red;">Please enter a valid bill amount</p>';
        return;
    }
    
    if (!tipPercent || tipPercent < 0) {
        document.getElementById('taxtipResult').innerHTML = '<p style="color: red;">Please enter a valid tip percentage</p>';
        return;
    }
    
    const taxAmount = billAmount * (taxRate / 100);
    const subtotalWithTax = billAmount + taxAmount;
    const tipAmount = subtotalWithTax * (tipPercent / 100);
    const totalAmount = subtotalWithTax + tipAmount;
    const perPerson = totalAmount / splitCount;
    
    document.getElementById('taxtipResult').innerHTML = `
        <h3>Bill Breakdown</h3>
        <div class="bill-breakdown">
            <p><strong>Subtotal:</strong> $${billAmount.toFixed(2)}</p>
            <p><strong>Tax (${taxRate}%):</strong> $${taxAmount.toFixed(2)}</p>
            <p><strong>Subtotal + Tax:</strong> $${subtotalWithTax.toFixed(2)}</p>
            <p><strong>Tip (${tipPercent}%):</strong> $${tipAmount.toFixed(2)}</p>
            <p class="highlight"><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            ${splitCount > 1 ? `
                <hr>
                <p class="highlight"><strong>Per Person (${splitCount} people):</strong> $${perPerson.toFixed(2)}</p>
            ` : ''}
        </div>
    `;
}

export function cleanup() {
    delete window.setTip;
}
