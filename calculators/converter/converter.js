// Unit Converter Module
import { escapeHtml } from '../../js/utils.js';

/**
 * Currency Exchange Rates
 * These rates are fetched from a live API and cached for 24 hours.
 * Default values are used as fallback if API is unavailable.
 */
let currencyRates = {
    USD: 1.00000,      // US Dollar (base currency)
    EUR: 0.92180,      // Euro
    GBP: 0.78956,      // British Pound
    JPY: 149.52000,    // Japanese Yen
    CNY: 7.24350,      // Chinese Yuan
    CAD: 1.35820,      // Canadian Dollar
    AUD: 1.51730,      // Australian Dollar
    CHF: 0.88120,      // Swiss Franc
    INR: 83.12500      // Indian Rupee
};

// Tracks when rates were last updated from the API
let lastRateUpdate = null;

/**
 * Live Currency API Configuration
 * Using ExchangeRate-API's free open endpoint (no key required)
 * 
 * Limitations: ~100 requests per month on free tier
 * For production: Get free API key at https://www.exchangerate-api.com/
 * Then use: https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD
 * 
 * Free tier with key: 1,500 requests/month
 * Updates: Daily from central banks worldwide
 */
const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/USD';

/**
 * Fetches live currency exchange rates from API with smart caching
 * 
 * Caching Strategy:
 * 1. Check localStorage for cached rates first
 * 2. If cache exists and is less than 24 hours old, use cached rates
 * 3. If cache is stale or doesn't exist, fetch fresh rates from API
 * 4. Cache new rates for 24 hours to minimize API calls
 * 
 * Error Handling:
 * - If API fails, falls back to cached or default rates
 * - User can still use converter with last known good rates
 * - Console warning logged for debugging
 */
async function fetchLiveCurrencyRates() {
    try {
        // Step 1: Check if we have cached rates from previous session
        const cached = localStorage.getItem('currencyRatesCache');
        if (cached) {
            const { rates, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            
            // Use cache if less than 24 hours old (86,400,000 milliseconds)
            if (age < 24 * 60 * 60 * 1000) {
                currencyRates = rates;
                lastRateUpdate = new Date(timestamp);
                console.log('Using cached currency rates');
                return;
            }
        }

        // Step 2: Cache is stale or doesn't exist, fetch fresh rates
        console.log('Fetching live currency rates...');
        const response = await fetch(CURRENCY_API_URL);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Step 3: Verify API response and update rates
        if (data.result === 'success') {
            // Update currency rates object with live data
            // Uses fallback to existing rate if API doesn't provide specific currency
            currencyRates = {
                USD: 1.00000,  // Base currency always 1
                EUR: data.rates.EUR || currencyRates.EUR,
                GBP: data.rates.GBP || currencyRates.GBP,
                JPY: data.rates.JPY || currencyRates.JPY,
                CNY: data.rates.CNY || currencyRates.CNY,
                CAD: data.rates.CAD || currencyRates.CAD,
                AUD: data.rates.AUD || currencyRates.AUD,
                CHF: data.rates.CHF || currencyRates.CHF,
                INR: data.rates.INR || currencyRates.INR
            };
            
            lastRateUpdate = new Date();
            console.log('Live rates updated successfully');
            
            // Step 4: Cache the fresh rates for 24 hours
            localStorage.setItem('currencyRatesCache', JSON.stringify({
                rates: currencyRates,
                timestamp: Date.now()
            }));
        }
    } catch (error) {
        // Graceful degradation: continue with cached or default rates
        console.warn('Failed to fetch live currency rates, using cached/default rates:', error);
        // Converter will still work with existing rates
    }
}

// Length conversion factors (to meters) - Exact scientific values
const lengthFactors = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34400,      // International mile
    yd: 0.91440,         // International yard
    ft: 0.30480,         // International foot
    in: 0.02540          // International inch
};

// Weight conversion factors (to kilograms) - Exact scientific values
const weightFactors = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,      // Avoirdupois pound (exact)
    oz: 0.028349523125,  // Avoirdupois ounce (exact)
    ton: 1000            // Metric ton
};

// Volume conversion factors (to liters) - US customary measures
const volumeFactors = {
    l: 1,
    ml: 0.001,
    gal: 3.78541178,     // US liquid gallon
    qt: 0.946352946,     // US liquid quart
    pt: 0.473176473,     // US liquid pint
    cup: 0.236588236,    // US legal cup
    floz: 0.0295735296   // US fluid ounce
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
                    <div id="rateUpdateStatus" style="text-align: center; padding: 10px; font-size: 12px; color: #718096;">
                        <span id="rateStatusText">Loading live rates...</span>
                    </div>
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
    
    // Fetch live currency rates
    fetchLiveCurrencyRates().then(() => {
        updateRateStatus();
    });
    
    attachEventListeners();
}

/**
 * Updates the UI status indicator showing when rates were last fetched
 * 
 * Displays:
 * - "✅ Live rates loaded (X min ago)" - if rates less than 1 hour old (green)
 * - "✅ Live rates loaded (Xh ago)" - if rates 1+ hours old (green)
 * - "⚠️ Using cached rates" - if no recent update timestamp (yellow)
 * 
 * This provides transparency to users about data freshness
 */
function updateRateStatus() {
    const statusEl = document.getElementById('rateStatusText');
    if (!statusEl) return;
    
    if (lastRateUpdate) {
        // Calculate time elapsed since last update
        const timeAgo = Math.floor((Date.now() - lastRateUpdate.getTime()) / 1000 / 60);
        
        if (timeAgo < 60) {
            // Show minutes if less than 1 hour
            statusEl.innerHTML = `✅ Live rates loaded (${timeAgo} min ago)`;
        } else {
            // Show hours if 1 hour or more
            const hoursAgo = Math.floor(timeAgo / 60);
            statusEl.innerHTML = `✅ Live rates loaded (${hoursAgo}h ago)`;
        }
        statusEl.style.color = '#10b981';  // Green - fresh data
    } else {
        // No recent update, using fallback rates
        statusEl.innerHTML = '⚠️ Using cached rates';
        statusEl.style.color = '#f59e0b';  // Yellow - warning
    }
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

/**
 * Converts currency using live exchange rates
 * 
 * Conversion Method:
 * 1. Convert from source currency to USD (base currency)
 * 2. Convert from USD to target currency
 * 
 * Example: 100 EUR to JPY
 * - EUR rate = 0.92 (1 USD = 0.92 EUR)
 * - JPY rate = 150 (1 USD = 150 JPY)
 * - 100 EUR / 0.92 = 108.70 USD
 * - 108.70 USD * 150 = 16,304.35 JPY
 * 
 * Accuracy: Results shown to 5 decimal places for precision
 */
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;
    
    // Validate input
    if (!amount) {
        document.getElementById('currencyResult').innerHTML = '<p style="color: red;">Please enter an amount</p>';
        return;
    }
    
    // Two-step conversion through USD (base currency)
    const amountInUSD = amount / currencyRates[from];    // Step 1: Convert to USD
    const result = amountInUSD * currencyRates[to];       // Step 2: Convert to target
    
    // Show when rates were last updated for transparency
    const updateInfo = lastRateUpdate 
        ? `Last updated: ${lastRateUpdate.toLocaleString()}`
        : 'Using cached rates';
    
    // Display results with 5 decimal precision
    document.getElementById('currencyResult').innerHTML = `
        <h3>Conversion Result</h3>
        <p class="highlight">${amount.toFixed(2)} ${from} = ${result.toFixed(5)} ${to}</p>
        <p>Exchange Rate: 1 ${from} = ${(currencyRates[to] / currencyRates[from]).toFixed(5)} ${to}</p>
        <p style="font-size: 12px; color: #718096; margin-top: 10px;">
            ${updateInfo}<br>
            Powered by <a href="https://www.exchangerate-api.com" target="_blank">ExchangeRate-API</a>
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
        <p class="highlight">${amount} ${from} = ${result.toFixed(5)} ${to}</p>
        <p style="font-size: 12px; color: #718096;">Conversion factor: 1 ${from} = ${(lengthFactors[from] / lengthFactors[to]).toFixed(8)} ${to}</p>
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
        <p class="highlight">${amount} ${from} = ${result.toFixed(5)} ${to}</p>
        <p style="font-size: 12px; color: #718096;">Conversion factor: 1 ${from} = ${(weightFactors[from] / weightFactors[to]).toFixed(8)} ${to}</p>
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
        <p class="highlight">${amount}°${from} = ${result.toFixed(5)}°${to}</p>
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
        <p class="highlight">${amount} ${from} = ${result.toFixed(5)} ${to}</p>
        <p style="font-size: 12px; color: #718096;">Conversion factor: 1 ${from} = ${(volumeFactors[from] / volumeFactors[to]).toFixed(8)} ${to}</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
