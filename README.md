# EquaSolver

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

**A modern, feature-rich equation solver with an elegant user interface**

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Documentation](#documentation) • [License](#license)

</div>

---

## Overview

EquaSolver is a comprehensive web-based calculator designed to solve various types of mathematical equations with an intuitive and visually appealing interface. Built entirely with vanilla JavaScript, HTML5, and CSS3, it requires no installation or dependencies, making it accessible directly from any modern web browser.

## Features

### Equation Solving Capabilities

- **Standard Calculator** - Basic arithmetic operations with scientific functions (sin, cos, tan, sqrt, ln, log, e^x, n!, pi, e)
- **Linear Equations** (ax + b = 0) - First-degree polynomial equation solver with animated step-by-step solutions
- **Quadratic Equations** (ax^2 + bx + c = 0) - Second-degree polynomial equation solver with discriminant analysis, animated steps, and **complex root support**
- **Cubic Equations** (ax^3 + bx^2 + cx + d = 0) - Third-degree polynomial equation solver using Cardano's formula with **complex root support**
- **Quartic Equations** (ax^4 + bx^3 + cx^2 + dx + e = 0) - Fourth-degree polynomial equation solver using Durand-Kerner method with **complex root support**
- **Quintic Equations** (ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0) - Fifth-degree polynomial equation solver using numerical methods with **complex root support**
- **Complex Number Support** - All polynomial equation solvers now display both real and complex roots with proper formatting (a ± bi notation)
- **Inequality Solver** - Solve linear (ax + b < 0) and quadratic (ax² + bx + c < 0) inequalities with interval notation
- **Systems of Linear Equations** - Solve 2x2 and 3x3 linear systems using Cramer's rule
- **Matrix Calculator** - Operations on 2x2 and 3x3 matrices (addition, multiplication, determinant, inverse)
- **Graph Visualization** - Plot and visualize linear, quadratic, and cubic equations with interactive controls
- **Parametric Equations** - Plot parametric curves with x(t) and y(t) functions including circle, ellipse, spiral, and Lissajous presets
- **Polar Equations** - Plot polar curves r(theta) with presets for cardioid, rose curves, spiral, and lemniscate
- **LaTeX Input** - Enter equations using LaTeX syntax with real-time preview and automatic parsing
- **GCD and LCM Calculator** - Calculate greatest common divisor and least common multiple with prime factorization
- **Modular Arithmetic** - Calculate modulo, modular inverse, and modular exponentiation
- **Combinatorics** - Factorial, permutations, combinations, and binomial coefficients
- **Fractions Calculator** - Simplify, convert to mixed numbers, and perform arithmetic operations
- **Percentage Calculator** - Calculate percentages, increases, decreases, and differences
- **Ratio & Proportion** - Solve ratio problems and proportional relationships
- **Base Converter** - Convert between binary, octal, decimal, and hexadecimal
- **Unit Converter** - Convert length, mass, time, temperature, area, and volume units
- **Statistics Calculator** - Mean, median, mode, variance, and standard deviation
- **Sequence Generator** - Arithmetic, geometric, and Fibonacci sequences with formulas
- **Limit Calculator** - Evaluate limits of functions at points and infinity
- **Taylor Series** - Compute Taylor/Maclaurin series for sin, cos, exp, ln, and arctan
- **Numerical Integration** - Trapezoidal and Simpson's rule integration
- **Polynomial Long Division** - Divide polynomials with quotient and remainder calculation
- **Exponential Equations** - Solve equations of the form a^x = b, a · b^x = c, and e^x = a with step-by-step solutions
- **Logarithmic Equations** - Solve equations of the form log_a(x) = b, log_a(bx + c) = d, ln(x) = a, and log₁₀(x) = a
- **PDF Export** - Export solutions and graphs to PDF format for documentation and sharing

### User Interface

- **Dark/Light Mode** - Toggle between dark and light modes independently of theme selection
- **Seven Themes** - Choose from Cyberpunk, Matrix, Sunset, Ocean, Galaxy, Neon, and Custom color schemes
- **Custom Theme Builder** - Create your own theme with personalized primary, secondary, accent, and background colors
- **Multi-Language Support** - Available in English, French, Spanish, German, Italian, and Russian
- **Interactive Background** - Dynamic particle system that responds to mouse interactions
- **Keyboard Input** - Enter equation coefficients directly via keyboard for faster input
- **Step-by-Step Solutions** - View detailed solution steps with smooth animations for educational purposes
- **Calculation History** - Access your last 50 calculations for reference
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation** - Full keyboard support with intuitive shortcuts
- **Progressive Web App** - Install on any device, works offline with service worker caching
- **Mobile Optimization** - Reduced particle rendering and optimized performance on mobile devices

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional software or dependencies required

### Installation

1. Download or clone the repository:
   ```bash
   git clone https://github.com/l-at-nnes/EquaSolver.git
   cd EquaSolver
   ```

2. Open the application:
   - **Option 1**: Open `index.html` in your web browser (auto-redirects to the app)
   - **Option 2**: Open `src/index.html` directly
   - **Option 3**: Use a local server for development:
     ```bash
     npx serve .
     ```

That's all! The application runs entirely client-side with no server or build process required.

---

## Usage

### Basic Calculator

The standard calculator supports arithmetic operations and scientific functions. Use the numeric keypad for basic calculations, and the scientific function buttons below for advanced operations like trigonometry, logarithms, and factorials.

### Solving Equations

1. Select the appropriate equation type from the home screen
2. Enter the coefficients in the designated input fields
3. Click the "Solve" button to view the solution
4. Review the step-by-step solution process

#### Examples

**Linear Equation:**  
For the equation `2x + 5 = 0`, enter:
- a = 2
- b = 5

**Quadratic Equation:**  
For the equation `x² - 5x + 6 = 0`, enter:
- a = 1
- b = -5
- c = 6

**Matrix Operations:**  
For matrix addition of two 2×2 matrices:
```
A = [1  2]    B = [5  6]
    [3  4]        [7  8]
```
Select "Addition" operation and enter the values in the grid inputs.

**Exporting to PDF:**

After solving any equation or plotting a graph:
1. Click the **"Export PDF"** button that appears next to the "Solve" or "Plot Graph" button
2. The PDF will be automatically downloaded with the equation, solution steps, and (for graphs) the visual representation
3. PDF files are named with the format: `equasolver_[type]_[timestamp].pdf`

### Keyboard Shortcuts

- **Numbers & Operators** - Direct keyboard input
- **Enter** or **=** - Calculate result
- **Escape** - Clear all inputs
- **Backspace** - Delete last digit
- **Tab** - Navigate between input fields

---

## Documentation

### Technology Stack

- **HTML5** - Semantic markup and structure including Canvas API for graph rendering
- **CSS3** - Advanced styling with Grid, Flexbox, and animations
- **Vanilla JavaScript** - Pure JavaScript with no framework dependencies
- **Particles.js** - Interactive particle background system
- **jsPDF** - Client-side PDF generation library
- **Google Fonts** - Orbitron and Roboto typefaces
- **SVG Graphics** - Scalable vector icons and flag images

### Project Structure

```
EquaSolver/
|-- index.html                  # Redirect to src/index.html
|-- src/                        # Source files
|   |-- index.html              # Main application file
|   |-- manifest.json           # PWA manifest for installability
|   |-- sw.js                   # Service worker for offline support
|   |-- assets/
|   |   |-- icon.svg            # Application icon
|   |-- css/
|   |   |-- style.css           # Styles, themes, and animations
|   |-- js/
|       |-- index.js            # CommonJS entry point for Jest tests
|       |-- script.js           # Main application entry point (browser runtime)
|       |-- translations.js     # Translation loader
|       |-- flags.js            # Base64-encoded country flags
|       |-- math/               # Mathematical modules
|       |   |-- complex.js      # Complex number operations
|       |   |-- matrix.js       # Matrix operations (add, multiply, determinant, inverse)
|       |   |-- gcd-lcm.js      # GCD, LCM, prime factorization
|       |   |-- modular.js      # Modular arithmetic (modulo, inverse, exponentiation)
|       |   |-- combinatorics.js # Factorial, permutations, combinations
|       |   |-- fractions.js    # Fraction arithmetic and simplification
|       |   |-- statistics.js   # Mean, median, mode, variance, stdDev
|       |   |-- sequences.js    # Arithmetic, geometric, Fibonacci sequences
|       |-- calculus/           # Calculus modules
|       |   |-- limits.js       # Limit evaluation
|       |   |-- taylor.js       # Taylor series expansion
|       |   |-- numerical-integration.js  # Trapezoidal and Simpson's rule
|       |-- solvers/            # Equation solver modules
|       |   |-- inequality.js   # Linear and quadratic inequality solver
|       |   |-- polynomial-division.js  # Polynomial long division
|       |   |-- exponential-log.js  # Exponential and logarithmic equation solvers
|       |-- converters/         # Conversion modules
|       |   |-- base.js         # Base converter (binary, octal, decimal, hex)
|       |   |-- units.js        # Unit converter (length, mass, temperature, etc.)
|       |-- parsers/            # Parser modules
|       |   |-- latex.js        # LaTeX equation parser
|       |   |-- expression.js   # Mathematical expression evaluator
|       |-- graphing/           # Graphing modules
|       |   |-- cartesian.js    # Cartesian coordinate graphing
|       |   |-- parametric.js   # Parametric equation graphing
|       |   |-- polar.js        # Polar coordinate graphing
|       |-- ui/                 # UI modules
|       |   |-- calculator.js   # Calculator UI functions
|       |   |-- history.js      # Calculation history management
|       |   |-- themes.js       # Theme management
|       |   |-- animations.js   # Step-by-step animation system
|       |   |-- export.js       # PDF export functionality
|       |   |-- exponential-log.js  # Exponential/logarithmic solver UI
|       |-- i18n/               # Internationalization files
|           |-- en.js           # English translations
|           |-- fr.js           # French translations
|           |-- es.js           # Spanish translations
|           |-- de.js           # German translations
|           |-- it.js           # Italian translations
|           |-- ru.js           # Russian translations
|-- tests/                      # Test suite
|   |-- unit/                   # Jest unit tests (30 test files)
|   |-- e2e/                    # Playwright E2E tests
|   |-- manual/                 # Manual browser testing
|-- docs/
|   |-- API.md                  # API documentation
|   |-- TESTING.md              # Testing documentation
|-- coverage/                   # Test coverage reports (generated)
|-- package.json                # NPM dependencies and scripts
|-- package-lock.json           # Locked dependency versions
|-- CONTRIBUTING.md             # Contribution guidelines
|-- README.md                   # Project documentation
|-- LICENSE                     # MIT License
```

---

## Testing

This project includes a comprehensive test suite using **Jest** for unit tests and **Playwright** for end-to-end tests.

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests (requires Playwright)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Test Coverage

The test suite includes:

**Unit Tests (Jest) - 866 test cases across 31 test suites:**
- Standard calculator (arithmetic operations)
- Scientific functions (trigonometry, logarithms, factorials)
- Linear equation solving with animated steps
- Quadratic equation solving (all discriminant cases, including complex roots)
- Cubic equation solving (with complex root support)
- Quartic equation solving (Durand-Kerner numerical method, complex roots)
- Quintic equation solving (numerical root finding, complex roots)
- **Complex number operations** (add, sub, mul, div, sqrt, abs, conjugate, formatting)
- **Inequality solving** (linear and quadratic inequalities with interval notation)
- **Exponential equations** (a^x = b, a · b^x = c, e^x = a)
- **Logarithmic equations** (log_a(x) = b, log_a(bx + c) = d, ln(x) = a, log₁₀(x) = a)
- System of equations (Cramer's rule for 2x2 and 3x3)
- Matrix operations (addition, multiplication, determinant, inverse)
- LaTeX equation parsing
- Parametric and polar equations
- Custom theme builder
- Step-by-step animation system
- GCD/LCM calculator with prime factorization
- Modular arithmetic (modulo, inverse, exponentiation)
- Combinatorics (factorial, permutations, combinations)
- Fractions calculator (simplification, mixed numbers)
- Sequences (arithmetic, geometric, Fibonacci)
- Statistics (mean, median, mode, variance, stdDev)
- Unit and base converters
- Limit calculator (function evaluation)
- Taylor series (sin, cos, exp, ln, atan)
- Numerical integration (trapezoidal, Simpson's)
- Polynomial long division (parsing, division algorithm, formatting)
- PWA and service worker support
- Mobile optimization and performance
- Integration and state management
- Edge cases and error handling

**E2E Tests (Playwright):**
- Application loading and navigation
- Settings panel (themes, languages, dark/light mode)
- Calculator operations
- Equation solvers (linear, quadratic, matrix)
- Tab navigation
- History management
- Keyboard navigation
- Responsive design
- Accessibility

**Manual Browser Tests (120+ tests):**
- Open `tests/manual/test.html` in browser for interactive validation
- Tests all mathematical functions in real browser environment
- Covers equations, inequalities, complex numbers, matrices, GCD/LCM, modular arithmetic, combinatorics, statistics, sequences, Taylor series, numerical integration, and more

See [docs/TESTING.md](docs/TESTING.md) for detailed testing documentation.

---

### Mathematical Methods

#### Quadratic Equations
Utilizes the discriminant method with complex number support:
- **Δ = b² - 4ac**
- Δ > 0: Two distinct real solutions
- Δ = 0: One repeated real solution
- Δ < 0: Two complex conjugate solutions (displayed as a ± bi)

#### Cubic Equations
Implements Cardano's formula with complex root detection:
1. Depressed cubic transformation
2. Discriminant calculation
3. Solution classification based on discriminant value
4. Returns one real and two complex conjugate roots when applicable

#### Quartic and Quintic Equations
Uses the Durand-Kerner numerical method with full complex support:
1. Initialize approximate roots using unit circle distribution
2. Iteratively refine all roots (real and complex) using polynomial evaluation
3. Separate and display real roots and complex conjugate pairs
4. Converges to accurate roots within specified tolerance

#### Complex Number Operations
Full complex arithmetic support for equation solving:
- **Addition/Subtraction**: (a + bi) ± (c + di) = (a ± c) + (b ± d)i
- **Multiplication**: (a + bi)(c + di) = (ac - bd) + (ad + bc)i
- **Division**: Complex division with proper handling
- **Square Root**: Computes principal square root of complex numbers
- **Formatting**: Displays results in standard a ± bi notation

#### Inequality Solver
Supports linear and quadratic inequalities:
- **Linear Inequalities** (ax + b ⋚ 0): Direct solving with sign analysis
- **Quadratic Inequalities** (ax² + bx + c ⋚ 0): Uses discriminant and parabola sign analysis
- **Interval Notation**: Results displayed in standard mathematical notation (e.g., ]-∞, 2[ ∪ ]3, +∞[)
- **Sign Flip**: Automatically handles inequality reversal when dividing by negative numbers

#### Systems of Linear Equations
Applies Cramer's rule with determinants:
1. Calculate the main determinant
2. Calculate determinants for each variable
3. Determine solution type (unique, infinite, or no solution)

Supports both 2x2 and 3x3 systems:
- **2x2 Systems**: Two equations with two unknowns (x, y)
- **3x3 Systems**: Three equations with three unknowns (x, y, z) using 3x3 determinant calculation

#### Matrix Operations
Supports 2×2 and 3×3 matrices:
- **Addition**: Element-wise sum of corresponding entries
- **Multiplication**: Standard matrix multiplication using dot products
- **Determinant**: Computed using cofactor expansion for 2×2 and 3×3 matrices
- **Inverse**: Calculated using adjugate matrix method (returns null for singular matrices)

#### Polynomial Long Division
Performs long division of polynomials:
1. Parse polynomial expressions (e.g., "2x^3 + 3x^2 - x + 5")
2. Perform synthetic division algorithm with coefficient arrays
3. Calculate quotient and remainder polynomials
4. Verify result: Dividend = Divisor × Quotient + Remainder
5. Support for polynomials of any degree with integer or decimal coefficients

---

## Contributing

Contributions are welcome and appreciated! Please read our [Contributing Guidelines](CONTRIBUTING.md) before getting started.

To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Maintain code quality and consistency
- Test thoroughly across different browsers
- Update documentation as needed
- Follow existing code style and conventions

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.

You are free to use, modify, and distribute this software for personal or commercial purposes with proper attribution.

---

## Acknowledgments

- **[Particles.js](https://vincentgarreau.com/particles.js/)** - For the exceptional particle animation library
- **[Google Fonts](https://fonts.google.com/)** - For providing high-quality web typography
- **Mathematical Community** - For classical algorithms and methods that inspired this implementation

---

## Support

If you find this project helpful, please consider:
- Starring the repository
- Reporting bugs via the issue tracker
- Suggesting new features or improvements
- Sharing with others who might benefit

---

## Roadmap & TODO

> **Note:** The following items represent potential future enhancements. Contributions are welcome for any of these features.

### Planned Features
- [x] Add complex number support for equation solvers
- [x] Implement inequality solver (linear and quadratic inequalities)
- [ ] Add derivative and integral calculator
- [ ] Support for trigonometric equation solving
- [x] Add logarithmic and exponential equation solvers
- [x] Implement 3x3 system of linear equations solver
- [x] Add polynomial long division calculator
- [ ] Support for absolute value equations

### Advanced Calculations
- [x] Add GCD and LCM calculator
- [x] Implement prime factorization
- [x] Add modular arithmetic calculator (modulo, modular inverse, modular exponentiation)
- [x] Implement combinatorics calculator (permutations, combinations, binomial coefficients)
- [x] Add base converter (binary, octal, decimal, hexadecimal)
- [x] Implement fraction calculator with simplification
- [x] Add percentage calculator (increase, decrease, difference)
- [x] Implement ratio and proportion solver
- [x] Add unit converter (length, mass, temperature, time, area, volume)
- [x] Implement statistics calculator (mean, median, mode, variance, standard deviation)
- [x] Add sequence calculator (arithmetic, geometric, Fibonacci)
- [x] Implement limit calculator for simple functions
- [x] Add Taylor series expansion calculator
- [x] Implement numerical integration (trapezoidal, Simpson's rule)

### User Experience
- [ ] Implement undo/redo functionality for calculator
- [ ] Add favorites system to bookmark frequent calculations
- [ ] Add print-friendly view for solutions

### Visualization
- [ ] Add 3D graphing capabilities for 3-variable equations
- [ ] Implement zoom and pan gestures on touch devices
- [ ] Add animation for graph plotting
- [ ] Support for multiple equations overlay on same graph
- [ ] Add intersection point detection between curves

### Deployment
- [ ] Deploy application with GitHub Pages

---

<div align="center">

**Built with precision and attention to detail**

© 2026 EquaSolver | [Report Issue](../../issues) | [Request Feature](../../issues)

</div>
