# EquaSolver

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-1411%20passing-brightgreen.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

**A calculator and equation solver with 37 tools, worked solutions, six languages and offline support.**

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Project Structure](#project-structure) • [Testing](#testing) • [Contributing](#contributing)

</div>

---

## Overview

EquaSolver is a web calculator for equations, calculus, statistics, graphs and everyday conversions. It is built with vanilla JavaScript, HTML and CSS: no framework, no build step, no runtime dependency except jsPDF for PDF export. It installs as a PWA and keeps working offline.

The interface is light by default and follows the system dark mode, with one accent colour per theme, a serif display face, tabular figures for numbers, and motion that only conveys state.

## Features

### Calculators

| Tool | What it does |
|---|---|
| **Standard calculator** | Arithmetic and scientific keys (sin, cos, tan, √, ln, log, eˣ, n!, π, e, x²), **degrees / radians** switch, **memory keys** (MC, MR, M+, M−), floating point noise removed from results, **Ctrl+Z / Ctrl+Y** undo and redo |
| **Expression calculator** | Type a whole expression such as `2 + 3 * (4 - 1)^2`, `sqrt(2) * pi`, `5! / 3!`; `ans` is the previous result; insert keys for functions; reusable history of the last results |
| **Percentage** | Percent of a value, change between two values, increase and decrease |
| **Ratio & proportion** | Simplifies ratios (decimals included) and solves a : b = c : x |
| **Fractions** | Simplify, add, subtract, multiply, divide, mixed numbers, decimal value |

### Equation solvers

- **Linear, quadratic, cubic, quartic and quintic equations** with real and **complex** roots shown as `a ± bi`. Multiple roots are recognised as real roots, and quadratic roots keep full precision when the coefficients differ greatly in size.
- **Exact form of quadratic roots**: fractions (`1, 1/2`), radicals (`(3 ± √5) / 2`) and complex values (`-1 ± 2i`) next to the decimal results.
- **Systems of linear equations**: 2×2 and 3×3 with Cramer's rule, and **n × n (2 to 5)** with Gaussian elimination and partial pivoting, including every row operation as a foldable list of matrices. Detects unique, infinite and impossible systems.
- **Inequalities**: linear, quadratic and absolute value, with interval notation.
- **Absolute value equations** `|ax + b| = c`.
- **Trigonometric equations** `sin x = k`, `cos x = k`, `tan x = k` on a chosen domain.
- **Exponential and logarithmic equations**: `aˣ = b`, `a·bˣ = c`, `eˣ = a`, `log_a(x) = b`, `log_a(bx + c) = d`, `ln x = a`, `log x = a`, with steps.
- **LaTeX input**: type an equation such as `x^2 - 5x + 6 = 0` with live preview; terms that cancel are handled.
- **Polynomial division** with quotient and remainder, plus the **factored form** of the dividend over the rationals (`(x - 1)(x - 2)(x - 3)`).
- **Partial fraction decomposition** of `P(x) / Q(x)` in exact fractions, with polynomial part and repeated factors.

### Algebra and number tools

- **Matrices** (2×2 and 3×3): addition, multiplication, determinant, inverse, **transpose, trace, rank and eigenvalues** (real or complex).
- **GCD and LCM** of several numbers with prime factorisations.
- **Prime numbers**: primality test (exact up to 2⁵³ with Miller-Rabin), next and previous prime, list of all primes up to 5 000 000.
- **Modular arithmetic**: modulo, modular inverse and exponentiation with exact big-number products.
- **Combinatorics**: factorial, permutations, combinations (no overflow for large n).
- **Base converter**: binary, octal, decimal, hexadecimal.
- **Unit converter**: length, mass, temperature, time, area, volume, **speed, energy, pressure and digital storage** (SI and binary prefixes), with a **swap** key.

### Calculus

- **Derivatives**: symbolic, at a point, nth order and critical points.
- **Integrals**: symbolic indefinite integrals and definite integrals (Simpson's rule).
- **Limits** computed numerically from the left, the right or both sides, including limits at ±∞ and removable singularities such as `sin(x)/x`.
- **Taylor series** of sin, cos, eˣ, ln(1 + x) and arctan.
- **Numerical integration**: trapezoidal and Simpson's rules.
- **Sequences**: arithmetic, geometric and Fibonacci, with sums and formulas.

### Statistics

- **Descriptive statistics**: mean, median, mode, variance, standard deviation, **minimum, quartiles, interquartile range, outliers (Tukey fences) and a histogram**.
- **Linear regression**: fitted line, slope, intercept, r, R², prediction for any x, and a scatter plot with the fitted line.

### Graphs

- **Function plotter**: up to four `y = f(x)` curves on one canvas. Drag to pan, scroll or pinch to zoom, hover to read values, double-click to reset. Roots, extrema and intersections are detected and listed; curves draw themselves; export to PNG.
- **3D surface**: `z = f(x, y)` with presets, rotate by dragging or with the arrow keys, zoom, height colouring, rise animation.
- **Cartesian graph** of linear, quadratic and cubic equations, **parametric curves** (circle, ellipse, spiral, Lissajous) and **polar curves** (cardioid, roses, spiral, lemniscate).

### Sharing, history and export

- **Shareable links**: the Share button copies a link that reopens the tool with its current values and runs it. `#quadratic` style links also open a tool directly, and the PWA shortcuts use them.
- **Copy result** button under every solution.
- **History** of the last 50 calculations, with **favorites** that survive clearing.
- **PDF export** of solutions, graphs and plots (symbols that jsPDF cannot print are transliterated).
- **Print stylesheet**: only the open tool and its solution are printed.
- **Tool search** on the home screen, accent and case insensitive.

### Interface

- **Light, dark or system**: follows `prefers-color-scheme` until you choose, with no flash on load.
- **Six accent themes** (Cobalt, Graphite, Emerald, Vermilion, Teal, Violet) plus a **custom theme builder**. Theme and mode changes cross-fade.
- **Six languages**: English, French, Spanish, German, Italian, Russian. A test keeps every language in sync.
- **Decimal comma** accepted in numeric fields.
- **Keyboard**: digits and operators drive the calculator, `Enter` or `=` calculates, `Escape` clears, `Backspace` deletes, arrow keys rotate the 3D surface, the settings panel traps focus and closes with `Escape`.
- **Responsive** layout and **reduced-motion** support.
- **Progressive Web App**: installable, precached by a service worker, works offline.
- **Safe by design**: expressions are parsed by a recursive-descent parser, never evaluated as JavaScript, and user text is escaped before it is shown.

---

## Getting Started

### Prerequisites

- A recent browser. Current Chrome, Edge, Safari and Firefox give the full experience (view transitions, scroll-driven animation, relative colours); older browsers keep working, without the animation.
- Node.js only if you want to run the tests.

### Run it

```bash
git clone https://github.com/l-at-nnes/EquaSolver.git
cd EquaSolver
```

Open `index.html` (it redirects to `src/index.html`), or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000 --directory src
```

There is no build process. The service worker needs `http://localhost` or HTTPS to register.

---

## Usage

1. Pick a tool on the home screen (or type in the search box), or open `index.html#plotter` directly.
2. Fill the inputs; the equation preview updates as you type.
3. Press **Solve** / **Calculate**. Worked steps appear under the result.
4. Use **Copy result**, **Export PDF**, **Share** or print.

### Examples

| Tool | Input | Result |
|---|---|---|
| Quadratic | a = 1, b = -3, c = 1 | x ≈ 2.618, 0.382; exact form `(3 ± √5) / 2` |
| Expression | `2 + 3 * (4 - 1)^2` | `29` |
| Limit | `sin(x)/x` at 0 | `1` |
| Polynomial division | `x^3 - 6x^2 + 11x - 6` ÷ `x - 1` | quotient `x² - 5x + 6`, factored `(x - 1)(x - 2)(x - 3)` |
| Partial fractions | `3x + 5` over `x^2 - x - 6` | `1/(5(x + 2)) + 14/(5(x - 3))` |
| Plotter | `sin(x)` and `x^2 / 4 - 1` | curves with their intersections marked |
| Regression | `1 2`, `2 4`, `3 5`, `4 4`, `5 5` | `y = 0.6x + 2.2`, R² = 0.6 |

### Keyboard shortcuts

| Key | Action |
|---|---|
| `0-9`, `.`, `+ - * /` | Calculator input (standard calculator open) |
| `Enter`, `=` | Calculate |
| `Backspace` | Delete the last digit |
| `Escape` | Clear the calculator / close the settings panel |
| `Ctrl/Cmd + Z`, `Ctrl/Cmd + Y` | Undo, redo |
| `Arrow keys` | Rotate the 3D surface when the canvas has focus |

---

## Project Structure

```
EquaSolver/
|-- index.html                    # Redirect to src/index.html
|-- src/
|   |-- index.html                # The application
|   |-- manifest.json, sw.js      # PWA manifest and service worker
|   |-- assets/                   # Icons
|   |-- css/
|   |   |-- base.css              # Layers, design tokens, themes, shared controls
|   |   |-- home.css              # Hero and tool tiles
|   |   |-- calculator.css        # Tabs, keypad, history, expression calculator
|   |   |-- forms.css             # Inputs, matrices, unit swap
|   |   |-- results.css           # Solutions, steps, histogram, Gauss steps
|   |   |-- plotter.css           # Plotter, 3D surface, regression
|   |   |-- settings.css          # Settings panel and theme swatches
|   |   |-- print.css             # Print stylesheet
|   |-- js/
|       |-- script.js             # Application entry point (browser)
|       |-- index.js              # CommonJS entry point for the tests
|       |-- math/                 # complex, matrix, linear-system, gcd-lcm, primes, modular,
|       |                         # combinatorics, fractions, exact, statistics, regression, sequences
|       |-- solvers/              # inequality, absolute, trigonometric, exponential-log,
|       |                         # polynomial-division, factor, partial-fractions
|       |-- calculus/             # derivatives-integrals, limits, taylor, numerical-integration
|       |-- converters/           # base, units
|       |-- parsers/              # expression (safe parser), latex
|       |-- graphing/             # cartesian, parametric, polar, plotter, surface
|       |-- ui/                   # calculator, expression-calc, history, themes, export, clipboard,
|       |                         # router, search, motion, inputs, system-n, regression, animations, ...
|       |-- i18n/                 # en, fr, es, de, it, ru
|-- tests/
|   |-- unit/                     # Jest, 57 suites
|   |-- e2e/                      # Playwright spec
|   |-- manual/test.html          # In-browser checks
|-- docs/                         # API.md, TESTING.md
|-- TODO.md                       # Roadmap
|-- PRODUCT.md, DESIGN.md         # Product and design notes
```

### Technology

- **HTML5, CSS3, vanilla JavaScript**; Canvas 2D for every plot, including the 3D surface (software projection and painter's algorithm).
- **CSS**: cascade layers, `@property` registered colours (theme changes interpolate), `light-dark()`, OKLCH with relative colour syntax, container queries, `:has()`, view transitions, scroll-driven animation, native nesting.
- **jsPDF** for PDF export (loaded from a CDN, cached by the service worker).
- **No framework, no bundler, no web font**: system font stacks only.

---

## Testing

```bash
npm install
npm test               # all unit tests
npm run test:watch
npm run test:coverage
```

**1411 tests in 57 suites** cover:

- the mathematics: every solver, the parser, calculus, statistics, matrices, primes, conversions, factoring and partial fractions;
- the interface logic: calculator state machine, history and favorites, themes and settings, routing and share links, search, clipboard, PDF export, graph drawing;
- **a smoke test** that loads the real `index.html` with every script in jsdom and presses all the solve buttons;
- translation parity: every language has the same keys and every key used by the page exists;
- the service worker precache list and the print stylesheet.

The Playwright spec in `tests/e2e/` needs `@playwright/test`, which is not a dependency of the project. `tests/manual/test.html` runs checks in a real browser.

See [docs/TESTING.md](docs/TESTING.md) for details and [docs/API.md](docs/API.md) for the function reference.

---

## Mathematical Methods

| Problem | Method |
|---|---|
| Quadratic | Discriminant, with the numerically stable form of the quadratic formula; exact form from integer discriminant and square-free part |
| Cubic | Cardano with tolerances relative to the size of the roots, trigonometric form for three real roots |
| Quartic, quintic | Durand-Kerner iteration; tight clusters of roots are averaged so multiple roots come out real |
| Linear systems | Cramer's rule (2×2, 3×3); Gaussian elimination with partial pivoting (n × n) |
| Eigenvalues | Characteristic polynomial (trace, sum of principal minors, determinant) |
| Factoring | Rational root theorem with exact integer arithmetic and multiplicities |
| Partial fractions | Basis terms per factor power, solved as an exact rational linear system (BigInt) |
| Limits | One-sided sampling toward the point with Richardson extrapolation; divergence and oscillation detection |
| Roots and extrema on plots | Sign changes refined by bisection; poles rejected by checking the value at the converged point |
| Primality | Deterministic Miller-Rabin for all safe integers |
| Regression | Ordinary least squares on centred data |
| Expressions | Recursive-descent parser: unary minus, right-associative powers, implicit multiplication, constants and functions |

---

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository and create a branch (`git checkout -b feature/YourFeature`).
2. Add tests with your change and run `npm test`.
3. Keep translations in sync: add keys to all six files in `src/js/i18n/` (a test enforces it).
4. If you add a script or stylesheet, list it in `src/index.html`, in the precache list of `src/sw.js` and bump the cache version.
5. Open a pull request.

Ideas are tracked in [TODO.md](TODO.md).

---

## License

MIT. See [LICENSE](LICENSE).

---

<div align="center">

**Built with precision and attention to detail**

© 2026 EquaSolver | [Report Issue](../../issues) | [Request Feature](../../issues)

</div>
