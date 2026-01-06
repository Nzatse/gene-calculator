// Geometry Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator geometry-calc">
                <h2 class="calc-title">Geometry Calculator</h2>
                
                <div class="geometry-tabs">
                    <button class="mini-tab active" data-shape="circle">Circle</button>
                    <button class="mini-tab" data-shape="triangle">Triangle</button>
                    <button class="mini-tab" data-shape="rectangle">Rectangle</button>
                    <button class="mini-tab" data-shape="sphere">Sphere</button>
                    <button class="mini-tab" data-shape="cylinder">Cylinder</button>
                </div>

                <!-- Circle -->
                <div class="geometry-panel active" id="circle-panel">
                    <div class="form-group">
                        <label>Radius</label>
                        <input type="number" id="circleRadius" placeholder="Enter radius" step="0.01">
                    </div>
                    <button class="btn calculate-btn" id="calcCircleBtn">Calculate</button>
                </div>

                <!-- Triangle -->
                <div class="geometry-panel" id="triangle-panel">
                    <div class="form-group">
                        <label>Base</label>
                        <input type="number" id="triangleBase" placeholder="Enter base" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Height</label>
                        <input type="number" id="triangleHeight" placeholder="Enter height" step="0.01">
                    </div>
                    <button class="btn calculate-btn" id="calcTriangleBtn">Calculate</button>
                </div>

                <!-- Rectangle -->
                <div class="geometry-panel" id="rectangle-panel">
                    <div class="form-group">
                        <label>Length</label>
                        <input type="number" id="rectLength" placeholder="Enter length" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Width</label>
                        <input type="number" id="rectWidth" placeholder="Enter width" step="0.01">
                    </div>
                    <button class="btn calculate-btn" id="calcRectBtn">Calculate</button>
                </div>

                <!-- Sphere -->
                <div class="geometry-panel" id="sphere-panel">
                    <div class="form-group">
                        <label>Radius</label>
                        <input type="number" id="sphereRadius" placeholder="Enter radius" step="0.01">
                    </div>
                    <button class="btn calculate-btn" id="calcSphereBtn">Calculate</button>
                </div>

                <!-- Cylinder -->
                <div class="geometry-panel" id="cylinder-panel">
                    <div class="form-group">
                        <label>Radius</label>
                        <input type="number" id="cylinderRadius" placeholder="Enter radius" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Height</label>
                        <input type="number" id="cylinderHeight" placeholder="Enter height" step="0.01">
                    </div>
                    <button class="btn calculate-btn" id="calcCylinderBtn">Calculate</button>
                </div>
                
                <div class="result-box" id="geometryResult"></div>
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
            
            const shape = tab.dataset.shape;
            document.querySelectorAll('.geometry-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(shape + '-panel').classList.add('active');
            document.getElementById('geometryResult').innerHTML = '';
        });
    });

    document.getElementById('calcCircleBtn')?.addEventListener('click', calculateCircle);
    document.getElementById('calcTriangleBtn')?.addEventListener('click', calculateTriangle);
    document.getElementById('calcRectBtn')?.addEventListener('click', calculateRectangle);
    document.getElementById('calcSphereBtn')?.addEventListener('click', calculateSphere);
    document.getElementById('calcCylinderBtn')?.addEventListener('click', calculateCylinder);
}

function calculateCircle() {
    const radius = parseFloat(document.getElementById('circleRadius').value);
    
    if (!radius || radius <= 0) {
        document.getElementById('geometryResult').innerHTML = '<p style="color: red;">Please enter a valid radius</p>';
        return;
    }
    
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const diameter = 2 * radius;
    
    document.getElementById('geometryResult').innerHTML = `
        <h3>Circle Measurements</h3>
        <p><strong>Radius:</strong> ${radius}</p>
        <p><strong>Diameter:</strong> ${diameter.toFixed(2)}</p>
        <p class="highlight"><strong>Area:</strong> ${area.toFixed(4)} sq units</p>
        <p><strong>Circumference:</strong> ${circumference.toFixed(4)} units</p>
    `;
}

function calculateTriangle() {
    const base = parseFloat(document.getElementById('triangleBase').value);
    const height = parseFloat(document.getElementById('triangleHeight').value);
    
    if (!base || !height || base <= 0 || height <= 0) {
        document.getElementById('geometryResult').innerHTML = '<p style="color: red;">Please enter valid dimensions</p>';
        return;
    }
    
    const area = 0.5 * base * height;
    
    document.getElementById('geometryResult').innerHTML = `
        <h3>Triangle Measurements</h3>
        <p><strong>Base:</strong> ${base}</p>
        <p><strong>Height:</strong> ${height}</p>
        <p class="highlight"><strong>Area:</strong> ${area.toFixed(4)} sq units</p>
    `;
}

function calculateRectangle() {
    const length = parseFloat(document.getElementById('rectLength').value);
    const width = parseFloat(document.getElementById('rectWidth').value);
    
    if (!length || !width || length <= 0 || width <= 0) {
        document.getElementById('geometryResult').innerHTML = '<p style="color: red;">Please enter valid dimensions</p>';
        return;
    }
    
    const area = length * width;
    const perimeter = 2 * (length + width);
    const diagonal = Math.sqrt(length * length + width * width);
    
    document.getElementById('geometryResult').innerHTML = `
        <h3>Rectangle Measurements</h3>
        <p><strong>Length:</strong> ${length}</p>
        <p><strong>Width:</strong> ${width}</p>
        <p class="highlight"><strong>Area:</strong> ${area.toFixed(4)} sq units</p>
        <p><strong>Perimeter:</strong> ${perimeter.toFixed(4)} units</p>
        <p><strong>Diagonal:</strong> ${diagonal.toFixed(4)} units</p>
    `;
}

function calculateSphere() {
    const radius = parseFloat(document.getElementById('sphereRadius').value);
    
    if (!radius || radius <= 0) {
        document.getElementById('geometryResult').innerHTML = '<p style="color: red;">Please enter a valid radius</p>';
        return;
    }
    
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const surfaceArea = 4 * Math.PI * radius * radius;
    const diameter = 2 * radius;
    
    document.getElementById('geometryResult').innerHTML = `
        <h3>Sphere Measurements</h3>
        <p><strong>Radius:</strong> ${radius}</p>
        <p><strong>Diameter:</strong> ${diameter.toFixed(2)}</p>
        <p class="highlight"><strong>Volume:</strong> ${volume.toFixed(4)} cubic units</p>
        <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(4)} sq units</p>
    `;
}

function calculateCylinder() {
    const radius = parseFloat(document.getElementById('cylinderRadius').value);
    const height = parseFloat(document.getElementById('cylinderHeight').value);
    
    if (!radius || !height || radius <= 0 || height <= 0) {
        document.getElementById('geometryResult').innerHTML = '<p style="color: red;">Please enter valid dimensions</p>';
        return;
    }
    
    const volume = Math.PI * radius * radius * height;
    const surfaceArea = 2 * Math.PI * radius * (radius + height);
    const lateralArea = 2 * Math.PI * radius * height;
    
    document.getElementById('geometryResult').innerHTML = `
        <h3>Cylinder Measurements</h3>
        <p><strong>Radius:</strong> ${radius}</p>
        <p><strong>Height:</strong> ${height}</p>
        <p class="highlight"><strong>Volume:</strong> ${volume.toFixed(4)} cubic units</p>
        <p><strong>Surface Area:</strong> ${surfaceArea.toFixed(4)} sq units</p>
        <p><strong>Lateral Area:</strong> ${lateralArea.toFixed(4)} sq units</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
