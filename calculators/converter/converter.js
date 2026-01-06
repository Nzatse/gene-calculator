// Unit Converter Module
import { escapeHtml } from '../../js/utils.js';

// Currency exchange rates (approximate)
const currencyRates = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50,
    CNY: 7.24, CAD: 1.36, AUD: 1.52, CHF: 0.88, INR: 83.12
};

// Length conversion factors (to meters)
const lengthFactors = {
    m: 1, km: 1000, cm: 0.01, mm: 0.001,
    mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254
};

// Weight conversion factors (to kilograms)
const weightFactors = {
    kg: 1, g: 0.001, mg: 0.000001,
    lb: 0.453592, oz: 0.0283495, ton: 1000
};

// Volume conversion factors (to liters)
const volumeFactors = {
    l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353,
    pt: 0.473176, cup: 0.236588, floz: 0.0295735
};

export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator">
                <h2 class="calc-title">Unit Converter</h2>
                
                <div class="financial-tabs">
                    <button class="mini-tab active" data-calc="currency">Currency</button>
                    <button class="mini-tab" data-calc="length">Length</button>
                    <button class="mini-tab" data-calc="weight">Weight</button>
                    <button class="mini-tab" data-calc="temperature">Temperature</button>
                    <button class="mini-tab" data-calc="volume">Volume</button>
                </div>

                <!-- Currency Converter -->
                <div class="financial-panel active" id="currency-panel">
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="currencyAmount" value="1" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>From</label>
                        <select id="currencyFrom">
                            <option value="USD" selected>USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <select id="currencyTo">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR" selected>EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CNY">CNY - Chinese Yuan</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CHF">CHF - Swiss Franc</option>
                            <option value="INR">INR - Indian Rupee</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="convertCurrencyBtn">Convert</button>
                    <div class="result-box" id="currencyResult"></div>
                </div>

                <!-- Length Converter -->
                <div class="financial-panel" id="length-panel">
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="lengthAmount" value="1" step="0.001">
                    </div>
                    <div class="form-group">
                        <label>From</label>
                        <select id="lengthFrom">
                            <option value="m" selected>Meters (m)</option>
                            <option value="km">Kilometers (km)</option>
                            <option value="cm">Centimeters (cm)</option>
                            <option value="mm">Millimeters (mm)</option>
                            <option value="mi">Miles (mi)</option>
                            <option value="yd">Yards (yd)</option>
                            <option value="ft">Feet (ft)</option>
                            <option value="in">Inches (in)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <select id="lengthTo">
                            <option value="m">Meters (m)</option>
                            <option value="km" selected>Kilometers (km)</option>
                            <option value="cm">Centimeters (cm)</option>
                            <option value="mm">Millimeters (mm)</option>
                            <option value="mi">Miles (mi)</option>
                            <option value="yd">Yards (yd)</option>
                            <option value="ft">Feet (ft)</option>
                            <option value="in">Inches (in)</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="convertLengthBtn">Convert</button>
                    <div class="result-box" id="lengthResult"></div>
                </div>

                <!-- Weight Converter -->
                <div class="financial-panel" id="weight-panel">
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="weightAmount" value="1" step="0.001">
                    </div>
                    <div class="form-group">
                        <label>From</label>
                        <select id="weightFrom">
                            <option value="kg" selected>Kilograms (kg)</option>
                            <option value="g">Grams (g)</option>
                            <option value="mg">Milligrams (mg)</option>
                            <option value="lb">Pounds (lb)</option>
                            <option value="oz">Ounces (oz)</option>
                            <option value="ton">Metric Tons</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <select id="weightTo">
                            <option value="kg">Kilograms (kg)</option>
                            <option value="g" selected>Grams (g)</option>
                            <option value="mg">Milligrams (mg)</option>
                            <option value="lb">Pounds (lb)</option>
                            <option value="oz">Ounces (oz)</option>
                            <option value="ton">Metric Tons</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="convertWeightBtn">Convert</button>
                    <div class="result-box" id="weightResult"></div>
                </div>

                <!-- Temperature Converter -->
                <div class="financial-panel" id="temperature-panel">
                    <div class="form-group">
                        <label>Temperature</label>
                        <input type="number" id="tempAmount" value="0" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>From</label>
                        <select id="tempFrom">
                            <option value="C" selected>Celsius (°C)</option>
                            <option value="F">Fahrenheit (°F)</option>
                            <option value="K">Kelvin (K)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <select id="tempTo">
                            <option value="C">Celsius (°C)</option>
                            <option value="F" selected>Fahrenheit (°F)</option>
                            <option value="K">Kelvin (K)</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="convertTempBtn">Convert</button>
                    <div class="result-box" id="tempResult"></div>
                </div>

                <!-- Volume Converter -->
                <div class="financial-panel" id="volume-panel">
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" id="volumeAmount" value="1" step="0.001">
                    </div>
                    <div class="form-group">
                        <label>From</label>
                        <select id="volumeFrom">
                            <option value="l" selected>Liters (l)</option>
                            <option value="ml">Milliliters (ml)</option>
                            <option value="gal">Gallons (gal)</option>
                            <option value="qt">Quarts (qt)</option>
                            <option value="pt">Pints (pt)</option>
                            <option value="cup">Cups</option>
                            <option value="floz">Fluid Ounces (fl oz)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>To</label>
                        <select id="volumeTo">
                            <option value="l">Liters (l)</option>
                            <option value="ml" selected>Milliliters (ml)</option>
                            <option value="gal">Gallons (gal)</option>
                            <option value="qt">Quarts (qt)</option>
                            <option value="pt">Pints (pt)</option>
                            <option value="cup">Cups</option>
                            <option value="floz">Fluid Ounces (fl oz)</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="convertVolumeBtn">Convert</button>
                    <div class="result-box" id="volumeResult"></div>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    // Mini tabs
    document.querySelectorAll('.mini-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const calcType = tab.dataset.calc;
            document.querySelectorAll('.financial-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(calcType + '-panel');
            if (panel) panel.classList.add('active');
        });
    });

    // All converter buttons
    document.getElementById('convertCurrencyBtn')?.addEventListener('click', convertCurrency);
    document.getElementById('convertLengthBtn')?.addEventListener('click', convertLength);
    document.getElementById('convertWeightBtn')?.addEventListener('click', convertWeight);
    document.getElementById('convertTempBtn')?.addEventListener('click', convertTemperature);
    document.getElementById('convertVolumeBtn')?.addEventListener('click', convertVolume);
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    
    if (!amount) {
        document.getElementById('currencyResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    const amountInUSD = amount / currencyRates[from];
    const result = amountInUSD * currencyRates[to];
    
    document.getElementById('currencyResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}</p>
        <p>Exchange Rate: 1 ${from} = ${(currencyRates[to] / currencyRates[from]).toFixed(4)} ${to}</p>
        <p style="font-size: 12px; color: #718096; margin-top: 10px;">
            Note: Rates are approximate.
        </p>
    `;
}

function convertLength() {
    const amount = parseFloat(document.getElementById('lengthAmount').value);
    const from = document.getElementById('lengthFrom').value;
    const to = document.getElementById('lengthTo').value;
    
    if (!amount) {
        document.getElementById('lengthResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    const inMeters = amount * lengthFactors[from];
    const result = inMeters / lengthFactors[to];
    
    document.getElementById('lengthResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount} ${from} = ${result.toFixed(6)} ${to}</p>
    `;
}

function convertWeight() {
    const amount = parseFloat(document.getElementById('weightAmount').value);
    const from = document.getElementById('weightFrom').value;
    const to = document.getElementById('weightTo').value;
    
    if (!amount) {
        document.getElementById('weightResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    const inKg = amount * weightFactors[from];
    const result = inKg / weightFactors[to];
    
    document.getElementById('weightResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount} ${from} = ${result.toFixed(6)} ${to}</p>
    `;
}

function convertTemperature() {
    const amount = parseFloat(document.getElementById('tempAmount').value);
    const from = document.getElementById('tempFrom').value;
    const to = document.getElementById('tempTo').value;
    
    if (isNaN(amount)) {
        document.getElementById('tempResult').innerHTML = '<p style="color: red;">Please enter a temperature</p>';
        return;
    }
    
    let celsius;
    
    // Convert to Celsius first
    if (from === 'C') celsius = amount;
    else if (from === 'F') celsius = (amount - 32) * 5/9;
    else if (from === 'K') celsius = amount - 273.15;
    
    // Convert from Celsius to target
    let result;
    if (to === 'C') result = celsius;
    else if (to === 'F') result = celsius * 9/5 + 32;
    else if (to === 'K') result = celsius + 273.15;
    
    document.getElementById('tempResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount}°${from} = ${result.toFixed(2)}°${to}</p>
    `;
}

function convertVolume() {
    const amount = parseFloat(document.getElementById('volumeAmount').value);
    const from = document.getElementById('volumeFrom').value;
    const to = document.getElementById('volumeTo').value;
    
    if (!amount) {
        document.getElementById('volumeResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    const inLiters = amount * volumeFactors[from];
    const result = inLiters / volumeFactors[to];
    
    document.getElementById('volumeResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount} ${from} = ${result.toFixed(6)} ${to}</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
