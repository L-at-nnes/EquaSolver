# EquaSolver

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
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
- **Quadratic Equations** (ax^2 + bx + c = 0) - Second-degree polynomial equation solver with discriminant analysis and animated steps
- **Cubic Equations** (ax^3 + bx^2 + cx + d = 0) - Third-degree polynomial equation solver using Cardano's formula
- **Quartic Equations** (ax^4 + bx^3 + cx^2 + dx + e = 0) - Fourth-degree polynomial equation solver using Durand-Kerner method
- **Quintic Equations** (ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0) - Fifth-degree polynomial equation solver using numerical methods
- **Systems of Linear Equations** - Solve 2x2 linear systems using Cramer's rule
- **Matrix Calculator** - Operations on 2x2 and 3x3 matrices (addition, multiplication, determinant, inverse)
- **Graph Visualization** - Plot and visualize linear, quadratic, and cubic equations with interactive controls
- **Parametric Equations** - Plot parametric curves with x(t) and y(t) functions including circle, ellipse, spiral, and Lissajous presets
- **Polar Equations** - Plot polar curves r(theta) with presets for cardioid, rose curves, spiral, and lemniscate
- **LaTeX Input** - Enter equations using LaTeX syntax with real-time preview and automatic parsing
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

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional software or dependencies required

### Installation

1. Download or clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/EquaSolver.git
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
|-- src/                        # Source files
|   |-- index.html              # Main application file
|   |-- assets/
|   |   |-- icon.svg            # Application icon
|   |-- css/
|   |   |-- style.css           # Styles, themes, and animations
|   |-- js/
|       |-- script.js           # Core application logic and solvers
|       |-- translations.js     # Multi-language translation data
|       |-- flags.js            # Base64-encoded country flags
|-- tests/                      # Test suite
|   |-- unit/                   # Jest unit tests
|   |   |-- calculator.test.js  # Standard calculator tests
|   |   |-- linear.test.js      # Linear equations tests
|   |   |-- quadratic.test.js   # Quadratic equations tests
|   |   |-- cubic.test.js       # Cubic equations tests
|   |   |-- quartic.test.js     # Quartic equations tests
|   |   |-- quintic.test.js     # Quintic equations tests
|   |   |-- systems.test.js     # Systems of equations tests
|   |   |-- matrix.test.js      # Matrix calculator tests
|   |   |-- scientific.test.js  # Scientific functions tests
|   |   |-- latex.test.js       # LaTeX input parser tests
|   |   |-- parametric.test.js  # Parametric equations tests
|   |   |-- polar.test.js       # Polar equations tests
|   |   |-- customtheme.test.js # Custom theme builder tests
|   |   |-- animations.test.js  # Step-by-step animation tests
|   |   |-- integration.test.js # Integration tests
|   |-- manual/
|       |-- test.html           # Manual browser testing
|-- docs/
|   |-- TESTING.md              # Testing documentation
|-- coverage/                   # Test coverage reports
|-- .github/workflows/          # CI/CD configuration
|-- package.json                # NPM dependencies and scripts
|-- README.md                   # Project documentation
|-- LICENSE                     # MIT License
```

---

## Testing

This project includes a comprehensive test suite using **Jest**.

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
```

### Test Coverage

The test suite includes:
- **150+ test cases** covering all mathematical operations
- Standard calculator (arithmetic operations)
- Scientific functions (trigonometry, logarithms, factorials)
- Linear equation solving with animated steps
- Quadratic equation solving (all discriminant cases)
- Cubic equation solving
- Quartic equation solving (Durand-Kerner numerical method)
- Quintic equation solving (numerical root finding)
- System of equations (Cramer's rule)
- Matrix operations (addition, multiplication, determinant, inverse)
- LaTeX equation parsing
- Parametric and polar equations
- Custom theme builder
- Step-by-step animation system
- Integration and state management
- Edge cases and error handling

See [tests/README.md](tests/README.md) for detailed testing documentation.

---

### Mathematical Methods

#### Quadratic Equations
Utilizes the discriminant method:
- **Δ = b² - 4ac**
- Δ > 0: Two distinct real solutions
- Δ = 0: One repeated real solution
- Δ < 0: No real solutions (complex conjugates exist)

#### Cubic Equations
Implements Cardano's formula:
1. Depressed cubic transformation
2. Discriminant calculation
3. Solution classification based on discriminant value

#### Quartic and Quintic Equations
Uses the Durand-Kerner numerical method:
1. Initialize approximate roots using unit circle distribution
2. Iteratively refine roots using polynomial evaluation
3. Filter for real solutions with tolerance threshold
4. Converges to accurate roots within specified tolerance

#### Systems of Linear Equations
Applies Cramer's rule with determinants:
1. Calculate the main determinant
2. Calculate determinants for each variable
3. Determine solution type (unique, infinite, or no solution)

#### Matrix Operations
Supports 2×2 and 3×3 matrices:
- **Addition**: Element-wise sum of corresponding entries
- **Multiplication**: Standard matrix multiplication using dot products
- **Determinant**: Computed using cofactor expansion for 2×2 and 3×3 matrices
- **Inverse**: Calculated using adjugate matrix method (returns null for singular matrices)

---

## Browser Compatibility

| Browser         | Minimum Version | Status |
|----------------|------------------|--------|
| Google Chrome  | Latest           | Fully Supported |
| Mozilla Firefox| Latest           | Fully Supported |
| Safari         | Latest           | Fully Supported |
| Microsoft Edge | Latest           | Fully Supported |
| Opera          | Latest           | Fully Supported |

---

## Contributing

Contributions are welcome and appreciated. To contribute:

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

> **Note:** The following items represent potential future enhancements and ideas. No timeline or guarantee is provided for implementation. Contributions are welcome for any of these features.

### Planned Features
- [x] Add support for higher-degree polynomial equations (4th, 5th degree)
- [x] Implement matrix calculator (addition, multiplication, determinants, inverse)
- [x] Add graphing capabilities to visualize equations
- [x] Export solutions to PDF format
- [x] Add more theme options (custom theme builder)
- [x] Implement equation input via LaTeX syntax
- [x] Add scientific calculator mode with advanced functions (sin, cos, log, etc.)
- [x] Support for parametric and polar equations
- [x] Add step-by-step explanation animations
- [x] Implement dark/light mode toggle independent of themes

### Documentation & Testing
- [ ] Write comprehensive API documentation
- [ ] Create video tutorials for complex features
- [ ] Add unit tests for equation solvers
- [ ] Implement end-to-end testing
- [ ] Add accessibility (WCAG 2.1) compliance testing
- [ ] Create contribution guidelines document

### Optimization & Performance
- [ ] Optimize particle rendering for mobile devices
- [ ] Implement service worker for offline functionality
- [ ] Add lazy loading for improved initial load time
- [ ] Optimize CSS and JavaScript bundle sizes
- [ ] Add progressive web app (PWA) support

### Internationalization
- [x] Add Russian language translation

---

<div align="center">

**Built with precision and attention to detail**

© 2025 EquaSolver | [Report Issue](../../issues) | [Request Feature](../../issues)

</div>
