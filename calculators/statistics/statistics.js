// Statistics Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator stats-calc">
                <h2 class="calc-title">Statistics Calculator</h2>
                
                <div class="form-group">
                    <label>Enter Numbers (comma-separated)</label>
                    <textarea id="statsNumbers" rows="5" placeholder="e.g., 5, 10, 15, 20, 25"></textarea>
                </div>
                
                <button class="btn calculate-btn" id="calcStatsBtn">Calculate Statistics</button>
                
                <div class="result-box" id="statsResult"></div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    document.getElementById('calcStatsBtn')?.addEventListener('click', calculateStatistics);
}

function calculateStatistics() {
    const input = document.getElementById('statsNumbers').value;
    
    if (!input.trim()) {
        document.getElementById('statsResult').innerHTML = '<p style="color: red;">Please enter numbers</p>';
        return;
    }
    
    const numbers = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        document.getElementById('statsResult').innerHTML = '<p style="color: red;">No valid numbers found</p>';
        return;
    }
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    const median = n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    
    const frequency = {};
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
    const mode = modes.length === n ? 'No mode' : modes.join(', ');
    
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    
    document.getElementById('statsResult').innerHTML = `
        <h3>Statistical Results</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <strong>Count:</strong> ${n}
            </div>
            <div class="stat-item">
                <strong>Sum:</strong> ${sum.toFixed(2)}
            </div>
            <div class="stat-item">
                <strong>Mean:</strong> ${mean.toFixed(4)}
            </div>
            <div class="stat-item">
                <strong>Median:</strong> ${median.toFixed(4)}
            </div>
            <div class="stat-item">
                <strong>Mode:</strong> ${mode}
            </div>
            <div class="stat-item">
                <strong>Std Deviation:</strong> ${stdDev.toFixed(4)}
            </div>
            <div class="stat-item">
                <strong>Variance:</strong> ${variance.toFixed(4)}
            </div>
            <div class="stat-item">
                <strong>Min:</strong> ${min}
            </div>
            <div class="stat-item">
                <strong>Max:</strong> ${max}
            </div>
            <div class="stat-item">
                <strong>Range:</strong> ${range}
            </div>
        </div>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
