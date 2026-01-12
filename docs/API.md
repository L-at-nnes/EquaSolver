# EquaSolver API Documentation

This document provides comprehensive documentation for all public functions in EquaSolver.

## Table of Contents

- [Equation Solvers](#equation-solvers)
  - [Linear Equations](#linear-equations)
  - [Quadratic Equations](#quadratic-equations)
  - [Cubic Equations](#cubic-equations)
  - [Quartic Equations](#quartic-equations)
  - [Quintic Equations](#quintic-equations)
  - [Systems of Equations](#systems-of-equations)
- [Matrix Operations](#matrix-operations)
- [Calculator Functions](#calculator-functions)
- [Expression Evaluation](#expression-evaluation)
- [Graphing Functions](#graphing-functions)
- [LaTeX Parser](#latex-parser)
- [Theme Functions](#theme-functions)
- [Utility Functions](#utility-functions)

---

## Equation Solvers

### Linear Equations

#### `solveLinear(a, b)`

Solves a linear equation of the form `ax + b = 0`.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `a` | `number` | Coefficient of x |
| `b` | `number` | Constant term |

**Returns:** `number | null`
- Returns the solution `x = -b/a`
- Returns `null` if `a === 0`

**Example:**
```javascript
solveLinear(2, 4);  // Returns -2 (solution of 2x + 4 = 0)
solveLinear(0, 5);  // Returns null (no solution)
```

---

### Quadratic Equations

#### `solveQuadratic(a, b, c)`

Solves a quadratic equation of the form `ax^2 + bx + c = 0` using the discriminant method.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `a` | `number` | Coefficient of x^2 (must not be 0) |
| `b` | `number` | Coefficient of x |
| `c` | `number` | Constant term |

**Returns:** `Object`
```javascript
{
    discriminant: number,
    roots: number[]  // 0, 1, or 2 roots
}
```

**Algorithm:**
1. Calculate discriminant: `delta = b^2 - 4ac`
2. If `delta > 0`: Two distinct real roots
3. If `delta = 0`: One repeated root
4. If `delta < 0`: No real roots

**Example:**
```javascript
solveQuadratic(1, -5, 6);
// Returns: { discriminant: 1, roots: [3, 2] }

solveQuadratic(1, 2, 1);
// Returns: { discriminant: 0, roots: [-1] }

solveQuadratic(1, 1, 1);
// Returns: { discriminant: -3, roots: [] }
```

---

### Cubic Equations

#### `solveCubic(a, b, c, d)`

Solves a cubic equation of the form `ax^3 + bx^2 + cx + d = 0` using Cardano's formula.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `a` | `number` | Coefficient of x^3 (must not be 0) |
| `b` | `number` | Coefficient of x^2 |
| `c` | `number` | Coefficient of x |
| `d` | `number` | Constant term |

**Returns:** `number[]` - Array of 1 or 3 real roots

**Algorithm:**
1. Convert to depressed cubic: `t^3 + pt + q = 0`
2. Calculate discriminant
3. Use trigonometric method (3 roots) or Cardano's formula (1 root)

**Example:**
```javascript
solveCubic(1, -6, 11, -6);
// Returns: [1, 2, 3]
```

---

### Quartic Equations

#### `solveQuarticEquation()`

Solves a quartic equation of the form `ax^4 + bx^3 + cx^2 + dx + e = 0` using the Durand-Kerner numerical method.

**DOM Dependencies:** Reads from input elements `#quartA`, `#quartB`, `#quartC`, `#quartD`, `#quartE`

**Algorithm:** Durand-Kerner iterative method
1. Initialize approximate roots on unit circle
2. Iteratively refine using polynomial evaluation
3. Filter for real solutions (imaginary part < tolerance)

---

### Quintic Equations

#### `solveQuinticEquation()`

Solves a quintic equation of the form `ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0` using numerical methods.

**DOM Dependencies:** Reads from input elements `#quintA` through `#quintF`

**Note:** No general algebraic solution exists for degree >= 5 (Abel-Ruffini theorem), so numerical methods are required.

---

### Systems of Equations

#### `solveSystemEquations()`

Solves a 2x2 system of linear equations using Cramer's rule:
```
a*x + b*y = e
c*x + d*y = f
```

**DOM Dependencies:** Reads from input elements `#sysA`, `#sysB`, `#sysC`, `#sysD`, `#sysE`, `#sysF`

**Returns:** Displays solution in `#systemsSolution`

**Algorithm:**
1. Calculate main determinant: `D = ad - bc`
2. If `D = 0`: No unique solution (parallel or coincident lines)
3. Calculate `x = (ed - bf) / D`
4. Calculate `y = (af - ec) / D`

---

## Matrix Operations

### `calculateMatrix()`

Performs matrix operations based on selected operation type.

**Operations:**
| Operation | Description |
|-----------|-------------|
| `addition` | Element-wise sum: C = A + B |
| `multiplication` | Matrix product: C = A * B |
| `determinant` | Calculate det(A) |
| `inverse` | Calculate A^(-1) if exists |

### `matrixAdd(A, B)`

Adds two matrices of the same dimensions.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `A` | `number[][]` | First matrix |
| `B` | `number[][]` | Second matrix |

**Returns:** `number[][]` - Result matrix

### `matrixMultiply(A, B)`

Multiplies two matrices.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `A` | `number[][]` | First matrix (m x n) |
| `B` | `number[][]` | Second matrix (n x p) |

**Returns:** `number[][]` - Result matrix (m x p)

### `determinant(matrix)`

Calculates the determinant of a square matrix.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `matrix` | `number[][]` | Square matrix (2x2 or 3x3) |

**Returns:** `number` - The determinant value

**Algorithm:**
- 2x2: `ad - bc`
- 3x3: Cofactor expansion along first row

### `matrixInverse(matrix)`

Calculates the inverse of a square matrix.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `matrix` | `number[][]` | Square matrix (2x2 or 3x3) |

**Returns:** `number[][] | null` - Inverse matrix or null if singular

---

## Calculator Functions

### `handleValue(value)`

Handles numeric input in the calculator.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `value` | `string` | Digit or decimal point |

### `handleOperator(op)`

Handles operator input (+, -, *, /).

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `op` | `string` | Operator symbol |

### `calculate()`

Performs the pending calculation and updates the display.

### `clearCalculator()`

Resets the calculator to initial state.

### Scientific Functions

| Function | Description |
|----------|-------------|
| `sin` | Sine (input in radians) |
| `cos` | Cosine (input in radians) |
| `tan` | Tangent (input in radians) |
| `sqrt` | Square root |
| `log` | Base-10 logarithm |
| `ln` | Natural logarithm |
| `exp` | e^x |
| `factorial` | n! |
| `power` | x^2 |

---

## Expression Evaluation

### `evaluateExpression(expr, varName, value)`

Safely evaluates a mathematical expression with variable substitution.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `expr` | `string` | Mathematical expression |
| `varName` | `string` | Variable name to substitute |
| `value` | `number` | Value to substitute |

**Returns:** `number` - Evaluated result

**Supported Functions:**
- Trigonometric: `sin`, `cos`, `tan`
- Other: `sqrt`, `abs`, `exp`, `log`, `pow`
- Constants: `pi`, `e`
- Operators: `+`, `-`, `*`, `/`, `^`

**Example:**
```javascript
evaluateExpression('sin(t) * 2', 't', Math.PI / 2);
// Returns: 2

evaluateExpression('sqrt(x^2 + 1)', 'x', 0);
// Returns: 1
```

---

## Graphing Functions

### `plotGraph(type)`

Plots a mathematical function on the canvas.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `type` | `string` | `'linear'`, `'quadratic'`, or `'cubic'` |

### `plotParametricGraph()`

Plots a parametric curve defined by x(t) and y(t).

**DOM Dependencies:** 
- `#parametricX` - x(t) expression
- `#parametricY` - y(t) expression  
- `#tMin`, `#tMax` - Parameter range

### `plotPolarGraph()`

Plots a polar curve defined by r(theta).

**DOM Dependencies:**
- `#polarR` - r(theta) expression
- `#thetaMin`, `#thetaMax` - Angle range

---

## LaTeX Parser

### `parseLatexEquation(latex)`

Parses a LaTeX polynomial equation and extracts coefficients.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `latex` | `string` | LaTeX equation string |

**Returns:** `Object`
```javascript
{
    type: 'linear' | 'quadratic' | 'cubic' | 'quartic' | 'quintic',
    coefficients: number[]
}
```

**Supported Formats:**
- `x + 2 = 0`
- `x^2 - 5x + 6 = 0`
- `2x^3 + 3x^2 - x + 1 = 0`
- `\frac{1}{2}x^2 + x = 0`

**Example:**
```javascript
parseLatexEquation('x^2 - 5x + 6 = 0');
// Returns: { type: 'quadratic', coefficients: [1, -5, 6] }
```

---

## Theme Functions

### `changeTheme(theme)`

Changes the application color theme.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `theme` | `string` | Theme name |

**Available Themes:**
- `cyberpunk`
- `neon`
- `matrix`
- `sunset`
- `ocean`
- `galaxy`
- `custom`

### `changeMode(mode)`

Toggles between dark and light mode.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `mode` | `string` | `'dark'` or `'light'` |

### `applyCustomTheme(colors)`

Applies a custom color theme.

**Parameters:**
```javascript
{
    primary: string,    // Hex color
    secondary: string,  // Hex color
    accent: string,     // Hex color
    bgPrimary: string   // Hex color
}
```

---

## Utility Functions

### `addToHistory(entry)`

Adds a calculation to the history.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `entry` | `string` | Calculation entry text |

**Note:** History is limited to 50 entries and persisted to localStorage.

### `clearHistory()`

Clears all calculation history.

### `changeLanguage(lang)`

Changes the UI language.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `lang` | `string` | Language code |

**Available Languages:**
- `en` - English
- `fr` - French
- `es` - Spanish
- `de` - German
- `it` - Italian
- `ru` - Russian

### `exportToPdf(type)`

Exports the current solution to PDF.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `type` | `string` | Solution type for filename |

---

## Error Handling

All solver functions handle these error cases:
- Invalid input (NaN, undefined)
- Division by zero
- Leading coefficient = 0 (reduces degree)
- Singular matrices (no inverse)

Errors are displayed in the UI with translated messages.

---

## Module Exports (Testing)

For Jest testing, the following are exported:

```javascript
module.exports = {
    solveLinear,
    solveQuadratic,
    solveCubic,
    findPolynomialRoots,
    matrixAdd,
    matrixMultiply,
    determinant,
    matrixInverse,
    factorial,
    evaluateExpression,
    parseLatexEquation
};
```
