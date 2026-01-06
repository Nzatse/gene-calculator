// Date & Time Calculator Module
export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator datetime-calc">
                <h2 class="calc-title">Date & Time Calculator</h2>
                
                <div class="datetime-tabs">
                    <button class="mini-tab active" data-calc="difference">Date Difference</button>
                    <button class="mini-tab" data-calc="add">Add/Subtract Days</button>
                    <button class="mini-tab" data-calc="age">Age Calculator</button>
                </div>

                <!-- Date Difference -->
                <div class="datetime-panel active" id="difference-panel">
                    <div class="form-group">
                        <label>From Date</label>
                        <input type="date" id="fromDate">
                    </div>
                    <div class="form-group">
                        <label>To Date</label>
                        <input type="date" id="toDate">
                    </div>
                    <button class="btn calculate-btn" id="calcDiffBtn">Calculate Difference</button>
                </div>

                <!-- Add/Subtract Days -->
                <div class="datetime-panel" id="add-panel">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" id="startDate">
                    </div>
                    <div class="form-group">
                        <label>Days to Add/Subtract</label>
                        <input type="number" id="daysToAdd" placeholder="Use negative for subtract">
                    </div>
                    <button class="btn calculate-btn" id="calcAddBtn">Calculate</button>
                </div>

                <!-- Age Calculator -->
                <div class="datetime-panel" id="age-panel">
                    <div class="form-group">
                        <label>Birth Date</label>
                        <input type="date" id="birthDate">
                    </div>
                    <button class="btn calculate-btn" id="calcAgeBtn">Calculate Age</button>
                </div>
                
                <div class="result-box" id="datetimeResult"></div>
            </div>
        </div>
    `;
    
    setDefaultDates();
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.mini-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const calcType = tab.dataset.calc;
            document.querySelectorAll('.datetime-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(calcType + '-panel').classList.add('active');
            document.getElementById('datetimeResult').innerHTML = '';
        });
    });

    document.getElementById('calcDiffBtn')?.addEventListener('click', calculateDateDifference);
    document.getElementById('calcAddBtn')?.addEventListener('click', addSubtractDays);
    document.getElementById('calcAgeBtn')?.addEventListener('click', calculateAge);
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fromDate').value = today;
    document.getElementById('toDate').value = today;
    document.getElementById('startDate').value = today;
}

function calculateDateDifference() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);
    
    if (!document.getElementById('fromDate').value || !document.getElementById('toDate').value) {
        document.getElementById('datetimeResult').innerHTML = '<p style="color: red;">Please select both dates</p>';
        return;
    }
    
    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);
    
    document.getElementById('datetimeResult').innerHTML = `
        <h3>Date Difference</h3>
        <p class="highlight">${diffDays} days</p>
        <p>${years} years, ${months} months, ${days} days</p>
        <p>${Math.floor(diffDays / 7)} weeks</p>
        <p>${Math.floor(diffTime / (1000 * 60 * 60))} hours</p>
    `;
}

function addSubtractDays() {
    const startDate = new Date(document.getElementById('startDate').value);
    const daysToAdd = parseInt(document.getElementById('daysToAdd').value);
    
    if (!document.getElementById('startDate').value || isNaN(daysToAdd)) {
        document.getElementById('datetimeResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const resultDate = new Date(startDate);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    document.getElementById('datetimeResult').innerHTML = `
        <h3>Result Date</h3>
        <p class="highlight">${resultDate.toLocaleDateString('en-US', options)}</p>
        <p>${resultDate.toISOString().split('T')[0]}</p>
        <p>${daysToAdd > 0 ? 'Added' : 'Subtracted'} ${Math.abs(daysToAdd)} days</p>
    `;
}

function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    
    if (!document.getElementById('birthDate').value) {
        document.getElementById('datetimeResult').innerHTML = '<p style="color: red;">Please select birth date</p>';
        return;
    }
    
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    
    document.getElementById('datetimeResult').innerHTML = `
        <h3>Your Age</h3>
        <p class="highlight">${years} years old</p>
        <p>${years} years, ${months} months, ${days} days</p>
        <p>${totalMonths} months</p>
        <p>${totalDays} days</p>
        <p>${Math.floor(totalDays / 7)} weeks</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
