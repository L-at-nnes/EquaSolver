# Testing Guide

This project uses **Jest** for automated unit testing and includes manual browser tests.

## Installation

Install the test dependencies:

```bash
npm install
```

## Running Tests

### Automated Tests (Jest)

**Run all tests:**
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

### Manual Browser Tests

Open `tests/manual/test.html` in your browser to run interactive tests that validate the mathematical functions directly in the browser environment.

## Test Structure

```
tests/
|-- unit/                       # Jest unit tests
|   |-- calculator.test.js      # Standard calculator operations
|   |-- linear.test.js          # Linear equations (ax + b = 0)
|   |-- quadratic.test.js       # Quadratic equations (ax^2 + bx + c = 0)
|   |-- cubic.test.js           # Cubic equations (ax^3 + bx^2 + cx + d = 0)
|   |-- quartic.test.js         # Quartic equations
|   |-- quintic.test.js         # Quintic equations
|   |-- systems.test.js         # Systems of 2 linear equations
|   |-- matrix.test.js          # Matrix operations
|   |-- scientific.test.js      # Scientific functions
|   |-- latex.test.js           # LaTeX equation parsing
|   |-- parametric.test.js      # Parametric equations
|   |-- polar.test.js           # Polar equations
|   |-- customtheme.test.js     # Custom theme builder
|   |-- animations.test.js      # Step-by-step animations
|   |-- integration.test.js     # Integration tests
|-- manual/
    |-- test.html               # Browser-based manual tests
```

## Test Coverage

The tests cover:
- Basic arithmetic operations (+, -, *, /)
- Scientific functions (sin, cos, tan, log, sqrt, etc.)
- Linear equation solving with animations
- Quadratic equation solving (all discriminant cases)
- Cubic equation solving
- Quartic equation solving (Durand-Kerner method)
- Quintic equation solving (numerical methods)
- System of equations (Cramer's rule)
- Matrix operations (addition, multiplication, determinant, inverse)
- LaTeX equation parsing and preview
- Parametric curve plotting
- Polar curve plotting
- Custom theme builder (color validation, contrast calculation)
- Step-by-step animation generation
- Edge cases (zero, negatives, fractions)
- Error handling (division by zero, parallel lines)

## Example Test Results

```
PASS  tests/linear.test.js
PASS  tests/quadratic.test.js
PASS  tests/cubic.test.js
PASS  tests/quartic.test.js
PASS  tests/quintic.test.js
PASS  tests/systems.test.js
PASS  tests/matrix.test.js
PASS  tests/calculator.test.js
PASS  tests/scientific.test.js
PASS  tests/latex.test.js
PASS  tests/parametric.test.js
PASS  tests/polar.test.js
PASS  tests/customtheme.test.js
PASS  tests/animations.test.js
PASS  tests/integration.test.js

Test Suites: 15 passed, 15 total
Tests:       150+ passed
```

## Writing New Tests

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
