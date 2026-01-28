# Contributing to EquaSolver

Thank you for your interest in contributing to EquaSolver! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/l-at-nnes/EquaSolver.git
   cd EquaSolver
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch** following naming conventions:
   ```bash
   # For new features
   git checkout -b feat/add-logarithmic-solver
   
   # For bug fixes
   git checkout -b fix/calculator-overflow
   
   # For documentation
   git checkout -b docs/api-examples
   ```

## Development Setup

### Prerequisites

- **Node.js 18+** (for running tests and development tools)
- **npm 9+** (comes with Node.js)
- **Git 2.30+** (for version control)
- **Modern browser** with DevTools:
  - Chrome 90+ / Edge 90+ (recommended for debugging)
  - Firefox 88+
  - Safari 14+

### Running the Application

**Option 1: Direct file access**
```bash
# Open index.html directly (may have CORS issues with some features)
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

**Option 2: Local development server** (recommended)
```bash
# Using npx serve (no installation needed)
npx serve . -p 3000

# Using Python 3
python -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

Then open `http://localhost:3000` in your browser.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
EquaSolver/
├── src/                          # Source files
│   ├── index.html                # Main application entry point
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker for offline support
│   ├── assets/                   # Static assets
│   │   └── icons/                # PWA icons (192x192, 512x512)
│   ├── css/
│   │   └── style.css             # All styles, themes, animations (~2500 lines)
│   └── js/
│       ├── script.js             # Main app: initialization, event listeners (~1500 lines)
│       ├── index.js              # CommonJS exports for Jest testing
│       ├── translations.js       # i18n loader (loads individual language files)
│       ├── flags.js              # Base64 country flag images
│       │
│       ├── calculus/             # Calculus modules
│       │   ├── index.js          # Module exports
│       │   ├── limits.js         # Limit calculator
│       │   ├── taylor.js         # Taylor series expansions
│       │   ├── numerical-integration.js  # Trapezoidal, Simpson's rule
│       │   └── derivatives-integrals.js  # Symbolic differentiation/integration
│       │
│       ├── converters/           # Converter modules
│       │   ├── index.js          # Module exports
│       │   ├── base.js           # Number base converter (2-36)
│       │   └── units.js          # Unit converter (length, mass, temp, etc.)
│       │
│       ├── graphing/             # Graphing modules
│       │   ├── index.js          # Module exports
│       │   ├── cartesian.js      # Cartesian coordinate graphing
│       │   ├── parametric.js     # Parametric curve plotting
│       │   └── polar.js          # Polar coordinate plotting
│       │
│       ├── i18n/                 # Translation modules (6 languages)
│       │   ├── index.js          # Translation exports
│       │   ├── en.js             # English (~600 keys)
│       │   ├── fr.js             # French
│       │   ├── es.js             # Spanish
│       │   ├── de.js             # German
│       │   ├── it.js             # Italian
│       │   └── ru.js             # Russian
│       │
│       ├── math/                 # Core math modules
│       │   ├── index.js          # Module exports
│       │   ├── complex.js        # Complex number operations
│       │   ├── matrix.js         # Matrix operations (2x2, 3x3)
│       │   ├── gcd-lcm.js        # GCD/LCM, prime factorization
│       │   ├── modular.js        # Modular arithmetic
│       │   ├── combinatorics.js  # Factorials, permutations, combinations
│       │   ├── fractions.js      # Fraction operations
│       │   ├── statistics.js     # Mean, median, mode, variance, std dev
│       │   └── sequences.js      # Arithmetic, geometric, Fibonacci
│       │
│       ├── parsers/              # Parser modules
│       │   ├── index.js          # Module exports
│       │   ├── expression.js     # Mathematical expression parser
│       │   └── latex.js          # LaTeX equation parser
│       │
│       ├── solvers/              # Equation solver modules
│       │   ├── index.js          # Module exports
│       │   ├── inequality.js     # Linear & quadratic inequalities
│       │   ├── polynomial-division.js  # Polynomial long division
│       │   └── exponential-log.js      # Exponential & logarithmic equations
│       │
│       └── ui/                   # UI modules
│           ├── index.js          # Module exports
│           ├── animations.js     # Step-by-step solution animations
│           ├── calculator.js     # Calculator UI handlers
│           ├── themes.js         # Theme builder and management
│           ├── history.js        # Calculation history
│           ├── export.js         # PDF export functionality
│           ├── exponential-log.js      # Exponential/log solver UI
│           └── derivatives-integrals.js # Derivatives/integrals UI
│
├── tests/
│   ├── unit/                     # Jest unit tests (951 tests, 32 suites)
│   │   ├── calculator.test.js    # Basic arithmetic operations
│   │   ├── linear.test.js        # Linear equations (ax + b = 0)
│   │   ├── quadratic.test.js     # Quadratic equations
│   │   ├── cubic.test.js         # Cubic equations (Cardano's formula)
│   │   ├── quartic.test.js       # Quartic equations (Durand-Kerner)
│   │   ├── quintic.test.js       # Quintic equations (numerical)
│   │   ├── inequality.test.js    # Linear & quadratic inequalities
│   │   ├── complex.test.js       # Complex number operations
│   │   ├── matrix.test.js        # Matrix operations (2x2, 3x3)
│   │   ├── systems.test.js       # Systems of equations (2x2)
│   │   ├── systems3x3.test.js    # Systems of equations (3x3)
│   │   ├── gcdlcm.test.js        # GCD/LCM, prime factorization
│   │   ├── modular.test.js       # Modular arithmetic
│   │   ├── combinatorics.test.js # Factorials, permutations, combinations
│   │   ├── statistics.test.js    # Mean, median, mode, variance
│   │   ├── fractions.test.js     # Fraction simplification
│   │   ├── sequences.test.js     # Arithmetic, geometric, Fibonacci
│   │   ├── converters.test.js    # Base and unit converters
│   │   ├── limits.test.js        # Limit calculator
│   │   ├── taylor.test.js        # Taylor series expansions
│   │   ├── numerical-integration.test.js  # Trapezoidal, Simpson's rule
│   │   ├── derivatives-integrals.test.js  # Symbolic derivatives/integrals
│   │   ├── exponential-log.test.js        # Exponential & log solvers
│   │   ├── polynomial-division.test.js    # Polynomial division
│   │   ├── parametric.test.js    # Parametric curve plotting
│   │   ├── polar.test.js         # Polar coordinate plotting
│   │   ├── latex.test.js         # LaTeX equation parsing
│   │   ├── scientific.test.js    # Scientific calculator functions
│   │   ├── customtheme.test.js   # Theme builder
│   │   ├── animations.test.js    # Step-by-step animations
│   │   ├── pwa.test.js           # PWA functionality
│   │   └── integration.test.js   # Full app integration tests
│   ├── e2e/
│   │   └── app.spec.js           # Playwright E2E tests
│   └── manual/
│       └── test.html             # Interactive browser tests (120+ tests)
├── docs/
│   ├── API.md                    # Function documentation
│   └── TESTING.md                # Testing guide
├── coverage/                     # Test coverage reports (generated)
├── node_modules/                 # Dependencies (gitignored)
├── package.json                  # Project configuration
├── jest.config.js                # Jest configuration
├── playwright.config.js          # Playwright configuration
├── README.md                     # Project overview
├── CONTRIBUTING.md               # This file
└── LICENSE                       # MIT License
```

### Key Files to Know

- **`src/js/script.js`**: Main application entry point with initialization, event listeners, and equation solvers.
- **`src/js/math/`**: Core mathematical functions (complex numbers, matrices, statistics, etc.)
- **`src/js/calculus/`**: Calculus modules (limits, Taylor series, derivatives, integrals)
- **`src/js/solvers/`**: Equation solvers (inequalities, polynomial division, exponential/log)
- **`src/js/ui/`**: UI modules (animations, themes, history, export)
- **`src/js/index.js`**: CommonJS exports for Jest testing
- **`src/css/style.css`**: All styling including 7 themes. Uses CSS custom properties extensively.
- **`src/js/i18n/`**: Translation files for 6 languages (EN, FR, ES, DE, IT, RU)
- **`tests/unit/*.test.js`**: Add tests here when implementing new mathematical functions.

## Making Changes

### Before You Start

1. Check existing [issues](../../issues) to avoid duplicate work
2. For major changes, open an issue first to discuss your approach
3. Keep changes focused and atomic

### Guidelines

- **One feature per pull request** - Makes review easier
- **Keep commits small and focused** - Each commit should represent a logical change
- **Write meaningful commit messages** - Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): short description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(solver): add support for polynomial degree 6
fix(calculator): handle division by zero correctly
docs(readme): update installation instructions
test(matrix): add tests for inverse calculation
```

## Code Style

### JavaScript Guidelines

**Core Principles:**
- Vanilla JavaScript only (no frameworks/libraries except for testing)
- ES6+ features encouraged (arrow functions, destructuring, template literals)
- Functional programming patterns where appropriate
- Immutability for data structures when possible
- No jQuery, no Lodash, no external runtime dependencies

**Variable Declarations:**
```javascript
const PI = Math.PI;
const solutions = calculateRoots(a, b, c);

let currentTheme = 'cyberpunk';
for (let i = 0; i < terms.length; i++) {
    
}

// Never use var
var result = 0;
```

**Function Documentation:**
```javascript
/**
 * Solves a quadratic equation ax² + bx + c = 0 using the discriminant method.
 * Supports real and complex roots.
 * 
 * @param {number} a - Coefficient of x² (must be non-zero)
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @returns {{discriminant: number, roots: Array<number|{re: number, im: number}>}} 
 *          Solution object with discriminant and array of roots (real or complex)
 * @throws {Error} If a is zero (not a quadratic equation)
 * 
 * @example
 * solveQuadratic(1, -5, 6);
 * 
 * @example
 * solveQuadratic(1, 0, 1);
 */
function solveQuadratic(a, b, c) {
    if (a === 0) throw new Error('Coefficient a must be non-zero');
    
    const discriminant = b * b - 4 * a * c;
    
}
```

**Naming Conventions:**
```javascript
function calculateDeterminant() { }
function convertToRadians() { }
function evaluatePolynomial() { }

const userInput = '2x + 3';
const solutionArray = [];
const currentLanguage = 'en';

const MAX_ITERATIONS = 1000;
const DEFAULT_TOLERANCE = 1e-10;
const GOLDEN_RATIO = 1.618033988749;

function _parseCoefficients(input) { }
function _validateInput(data) { }
```

**Error Handling:**
```javascript
function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

function calculateMean(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return NaN;
    }
    return data.reduce((a, b) => a + b, 0) / data.length;
}
```

**Code Organization:**
```javascript
// ===================================
// QUADRATIC EQUATION SOLVER
// ===================================

function solveQuadratic(a, b, c) { }
function getQuadraticDiscriminant(a, b, c) { }
function formatQuadraticSolution(roots) { }

// ===================================
// MATRIX OPERATIONS
// ===================================

function addMatrices(A, B) { }
function multiplyMatrices(A, B) { }
```

### CSS

- Use CSS custom properties (variables) for theming
- Follow BEM naming convention for classes
- Keep selectors simple and avoid deep nesting
- Group related properties together

```css
.calculator-panel {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    background: var(--bg-secondary);
}

.container > div.wrapper > .panel .content { }
```

### HTML

- Use semantic HTML5 elements
- Include appropriate ARIA attributes for accessibility
- Add `data-translate` attributes for translatable text

## Testing

### Testing Requirements

**All new features must include:**
1. Unit tests with >80% code coverage
2. Edge case testing (zero, negative, infinity, NaN)
3. Manual browser test validation
4. E2E test if UI-facing feature

### Unit Tests (Jest)

**Test Structure:**
```javascript
describe('Feature Name', () => {
    describe('happy path', () => {
        test('should handle typical case', () => {
            const input = {a: 1, b: -5, c: 6};
            const result = solveQuadratic(input.a, input.b, input.c);
            
            expect(result.discriminant).toBe(1);
            expect(result.roots).toHaveLength(2);
            expect(result.roots).toContain(3);
            expect(result.roots).toContain(2);
        });
    });
    
    describe('edge cases', () => {
        test('should handle zero discriminant (double root)', () => {
            const result = solveQuadratic(1, -4, 4);
            expect(result.discriminant).toBe(0);
            expect(result.roots).toEqual([2, 2]);
        });
        
        test('should return complex roots when discriminant < 0', () => {
            const result = solveQuadratic(1, 0, 1);
            expect(result.discriminant).toBe(-4);
            expect(result.roots[0]).toHaveProperty('re', 0);
            expect(result.roots[0]).toHaveProperty('im', 1);
        });
        
        test('should throw error when a = 0 (not quadratic)', () => {
            expect(() => solveQuadratic(0, 2, 3)).toThrow('not a quadratic');
        });
        
        test('should handle very large coefficients', () => {
            const result = solveQuadratic(1e10, 1e10, 1e10);
            expect(result.roots).toBeDefined();
        });
        
        test('should handle floating point precision', () => {
            const result = solveQuadratic(1, -1e-10, 1e-20);
            expect(result.roots).toBeDefined();
        });
    });
});
```

**Testing Mathematical Functions:**
```javascript
test('should calculate sine accurately', () => {
    expect(Math.sin(Math.PI / 2)).toBeCloseTo(1, 10);
    expect(calculateTaylorSin(Math.PI / 2, 0, 15)).toBeCloseTo(1, 5);
});

test('should generate fibonacci sequence', () => {
    const result = generateFibonacciSequence(8);
    expect(result.terms).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
});

test('should multiply complex numbers', () => {
    const z1 = {re: 3, im: 4};
    const z2 = {re: 1, im: 2};
    const result = complexMul(z1, z2);
    expect(result).toEqual({re: -5, im: 10});
});
```

**Coverage Goals:**
- **Branches**: >80%
- **Functions**: >90%
- **Lines**: >85%

Check coverage:
```bash
npm run test:coverage
```

### E2E Tests (Playwright)

**Test User Workflows:**
```javascript
test('should solve quadratic equation through UI', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.click('[data-tab="quadratic"]');
    await page.fill('#quadraticA', '1');
    await page.fill('#quadraticB', '-5');
    await page.fill('#quadraticC', '6');
    await page.click('#solveQuadratic');
    
    await expect(page.locator('#quadraticSolution')).toContainText('x₁ = 3');
    await expect(page.locator('#quadraticSolution')).toContainText('x₂ = 2');
    
    await page.click('#historyBtn');
    await expect(page.locator('.history-item')).toContainText('x² - 5x + 6 = 0');
});
```

### Manual Browser Tests

After implementing features:
1. Open `tests/manual/test.html` in browser
2. Verify all tests pass (aim for 100%)
3. Test in multiple browsers (Chrome, Firefox, Safari)
4. Test on mobile devices if UI changes made

## Submitting Changes

1. **Ensure all tests pass**:
   ```bash
   npm test
   ```

2. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference to any related issues
   - Screenshots for UI changes

4. **Address review feedback** promptly

### Pull Request Checklist

**Before submitting:**

**Code Quality:**
- [ ] All Jest tests pass (`npm test`)
- [ ] All E2E tests pass (`npm run test:e2e`)
- [ ] Manual browser tests pass (open `tests/manual/test.html`)
- [ ] No ESLint warnings or errors
- [ ] Code coverage >80% for new code
- [ ] No `console.log`, `debugger`, or commented-out code
- [ ] No hardcoded values (use constants)
- [ ] Functions are documented with JSDoc
- [ ] Variable names are descriptive (no `x`, `temp`, `data`)

**Functionality:**
- [ ] Works in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- [ ] Works on mobile devices (responsive design)
- [ ] Works in dark mode and light mode
- [ ] Works with all 7 themes
- [ ] Works in all 6 supported languages (if UI changes)
- [ ] No accessibility issues (keyboard navigation works)
- [ ] PWA functionality not broken (offline mode)

**Documentation:**
- [ ] README.md updated if new feature added
- [ ] API.md updated if public functions added
- [ ] CONTRIBUTING.md updated if workflow changed
- [ ] Commit messages follow conventional commits format
- [ ] PR description explains what/why/how
- [ ] Screenshots included for UI changes

**Performance:**
- [ ] No performance regressions (test on low-end devices)
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Particle animations disabled on mobile if heavy
- [ ] Images optimized (if any added)

**Testing:**
- [ ] Edge cases tested (zero, negative, infinity, NaN)
- [ ] Complex numbers handled correctly (if applicable)
- [ ] Large numbers handled without overflow
- [ ] Floating-point precision considered

## Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to reproduce** - Minimal steps to reproduce the issue
3. **Expected behavior** - What you expected to happen
4. **Actual behavior** - What actually happened
5. **Environment** - Browser, OS, screen size
6. **Screenshots** - If applicable

Use the [bug report template](../../issues/new?template=bug_report.md) when available.

## Requesting Features

For feature requests, please include:

1. **Problem statement** - What problem does this solve?
2. **Proposed solution** - How would this feature work?
3. **Alternatives considered** - Other approaches you've thought of
4. **Additional context** - Mockups, examples, etc.

Use the [feature request template](../../issues/new?template=feature_request.md) when available.

---

## Architecture Guidelines

### Adding New Equation Solvers

When adding support for new equation types:

1. **Create solver function** in `src/js/script.js`:
```javascript
// ===================================
// NEW EQUATION TYPE SOLVER
// ===================================

/**
 * Solves equation of type: description
 * @param {type} param - description
 * @returns {Object} Solution object
 */
function solveNewEquationType(params) {
    if (!validateInput(params)) {
        throw new Error('Invalid input');
    }
    
    const solution = calculateSolution(params);
    return formatResult(solution);
}
```

2. **Add UI handler** in same file:
```javascript
function setupNewEquationSolver() {
    const solveBtn = document.getElementById('solveNewEquation');
    if (!solveBtn) return;
    
    solveBtn.addEventListener('click', calculateNewEquation);
}

function calculateNewEquation() {
    const input = getInputValues();
    const result = solveNewEquationType(input);
    displayResult(result);
    addToHistory(result);
}
```

3. **Add HTML section** in `src/index.html`
4. **Add CSS styling** in `src/css/style.css`
5. **Add translations** in `src/js/i18n/*.js`
6. **Write unit tests** in `tests/unit/newfeature.test.js`
7. **Add manual tests** in `tests/manual/test.html`
8. **Update documentation** in `docs/API.md`

### Adding New Themes

1. **Add CSS variables** in `src/css/style.css`:
```css
[data-theme="newtheme"] {
    --primary: #hexcode;
    --secondary: #hexcode;
    --accent: #hexcode;
    --bg-primary: #hexcode;
    --bg-secondary: #hexcode;
}
```

2. **Add theme to selector** in HTML
3. **Add theme name to translations**
4. **Test in all browsers** (some CSS variables may need fallbacks)

### Adding New Languages

1. **Create translation file** `src/js/i18n/xx.js`:
```javascript
export default {
    language: 'Language Name',
    calculator: 'Calculator',
    solve: 'Solve'
};
```

2. **Add to `src/js/i18n/index.js`**
3. **Add flag image** in `src/js/flags.js`
4. **Test all UI elements** display correctly
5. **Check for text overflow** in UI

### Performance Optimization

**When adding features:**
- Use `requestAnimationFrame` for animations
- Debounce user input handlers
- Avoid DOM manipulation in loops
- Cache DOM queries
- Use event delegation for dynamic elements

**Debounced input example:**
```javascript
let debounceTimer;
function handleInput(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        processInput(e.target.value);
    }, 300);
}
```

---

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the "question" label
- Check existing documentation in the `docs/` folder

Thank you for contributing to EquaSolver!
