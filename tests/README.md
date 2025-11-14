# Testing Guide

This project uses **Jest** for testing the mathematical operations and equation solvers.

## Installation

Install the test dependencies:

```bash
npm install
```

## Running Tests

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

## Test Structure

```
tests/
├── calculator.test.js    # Standard calculator operations
├── linear.test.js        # Linear equations (ax + b = 0)
├── quadratic.test.js     # Quadratic equations (ax² + bx + c = 0)
├── cubic.test.js         # Cubic equations (ax³ + bx² + cx + d = 0)
└── systems.test.js       # Systems of 2 linear equations
```

## Test Coverage

The tests cover:
- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Linear equation solving
- ✅ Quadratic equation solving (all discriminant cases)
- ✅ Cubic equation solving
- ✅ System of equations (Cramer's rule)
- ✅ Edge cases (zero, negatives, fractions)
- ✅ Error handling (division by zero, parallel lines)

## Example Test Results

```
PASS  tests/linear.test.js
PASS  tests/quadratic.test.js
PASS  tests/cubic.test.js
PASS  tests/systems.test.js
PASS  tests/calculator.test.js

Test Suites: 5 passed, 5 total
Tests:       35 passed, 35 total
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
