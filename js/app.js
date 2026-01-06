// Main Application - Tab Management & Dynamic Loading
// This file handles navigation between calculators and loads them on demand

class CalculatorApp {
    constructor() {
        this.currentCalculator = null;
        this.loadedCalculators = new Map();
        this.calculatorContainer = document.getElementById('calculator-container');
    }

    async init() {
        this.attachTabListeners();
        // Load the first calculator (scientific) by default
        await this.loadCalculator('scientific');
    }

    attachTabListeners() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const calculatorName = btn.dataset.tab;
                
                // Update active tab
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load calculator
                await this.loadCalculator(calculatorName);
            });
        });
    }

    async loadCalculator(name) {
        try {
            // Show loading state
            this.calculatorContainer.innerHTML = '<div class="loading">Loading calculator...</div>';
            
            // Check if calculator is already loaded in memory
            if (!this.loadedCalculators.has(name)) {
                // Dynamically import the calculator module
                const module = await import(`../calculators/${name}/${name}.js`);
                this.loadedCalculators.set(name, module);
            }
            
            // Get the module and initialize it
            const calculator = this.loadedCalculators.get(name);
            await calculator.render(this.calculatorContainer);
            
            // Clean up previous calculator if exists
            if (this.currentCalculator && this.currentCalculator !== name) {
                const prevModule = this.loadedCalculators.get(this.currentCalculator);
                if (prevModule && prevModule.cleanup) {
                    prevModule.cleanup();
                }
            }
            
            this.currentCalculator = name;
            
        } catch (error) {
            console.error(`Failed to load calculator: ${name}`, error);
            this.calculatorContainer.innerHTML = `
                <div class="error">
                    <h2>Error Loading Calculator</h2>
                    <p>Failed to load ${name} calculator. Please try again.</p>
                    <p style="color: #e53e3e; font-size: 14px;">${error.message}</p>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new CalculatorApp();
    app.init();
});

export { CalculatorApp };
