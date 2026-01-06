/**
 * Gene Calculator Mobile App
 * Mobile-optimized version with sliding menu and touch interactions
 * Shares calculator modules from ../calculators/
 */

// Import utils - path works for both dev and production
import { escapeHtml } from '../js/utils.js';

class MobileCalculatorApp {
    constructor() {
        this.currentCalculator = null;
        this.currentModule = null;
        this.menuOpen = false;
        
        this.container = document.getElementById('calculator-container');
        this.menu = document.getElementById('calculator-menu');
        this.overlay = document.getElementById('menu-overlay');
        this.title = document.getElementById('current-calculator-title');
        
        this.calculators = [
            { id: 'scientific', name: 'Scientific', icon: '🔬', desc: 'Advanced math functions' },
            { id: 'financial', name: 'Financial', icon: '💰', desc: 'Loans & investments' },
            { id: 'graphing', name: 'Graphing', icon: '📊', desc: 'Plot functions' },
            { id: 'programmable', name: 'Programmable', icon: '⚡', desc: 'Custom formulas' },
            { id: 'printing', name: 'Printing', icon: '🖨️', desc: 'Tape calculator' },
            { id: 'converter', name: 'Converter', icon: '🔄', desc: 'Units & currency' },
            { id: 'statistics', name: 'Statistics', icon: '📈', desc: 'Data analysis' },
            { id: 'base', name: 'Base', icon: '1️⃣', desc: 'Binary, hex, octal' },
            { id: 'matrix', name: 'Matrix', icon: '🔢', desc: 'Matrix operations' },
            { id: 'datetime', name: 'Date & Time', icon: '📅', desc: 'Date calculations' },
            { id: 'geometry', name: 'Geometry', icon: '📐', desc: 'Shape calculations' },
            { id: 'health', name: 'Health', icon: '❤️', desc: 'BMI & calories' },
            { id: 'taxtip', name: 'Tax & Tip', icon: '🧾', desc: 'Bill calculator' },
            { id: 'scinotation', name: 'Sci Notation', icon: '🔬', desc: 'Scientific format' },
            { id: 'complex', name: 'Complex', icon: 'ℂ', desc: 'Complex numbers' }
        ];
        
        this.init();
    }

    init() {
        // Menu toggle
        document.getElementById('menu-btn').addEventListener('click', () => this.openMenu());
        document.getElementById('close-menu-btn').addEventListener('click', () => this.closeMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => this.showWelcomeScreen());

        // Calculator selection
        document.querySelectorAll('.calc-menu-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calcType = e.currentTarget.dataset.calc;
                this.loadCalculator(calcType);
                this.closeMenu();
            });
        });

        // Swipe gestures
        this.setupSwipeGestures();

        // Show welcome screen instead of loading a calculator
        this.showWelcomeScreen();
    }

    openMenu() {
        this.menu.classList.add('open');
        this.overlay.classList.add('visible');
        this.menuOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.menu.classList.remove('open');
        this.overlay.classList.remove('visible');
        this.menuOpen = false;
        document.body.style.overflow = '';
    }

    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 100;
        const diff = endX - startX;

        // Swipe right from left edge to open menu
        if (diff > swipeThreshold && startX < 50 && !this.menuOpen) {
            this.openMenu();
        }
        // Swipe left to close menu
        else if (diff < -swipeThreshold && this.menuOpen) {
            this.closeMenu();
        }
    }

    showWelcomeScreen() {
        this.currentCalculator = null;
        this.title.textContent = 'Gene Calculator';
        
        // Hide back button, show menu button
        document.getElementById('back-btn').classList.add('hidden');
        document.getElementById('menu-btn').classList.remove('hidden');

        const calcCards = this.calculators.map(calc => `
            <div class="calculator-card" data-calc="${calc.id}">
                <div class="calc-icon">${calc.icon}</div>
                <div class="calc-name">${calc.name}</div>
                <div class="calc-description">${calc.desc}</div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="welcome-screen">
                <h1>Gene Calculator</h1>
                <p>Choose a calculator to get started</p>
                <div class="calculator-grid">
                    ${calcCards}
                </div>
            </div>
        `;

        // Add event listeners to calculator cards
        this.container.querySelectorAll('.calculator-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const calcType = e.currentTarget.dataset.calc;
                this.loadCalculator(calcType);
            });
        });

        // Update active menu item
        document.querySelectorAll('.calc-menu-item').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    async loadCalculator(calcType) {
        try {
            // Cleanup previous calculator
            if (this.currentModule && typeof this.currentModule.cleanup === 'function') {
                this.currentModule.cleanup();
            }

            // Clear container
            this.container.innerHTML = '<div class="loading">Loading...</div>';

            // Import calculator module from shared calculators folder
            const modulePath = `../calculators/${calcType}/${calcType}.js`;
            this.currentModule = await import(modulePath);

            // Render calculator
            await this.currentModule.render(this.container);

            // Update UI
            this.currentCalculator = calcType;
            this.updateTitle(calcType);
            this.updateActiveMenuItem(calcType);
            
            // Show back button, hide menu button
            document.getElementById('back-btn').classList.remove('hidden');
            document.getElementById('menu-btn').classList.add('hidden');

            // Scroll to top
            window.scrollTo(0, 0);

        } catch (error) {
            console.error(`Failed to load calculator: ${calcType}`, error);
            this.container.innerHTML = `
                <div class="error-message">
                    <h3>Error Loading Calculator</h3>
                    <p>${escapeHtml(error.message)}</p>
                    <button onclick="location.reload()">Reload App</button>
                </div>
            `;
        }
    }

    updateTitle(calcType) {
        const titles = {
            'scientific': 'Scientific',
            'financial': 'Financial',
            'graphing': 'Graphing',
            'programmable': 'Programmable',
            'printing': 'Printing',
            'converter': 'Converter',
            'statistics': 'Statistics',
            'base': 'Base Converter',
            'matrix': 'Matrix',
            'datetime': 'Date & Time',
            'geometry': 'Geometry',
            'health': 'Health',
            'taxtip': 'Tax & Tip',
            'scinotation': 'Sci Notation',
            'complex': 'Complex'
        };
        this.title.textContent = titles[calcType] || calcType;
    }

    updateActiveMenuItem(calcType) {
        document.querySelectorAll('.calc-menu-item').forEach(btn => {
            if (btn.dataset.calc === calcType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileApp = new MobileCalculatorApp();
});
