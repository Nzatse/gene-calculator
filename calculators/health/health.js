// Health Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator health-calc">
                <h2 class="calc-title">Health Calculator</h2>
                
                <div class="health-tabs">
                    <button class="mini-tab active" data-calc="bmi">BMI</button>
                    <button class="mini-tab" data-calc="calories">Calories</button>
                    <button class="mini-tab" data-calc="bodyfat">Body Fat %</button>
                </div>

                <!-- BMI Calculator -->
                <div class="health-panel active" id="bmi-panel">
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="bmiWeight" placeholder="Enter weight" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="number" id="bmiHeight" placeholder="Enter height" step="0.1">
                    </div>
                    <button class="btn calculate-btn" id="calcBmiBtn">Calculate BMI</button>
                </div>

                <!-- Calories Calculator -->
                <div class="health-panel" id="calories-panel">
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="caloriesAge" placeholder="Enter age">
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="caloriesGender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="caloriesWeight" placeholder="Enter weight" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="number" id="caloriesHeight" placeholder="Enter height" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Activity Level</label>
                        <select id="activityLevel">
                            <option value="1.2">Sedentary (little or no exercise)</option>
                            <option value="1.375">Lightly active (1-3 days/week)</option>
                            <option value="1.55">Moderately active (3-5 days/week)</option>
                            <option value="1.725">Very active (6-7 days/week)</option>
                            <option value="1.9">Extra active (physical job or training)</option>
                        </select>
                    </div>
                    <button class="btn calculate-btn" id="calcCaloriesBtn">Calculate Calories</button>
                </div>

                <!-- Body Fat Calculator -->
                <div class="health-panel" id="bodyfat-panel">
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="bodyfatGender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="bodyfatWeight" placeholder="Enter weight" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="number" id="bodyfatHeight" placeholder="Enter height" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="bodyfatAge" placeholder="Enter age">
                    </div>
                    <button class="btn calculate-btn" id="calcBodyfatBtn">Calculate Body Fat</button>
                </div>
                
                <div class="result-box" id="healthResult"></div>
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
            
            const calcType = tab.dataset.calc;
            document.querySelectorAll('.health-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(calcType + '-panel').classList.add('active');
            document.getElementById('healthResult').innerHTML = '';
        });
    });

    document.getElementById('calcBmiBtn')?.addEventListener('click', calculateBMI);
    document.getElementById('calcCaloriesBtn')?.addEventListener('click', calculateCalories);
    document.getElementById('calcBodyfatBtn')?.addEventListener('click', calculateBodyFat);
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // convert to meters
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        document.getElementById('healthResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    const bmi = weight / (height * height);
    
    let category, color;
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3b82f6';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#10b981';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#f59e0b';
    } else {
        category = 'Obese';
        color = '#ef4444';
    }
    
    document.getElementById('healthResult').innerHTML = `
        <h3>BMI Result</h3>
        <p class="highlight" style="color: ${color};">${bmi.toFixed(1)}</p>
        <p><strong>Category:</strong> ${category}</p>
        <div class="bmi-ranges">
            <h4>BMI Ranges:</h4>
            <p>Underweight: &lt; 18.5</p>
            <p>Normal: 18.5 - 24.9</p>
            <p>Overweight: 25 - 29.9</p>
            <p>Obese: ≥ 30</p>
        </div>
    `;
}

function calculateCalories() {
    const age = parseInt(document.getElementById('caloriesAge').value);
    const gender = document.getElementById('caloriesGender').value;
    const weight = parseFloat(document.getElementById('caloriesWeight').value);
    const height = parseFloat(document.getElementById('caloriesHeight').value);
    const activity = parseFloat(document.getElementById('activityLevel').value);
    
    if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
        document.getElementById('healthResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    const tdee = bmr * activity;
    
    document.getElementById('healthResult').innerHTML = `
        <h3>Daily Calorie Needs</h3>
        <p><strong>BMR (Basal Metabolic Rate):</strong> ${bmr.toFixed(0)} calories/day</p>
        <p class="highlight"><strong>TDEE (Total Daily Energy Expenditure):</strong> ${tdee.toFixed(0)} calories/day</p>
        <div class="calorie-goals">
            <h4>Goals:</h4>
            <p><strong>Maintain weight:</strong> ${tdee.toFixed(0)} cal/day</p>
            <p><strong>Mild weight loss:</strong> ${(tdee - 250).toFixed(0)} cal/day (0.25 kg/week)</p>
            <p><strong>Weight loss:</strong> ${(tdee - 500).toFixed(0)} cal/day (0.5 kg/week)</p>
            <p><strong>Extreme weight loss:</strong> ${(tdee - 1000).toFixed(0)} cal/day (1 kg/week)</p>
        </div>
    `;
}

function calculateBodyFat() {
    const gender = document.getElementById('bodyfatGender').value;
    const weight = parseFloat(document.getElementById('bodyfatWeight').value);
    const height = parseFloat(document.getElementById('bodyfatHeight').value);
    const age = parseInt(document.getElementById('bodyfatAge').value);
    
    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
        document.getElementById('healthResult').innerHTML = '<p style="color: red;">Please enter valid values</p>';
        return;
    }
    
    // BMI-based body fat estimation (US Navy method approximation)
    const bmi = weight / ((height / 100) * (height / 100));
    
    let bodyFat;
    if (gender === 'male') {
        bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
    } else {
        bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
    }
    
    let category;
    if (gender === 'male') {
        if (bodyFat < 6) category = 'Essential fat';
        else if (bodyFat < 14) category = 'Athletes';
        else if (bodyFat < 18) category = 'Fitness';
        else if (bodyFat < 25) category = 'Average';
        else category = 'Obese';
    } else {
        if (bodyFat < 14) category = 'Essential fat';
        else if (bodyFat < 21) category = 'Athletes';
        else if (bodyFat < 25) category = 'Fitness';
        else if (bodyFat < 32) category = 'Average';
        else category = 'Obese';
    }
    
    const leanMass = weight * (1 - bodyFat / 100);
    const fatMass = weight - leanMass;
    
    document.getElementById('healthResult').innerHTML = `
        <h3>Body Fat Estimate</h3>
        <p class="highlight">${bodyFat.toFixed(1)}%</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Fat Mass:</strong> ${fatMass.toFixed(1)} kg</p>
        <p><strong>Lean Mass:</strong> ${leanMass.toFixed(1)} kg</p>
        <p class="note">Note: This is an estimation. For accurate results, consult a healthcare professional.</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
