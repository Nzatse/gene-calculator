# Multi-Function Calculator - Modular Architecture

## 🏗️ Project Structure

```
gene-calculator/
├── index-new.html           # New modular entry point
├── index.html               # Original (monolithic - keep as backup)
├── css/
│   ├── main.css            # Global styles, tabs, layout
│   └── shared.css          # Shared calculator component styles
├── js/
│   ├── app.js              # Main app - tab management & dynamic loading
│   └── utils.js            # Shared utility functions
├── calculators/            # Each calculator is a self-contained module
    ├── scientific/
    │   └── scientific.js   # ✅ Complete
    ├── financial/
    │   └── financial.js    # ✅ Complete
    ├── graphing/
    │   └── graphing.js     # ✅ Complete
    ├── programmable/
    │   └── programmable.js # ✅ Complete
    ├── printing/
    │   └── printing.js     # ✅ Complete
    ├── converter/
    │   └── converter.js    # ✅ Complete
    ├── statistics/
    │   └── statistics.js   # ✅ Complete
    ├── base/
    │   └── base.js         # ✅ Complete
    ├── matrix/
    │   └── matrix.js       # ✅ Complete
    ├── datetime/
    │   └── datetime.js     # ✅ Complete
    ├── geometry/
    │   └── geometry.js     # ✅ Complete
    ├── health/
    │   └── health.js       # ✅ Complete
    ├── taxtip/
    │   └── taxtip.js       # ✅ Complete
    ├── scinotation/
    │   └── scinotation.js  # ✅ Complete
    └── complex/
        └── complex.js      # ✅ Complete
```

## 🚀 How It Works

### 1. **Dynamic Loading (Lazy Loading)**
- Only the active calculator is loaded into memory
- Switching tabs loads calculator on-demand
- Improves initial page load time
- Reduces memory footprint

### 2. **ES6 Modules**
- Each calculator is an independent module
- Uses `import/export` syntax
- Shared utilities in `utils.js`
- Ready for bundlers (Webpack, Vite) when needed

### 3. **Module Structure**
Each calculator module must export two functions:

```javascript
// calculators/example/example.js

export async function render(container) {
    // Insert HTML into container
    container.innerHTML = `<div>Calculator HTML</div>`;
    
    // Attach event listeners
    attachEventListeners();
}

export function cleanup() {
    // Optional: cleanup resources, remove listeners
}
```

## 📝 Creating a New Calculator Module

### Template:
```javascript
// calculators/mycalc/mycalc.js
import { escapeHtml, saveToStorage, loadFromStorage } from '../../js/utils.js';

export async function render(container) {
    container.innerHTML = `
        <div class="calculator">
            <h2 class="calc-title">My Calculator</h2>
            <!-- Your calculator HTML -->
        </div>
    `;
    
    attachEventListeners();
}

function attachEventListeners() {
    // Add your event listeners
}

export function cleanup() {
    // Cleanup if needed
}
```

## 🔄 Migration Status

| Calculator | Status | File Location |
|------------|--------|---------------|
| Scientific | ✅ Complete | `calculators/scientific/scientific.js` |
| Converter  | ✅ Complete | `calculators/converter/converter.js` |
| Financial  | ✅ Complete | `calculators/financial/financial.js` |
| Graphing   | ✅ Complete | `calculators/graphing/graphing.js` |
| Programmable | ✅ Complete | `calculators/programmable/programmable.js` |
| Printing   | ✅ Complete | `calculators/printing/printing.js` |
| Statistics | ✅ Complete | `calculators/statistics/statistics.js` |
| Base       | ✅ Complete | `calculators/base/base.js` |
| Matrix     | ✅ Complete | `calculators/matrix/matrix.js` |
| Date/Time  | ✅ Complete | `calculators/datetime/datetime.js` |
| Geometry   | ✅ Complete | `calculators/geometry/geometry.js` |
| Health     | ✅ Complete | `calculators/health/health.js` |
| Tax & Tip  | ✅ Complete | `calculators/taxtip/taxtip.js` |
| Sci Notation | ✅ Complete | `calculators/scinotation/scinotation.js` |
| Complex    | ✅ Complete | `calculators/complex/complex.js` |

**🎉 All 15 calculators have been successfully migrated to the modular architecture!**

## 🧪 Testing

### Local Development:
Due to ES6 module restrictions, you **must** use a local server:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js (if installed)
npx serve

# Option 3: VS Code Live Server extension
```

Then open: `http://localhost:8000/index-new.html`

## 📱 iOS Deployment (Future)

When ready to convert to iOS app:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# Initialize
npx cap init "Gene Calculator" com.yourname.calculator

# Add iOS platform
npx cap add ios

# Open in Xcode
npx cap open ios
```

## 🎯 Advantages of This Structure

1. **Maintainability**: Each calculator is independent
2. **Performance**: Lazy loading = faster initial load
3. **Scalability**: Easy to add new calculators
4. **Team Work**: Multiple developers can work on different calculators
5. **iOS Ready**: Capacitor will work seamlessly with this structure
6. **Testing**: Easier to test individual calculators
7. **Code Reuse**: Shared utilities in `utils.js`

## 🔧 Shared Utilities Available

From `js/utils.js`:
- `escapeHtml(text)` - XSS protection
- `evaluateExpression(expr)` - Math expression evaluation
- `factorial(n)` - Calculate factorial
- `formatNumber(num, decimals)` - Format with commas
- `saveToStorage(key, data)` - localStorage helper
- `loadFromStorage(key, defaultValue)` - localStorage helper
- `debounce(func, wait)` - Debounce function
- `downloadFile(content, filename, mimeType)` - File export
- `MATH_CONSTANTS` - Common math constants

## 📦 Next Steps

1. ✅ Created modular structure
2. ✅ Created `app.js` (tab management)
3. ✅ Created `utils.js` (shared functions)
4. ✅ Migrated Scientific calculator
5. ✅ Created Converter calculator template
6. 🔄 Need to migrate remaining 13 calculators
7. 🔄 Test all calculators work independently
8. 🔄 Optimize CSS (remove duplicates)
9. 🔄 Add loading states/animations
10. 🔄 Add unit tests

## 🐛 Known Issues

- Must use local server (CORS restrictions with ES6 modules)
- Need to migrate remaining calculators from monolithic files

## 📚 Resources

- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Capacitor Docs](https://capacitorjs.com)
- [Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
