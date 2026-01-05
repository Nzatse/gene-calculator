# Scientific Calculator

A modern, fully-featured scientific calculator built with vanilla JavaScript, HTML, and CSS. Includes calculation history with localStorage persistence.

## Features

✨ **Scientific Functions:**
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (log, ln)
- Square root and exponents
- Factorial
- Absolute value
- Percentage calculations
- Math constants (π, e)

📜 **Calculation History:**
- Stores up to 50 calculations
- Persistent storage using localStorage
- Click any history item to reload it
- Clear history option

⌨️ **Keyboard Support:**
- Numbers: `0-9`
- Operators: `+`, `-`, `*`, `/`
- Parentheses: `(`, `)`
- Decimal: `.`
- Calculate: `Enter` or `=`
- Clear: `Escape` or `C`
- Backspace: `Backspace`

📱 **Responsive Design:**
- Works on desktop, tablet, and mobile
- Modern gradient background
- Smooth animations and transitions

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build process or dependencies required!

### Testing Locally

Simply open the `index.html` file in any modern web browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

## Deployment Options

### 1. GitHub Pages (Recommended - Free)

1. Push this code to a GitHub repository
2. Go to repository Settings → Pages
3. Select the main branch as source
4. Your calculator will be live at `https://yourusername.github.io/repo-name/`

### 2. Vercel (Free)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

Or use the [Vercel Dashboard](https://vercel.com/):
- Import your GitHub repository
- Deploy automatically

### 3. Netlify (Free)

**Option A - Drag & Drop:**
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag your project folder
3. Done!

**Option B - CLI:**
```bash
npm install -g netlify-cli
netlify deploy
```

### 4. Cloudflare Pages (Free)

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your GitHub repository
3. Deploy

## File Structure

```
gene-calculator/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── calculator.js       # Calculator logic and functions
└── README.md          # This file
```

## Usage Examples

**Basic Calculations:**
- `5 + 3` → 8
- `10 * 2.5` → 25
- `100 / 4` → 25

**Scientific Functions:**
- `sin(90)` → 0.8939966636005579
- `sqrt(16)` → 4
- `2^8` → 256
- `5!` → 120
- `log(100)` → 2

**Complex Expressions:**
- `(5 + 3) * 2` → 16
- `sin(pi/2)` → (approximately 1)
- `sqrt(25) + 2^3` → 13

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

Requires a modern browser with ES6+ support.

## Customization

### Change Colors

Edit `styles.css`:
```css
/* Background gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Button colors */
.btn.operator { background: #4299e1; }
.btn.function { background: #ed8936; }
.btn.equals { background: #48bb78; }
```

### Add More Functions

Edit `calculator.js` in the `evaluateExpression()` function:
```javascript
processed = processed.replace(/newFunction\(/g, 'Math.newFunction(');
```

## License

MIT License - Feel free to use this project however you'd like!

## Contributing

Found a bug or want to add a feature? Feel free to open an issue or submit a pull request!

---

Made with ❤️ using vanilla JavaScript
