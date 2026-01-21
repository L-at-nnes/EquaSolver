# Testing Guide

This project uses a comprehensive testing strategy with **Jest** for unit testing, **Playwright** for end-to-end (E2E) testing, and manual browser tests for interactive validation.

## Installation

Install the test dependencies:

```bash
npm install
```

For E2E tests, install Playwright browsers:

```bash
npx playwright install chromium
```

## Running Tests

### Unit Tests (Jest)

**Run all unit tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

### End-to-End Tests (Playwright)

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run E2E tests with UI:**
```bash
npm run test:e2e:ui
```

**Run E2E tests in headed mode (visible browser):**
```bash
npx playwright test --headed
```

### All Tests

**Run unit + E2E tests:**
```bash
npm run test:all
```

### Manual Browser Tests

Open `tests/manual/test.html` in your browser to run interactive tests that validate the mathematical functions directly in the browser environment.

## Test Structure

```
tests/
|-- unit/                       # Jest unit tests (802 tests across 30 suites)
|   |-- calculator.test.js      # Standard calculator operations
|   |-- linear.test.js          # Linear equations (ax + b = 0)
|   |-- quadratic.test.js       # Quadratic equations (ax^2 + bx + c = 0)
|   |-- cubic.test.js           # Cubic equations (ax^3 + bx^2 + cx + d = 0)
|   |-- quartic.test.js         # Quartic equations
|   |-- quintic.test.js         # Quintic equations
|   |-- inequality.test.js      # Linear & quadratic inequalities
|   |-- systems.test.js         # Systems of 2 linear equations
|   |-- systems3x3.test.js      # Systems of 3 linear equations (Cramer's rule)
|   |-- polynomial-division.test.js  # Polynomial long division
|   |-- matrix.test.js          # Matrix operations
|   |-- scientific.test.js      # Scientific functions
|   |-- latex.test.js           # LaTeX equation parsing
|   |-- parametric.test.js      # Parametric equations
|   |-- polar.test.js           # Polar equations
|   |-- customtheme.test.js     # Custom theme builder
|   |-- animations.test.js      # Step-by-step animations
|   |-- gcdlcm.test.js          # GCD/LCM calculator
|   |-- pwa.test.js             # PWA and mobile optimization
|   |-- integration.test.js     # Application integration tests
|   |-- modular.test.js         # Modular arithmetic
|   |-- combinatorics.test.js   # Factorial, permutations, combinations
|   |-- statistics.test.js      # Mean, median, mode, variance, stdDev
|   |-- fractions.test.js       # Fraction simplification and arithmetic
|   |-- sequences.test.js       # Arithmetic, geometric, Fibonacci
|   |-- converters.test.js      # Base and unit converters
|   |-- limits.test.js          # Limit calculator
|   |-- taylor.test.js          # Taylor series
|   |-- numerical-integration.test.js  # Trapezoidal and Simpson's rule
|-- e2e/                        # Playwright E2E tests
|   |-- app.spec.js             # Full application E2E tests
|-- manual/
    |-- test.html               # Browser-based manual tests (120+ tests)
```

## Unit Test Coverage (Jest)

**764 test cases** covering:

### Core Functionality
- Basic arithmetic operations (+, -, *, /)
- Scientific functions (sin, cos, tan, log, sqrt, pow, factorial, etc.)
- Expression evaluation and parsing

### Equation Solvers
- Linear equation solving with step-by-step animations
- Quadratic equation solving (positive, zero, negative discriminant)
- Cubic equation solving (Cardano's formula)
- Quartic equation solving (Durand-Kerner method)
- Quintic equation solving (numerical methods)
- **Inequality solving** (linear and quadratic with interval notation)
- System of equations (Cramer's rule)
    - 3x3 systems using Cramer's rule (unique/singular detection)
    - Polynomial long division (parsing, quotient and remainder verification)

### Matrix Operations
- Matrix addition (2x2, 3x3)
- Matrix multiplication (2x2, 3x3)
- Determinant calculation
- Matrix inverse

### Advanced Features
- LaTeX equation parsing and preview
- Parametric curve evaluation (circle, ellipse, spiral, Lissajous)
- Polar curve evaluation (cardioid, rose, spiral, lemniscate)
- Custom theme builder (color validation, contrast calculation)
- Step-by-step animation generation
- GCD and LCM calculation (Euclidean algorithm)
- Prime factorization
- Modular arithmetic (modulo, inverse, exponentiation)
- Combinatorics (factorial, permutations, combinations)
- Statistics (mean, median, mode, variance, standard deviation)
- Fraction operations (simplification, mixed numbers, arithmetic)
- Sequences (arithmetic, geometric, Fibonacci with formulas)
- Base conversion (binary, octal, decimal, hexadecimal)
- Unit conversion (length, mass, time, temperature, area, volume)
- Limit evaluation (function evaluation at points)
- Taylor series (sin, cos, exp, ln, atan expansion)
- Numerical integration (trapezoidal rule, Simpson's rule)
- PWA and service worker support
- Mobile device detection and optimization

### Edge Cases & Error Handling
- Division by zero
- Invalid inputs
- Boundary conditions
- Parallel lines in systems
- Singular matrices

## E2E Test Coverage (Playwright)

**30+ test scenarios** covering:

### Application Loading
- Page loads successfully
- Title and header verification
- Navigation elements present

### Settings Panel
- Theme switching (Cyberpunk, Matrix, Ocean, etc.)
- Custom theme builder
- Language switching (EN, FR, ES, DE, IT, RU)
- Dark/light mode toggle
- Particle effects toggle

### Calculator Operations
- Basic arithmetic
- Scientific functions
- Keyboard input
- Clear and backspace

### Equation Solvers
- Linear equations with animated steps
- Quadratic equations (all discriminant cases)
- Matrix operations

### User Interface
- Tab navigation
- History management
- Responsive design
- Keyboard navigation
- Accessibility features

## Example Test Results

```
PASS  tests/unit/calculator.test.js
PASS  tests/unit/linear.test.js
PASS  tests/unit/quadratic.test.js
PASS  tests/unit/cubic.test.js
PASS  tests/unit/quartic.test.js
PASS  tests/unit/quintic.test.js
PASS  tests/unit/systems.test.js
PASS  tests/unit/matrix.test.js
PASS  tests/unit/scientific.test.js
PASS  tests/unit/latex.test.js
PASS  tests/unit/parametric.test.js
PASS  tests/unit/polar.test.js
PASS  tests/unit/customtheme.test.js
PASS  tests/unit/animations.test.js
PASS  tests/unit/integration.test.js

Test Suites: 15 passed, 15 total
Tests:       291 passed, 291 total
Time:        ~8s
```

## Coverage Report

Run `npm run test:coverage` to generate a detailed coverage report:

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85+   |   80+    |   90+   |   85+   |
----------------------|---------|----------|---------|---------|
```

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for CI integration
- `coverage/coverage-final.json` - JSON format

## Writing New Tests

### Unit Tests (Jest)

Follow Jest conventions:

```javascript
describe('Feature Name', () => {
    test('should do something specific', () => {
        const result = yourFunction(input);
        expect(result).toBe(expected);
    });
});
```

For floating-point comparisons, use `toBeCloseTo`:

```javascript
expect(0.1 + 0.2).toBeCloseTo(0.3, 5); // 5 decimal places
```

### E2E Tests (Playwright)

Follow Playwright conventions:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
    test('should do something in the browser', async ({ page }) => {
        await page.goto('/');
        await page.click('#some-button');
        await expect(page.locator('#result')).toContainText('Expected');
    });
});
```

## Continuous Integration

The test suite is designed for CI/CD integration:

```yaml
# Example GitHub Actions workflow
- name: Run Unit Tests
  run: npm test

- name: Run E2E Tests
  run: npm run test:e2e
```

## Troubleshooting

### Common Issues

**Jest tests failing with module errors:**
```bash
# Clear Jest cache
npx jest --clearCache
npm test
```

**Playwright browser not installed:**
```bash
npx playwright install chromium
```

**E2E tests timing out:**
- Increase timeout in playwright.config.js
- Check that the server is running on the correct port

**Coverage not generating:**
```bash
npm run test:coverage
# Check coverage/lcov-report/index.html
```

