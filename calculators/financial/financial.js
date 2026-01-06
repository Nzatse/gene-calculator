// Financial Calculator Module
import { escapeHtml } from '../../js/utils.js';

export async function render(container) {
    container.innerHTML = `
        <div class="calculator-wrapper single">
            <div class="calculator financial-calc">
                <h2 class="calc-title">Financial Calculator</h2>
                
                <div class="financial-tabs">
                    <button class="mini-tab active" data-calc="loan">Loan</button>
                    <button class="mini-tab" data-calc="mortgage">Mortgage</button>
                    <button class="mini-tab" data-calc="investment">Investment</button>
                    <button class="mini-tab" data-calc="savings">Savings</button>
                </div>

                <!-- Loan Calculator -->
                <div class="financial-panel active" id="loan-panel">
                    <div class="form-group">
                        <label>Loan Amount ($)</label>
                        <input type="number" id="loanAmount" placeholder="10000">
                    </div>
                    <div class="form-group">
                        <label>Interest Rate (%)</label>
                        <input type="number" id="loanRate" placeholder="5.5" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Loan Term (years)</label>
                        <input type="number" id="loanTerm" placeholder="5">
                    </div>
                    <button class="btn calculate-btn" id="calcLoanBtn">Calculate</button>
                    <div class="result-box" id="loanResult"></div>
                </div>

                <!-- Mortgage Calculator -->
                <div class="financial-panel" id="mortgage-panel">
                    <div class="form-group">
                        <label>Home Price ($)</label>
                        <input type="number" id="homePrice" placeholder="300000">
                    </div>
                    <div class="form-group">
                        <label>Down Payment ($)</label>
                        <input type="number" id="downPayment" placeholder="60000">
                    </div>
                    <div class="form-group">
                        <label>Interest Rate (%)</label>
                        <input type="number" id="mortgageRate" placeholder="3.5" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Loan Term (years)</label>
                        <input type="number" id="mortgageTerm" placeholder="30">
                    </div>
                    <button class="btn calculate-btn" id="calcMortgageBtn">Calculate</button>
                    <div class="result-box" id="mortgageResult"></div>
                </div>

                <!-- Investment Calculator -->
                <div class="financial-panel" id="investment-panel">
                    <div class="form-group">
                        <label>Initial Investment ($)</label>
                        <input type="number" id="initialInvestment" placeholder="5000">
                    </div>
                    <div class="form-group">
                        <label>Monthly Contribution ($)</label>
                        <input type="number" id="monthlyContribution" placeholder="200">
                    </div>
                    <div class="form-group">
                        <label>Annual Return (%)</label>
                        <input type="number" id="returnRate" placeholder="7" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Investment Period (years)</label>
                        <input type="number" id="investmentYears" placeholder="10">
                    </div>
                    <button class="btn calculate-btn" id="calcInvestmentBtn">Calculate</button>
                    <div class="result-box" id="investmentResult"></div>
                </div>

                <!-- Savings Calculator -->
                <div class="financial-panel" id="savings-panel">
                    <div class="form-group">
                        <label>Initial Deposit ($)</label>
                        <input type="number" id="initialDeposit" placeholder="1000">
                    </div>
                    <div class="form-group">
                        <label>Monthly Deposit ($)</label>
                        <input type="number" id="monthlyDeposit" placeholder="100">
                    </div>
                    <div class="form-group">
                        <label>Interest Rate (%)</label>
                        <input type="number" id="savingsRate" placeholder="2.5" step="0.1">
                    </div>
                    <div class="form-group">
                        <label>Time Period (years)</label>
                        <input type="number" id="savingsYears" placeholder="5">
                    </div>
                    <button class="btn calculate-btn" id="calcSavingsBtn">Calculate</button>
                    <div class="result-box" id="savingsResult"></div>
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
            document.getElementById(calcType + '-panel').classList.add('active');
        });
    });

    document.getElementById('calcLoanBtn')?.addEventListener('click', calculateLoan);
    document.getElementById('calcMortgageBtn')?.addEventListener('click', calculateMortgage);
    document.getElementById('calcInvestmentBtn')?.addEventListener('click', calculateInvestment);
    document.getElementById('calcSavingsBtn')?.addEventListener('click', calculateSavings);
}

function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
    const term = parseFloat(document.getElementById('loanTerm').value) * 12;
    
    if (!amount || !rate || !term) {
        document.getElementById('loanResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;
    
    document.getElementById('loanResult').innerHTML = `
        <h3>Loan Summary</h3>
        <p class="highlight">Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Total Payment: $${totalPayment.toFixed(2)}</p>
        <p>Total Interest: $${totalInterest.toFixed(2)}</p>
        <p>Principal: $${amount.toFixed(2)}</p>
    `;
}

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value);
    const rate = parseFloat(document.getElementById('mortgageRate').value) / 100 / 12;
    const term = parseFloat(document.getElementById('mortgageTerm').value) * 12;
    
    if (!homePrice || !downPayment || !rate || !term) {
        document.getElementById('mortgageResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const loanAmount = homePrice - downPayment;
    const monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loanAmount;
    
    document.getElementById('mortgageResult').innerHTML = `
        <h3>Mortgage Summary</h3>
        <p class="highlight">Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Loan Amount: $${loanAmount.toFixed(2)}</p>
        <p>Down Payment: $${downPayment.toFixed(2)} (${((downPayment/homePrice)*100).toFixed(1)}%)</p>
        <p>Total Payment: $${totalPayment.toFixed(2)}</p>
        <p>Total Interest: $${totalInterest.toFixed(2)}</p>
    `;
}

function calculateInvestment() {
    const initial = parseFloat(document.getElementById('initialInvestment').value);
    const monthly = parseFloat(document.getElementById('monthlyContribution').value);
    const rate = parseFloat(document.getElementById('returnRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('investmentYears').value);
    const months = years * 12;
    
    if (isNaN(initial) || isNaN(monthly) || !rate || !years) {
        document.getElementById('investmentResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const fvInitial = initial * Math.pow(1 + rate, months);
    const fvMonthly = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    
    const totalValue = fvInitial + fvMonthly;
    const totalContributions = initial + (monthly * months);
    const totalEarnings = totalValue - totalContributions;
    
    document.getElementById('investmentResult').innerHTML = `
        <h3>Investment Projection</h3>
        <p class="highlight">Future Value: $${totalValue.toFixed(2)}</p>
        <p>Total Contributions: $${totalContributions.toFixed(2)}</p>
        <p>Total Earnings: $${totalEarnings.toFixed(2)}</p>
        <p>Return on Investment: ${((totalEarnings/totalContributions)*100).toFixed(1)}%</p>
    `;
}

function calculateSavings() {
    const initial = parseFloat(document.getElementById('initialDeposit').value);
    const monthly = parseFloat(document.getElementById('monthlyDeposit').value);
    const rate = parseFloat(document.getElementById('savingsRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('savingsYears').value);
    const months = years * 12;
    
    if (isNaN(initial) || isNaN(monthly) || !rate || !years) {
        document.getElementById('savingsResult').innerHTML = '<p style="color: red;">Please fill all fields</p>';
        return;
    }
    
    const fvInitial = initial * Math.pow(1 + rate, months);
    const fvMonthly = monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    
    const totalSavings = fvInitial + fvMonthly;
    const totalDeposits = initial + (monthly * months);
    const interestEarned = totalSavings - totalDeposits;
    
    document.getElementById('savingsResult').innerHTML = `
        <h3>Savings Summary</h3>
        <p class="highlight">Total Savings: $${totalSavings.toFixed(2)}</p>
        <p>Total Deposits: $${totalDeposits.toFixed(2)}</p>
        <p>Interest Earned: $${interestEarned.toFixed(2)}</p>
    `;
}

export function cleanup() {
    // Cleanup if needed
}
