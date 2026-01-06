// Graphing Calculator Module
import { evaluateExpression } from '../../js/utils.js';

export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator graphing-calc">
                <h2 class="calc-title">Graphing Calculator</h2>
                
                <div class="form-group">
                    <label>Function (use 'x' as variable)</label>
                    <input type="text" id="graphFunction" placeholder="e.g., x^2, sin(x), 2*x+1">
                </div>
                
                <div class="graph-controls">
                    <div class="form-group inline">
                        <label>X Min:</label>
                        <input type="number" id="xMin" value="-10" step="1">
                    </div>
                    <div class="form-group inline">
                        <label>X Max:</label>
                        <input type="number" id="xMax" value="10" step="1">
                    </div>
                    <div class="form-group inline">
                        <label>Y Min:</label>
                        <input type="number" id="yMin" value="-10" step="1">
                    </div>
                    <div class="form-group inline">
                        <label>Y Max:</label>
                        <input type="number" id="yMax" value="10" step="1">
                    </div>
                </div>
                
                <button class="btn calculate-btn" id="plotBtn">Plot Graph</button>
                <button class="btn clear" id="clearGraphBtn">Clear</button>
                
                <div class="graph-container">
                    <canvas id="graphCanvas" width="600" height="400"></canvas>
                </div>
                
                <div class="graph-info">
                    <p>Examples: x^2, sin(x), cos(x), tan(x), sqrt(x), abs(x), log(x), exp(x)</p>
                    <p>Operations: +, -, *, /, ^</p>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    document.getElementById('plotBtn')?.addEventListener('click', plotGraph);
    document.getElementById('clearGraphBtn')?.addEventListener('click', clearGraph);
}

function plotGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const funcStr = document.getElementById('graphFunction').value;
    
    if (!funcStr) {
        alert('Please enter a function');
        return;
    }
    
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
    
    try {
        plotFunction(ctx, funcStr, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
    } catch (error) {
        alert('Error plotting function: ' + error.message);
    }
}

function drawAxes(ctx, width, height, xMin, xMax, yMin, yMax) {
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);
    const xZero = -xMin * xScale;
    const yZero = yMax * yScale;
    
    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
        const x = xZero + i * xScale;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i++) {
        const y = yZero - i * yScale;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Axes
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, height);
    ctx.stroke();
}

function plotFunction(ctx, funcStr, width, height, xMin, xMax, yMin, yMax) {
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);
    const xZero = -xMin * xScale;
    const yZero = yMax * yScale;
    
    let processedFunc = funcStr
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/exp/g, 'Math.exp')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![0-9])/g, 'Math.E');
    
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    const step = (xMax - xMin) / width;
    
    for (let x = xMin; x <= xMax; x += step) {
        try {
            const func = new Function('x', 'return ' + processedFunc);
            const y = func(x);
            
            if (isFinite(y) && y >= yMin && y <= yMax) {
                const canvasX = xZero + x * xScale;
                const canvasY = yZero - y * yScale;
                
                if (firstPoint) {
                    ctx.moveTo(canvasX, canvasY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            } else {
                firstPoint = true;
            }
        } catch (e) {
            firstPoint = true;
        }
    }
    
    ctx.stroke();
}

function clearGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    
    drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, yMin, yMax);
}

export function cleanup() {
    // Cleanup if needed
}
