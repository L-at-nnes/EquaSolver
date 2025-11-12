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

- **Standard Calculator** - Perform basic arithmetic operations with a familiar interface
- **Linear Equations** (ax + b = 0) - First-degree polynomial equation solver
- **Quadratic Equations** (ax² + bx + c = 0) - Second-degree polynomial equation solver with discriminant analysis
- **Cubic Equations** (ax³ + bx² + cx + d = 0) - Third-degree polynomial equation solver using Cardano's formula
- **Systems of Linear Equations** - Solve 2×2 linear systems using Cramer's rule

### User Interface

- **Six Themes** - Choose from Cyberpunk, Matrix, Sunset, Ocean, Galaxy, and Neon color schemes
- **Multi-Language Support** - Available in English, French, Spanish, German, and Italian
- **Interactive Background** - Dynamic particle system that responds to mouse interactions
- **Step-by-Step Solutions** - View detailed solution steps for educational purposes
- **Calculation History** - Access your last 50 calculations for reference
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation** - Full keyboard support with intuitive shortcuts

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional software or dependencies required

### Installation

1. Download or clone the repository
2. Open the `index.html` file in your web browser

That's all! The application runs entirely client-side with no server or build process required.

---

## Usage

### Basic Calculator

The standard calculator supports all fundamental arithmetic operations. You can interact using either the on-screen buttons or your keyboard.

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

### Keyboard Shortcuts

- **Numbers & Operators** - Direct keyboard input
- **Enter** or **=** - Calculate result
- **Escape** - Clear all inputs
- **Backspace** - Delete last digit
- **Tab** - Navigate between input fields

---

## Documentation

### Technology Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced styling with Grid, Flexbox, and animations
- **Vanilla JavaScript** - Pure JavaScript with no framework dependencies
- **Particles.js** - Interactive particle background system
- **Google Fonts** - Orbitron and Roboto typefaces
- **SVG Graphics** - Scalable vector icons and flag images

### Project Structure

```
EquaSolver/
├── index.html              # Main application file
├── css/
│   └── style.css          # Styles, themes, and animations
├── js/
│   ├── script.js          # Core application logic and solvers
│   ├── translations.js    # Multi-language translation data
│   └── flags.js           # Base64-encoded country flags
├── README.md              # Project documentation
└── LICENSE                # MIT License
```

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

#### Systems of Linear Equations
Applies Cramer's rule with determinants:
1. Calculate the main determinant
2. Calculate determinants for each variable
3. Determine solution type (unique, infinite, or no solution)

---

## Browser Compatibility

| Browser         | Minimum Version | Status |
|----------------|-----------------|--------|
| Google Chrome  | Latest          | ✅ Fully Supported |
| Mozilla Firefox| Latest          | ✅ Fully Supported |
| Safari         | Latest          | ✅ Fully Supported |
| Microsoft Edge | Latest          | ✅ Fully Supported |
| Opera          | Latest          | ✅ Fully Supported |

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
- ⭐ Starring the repository
- 🐛 Reporting bugs via the issue tracker
- 💡 Suggesting new features or improvements
- 📢 Sharing with others who might benefit

---

## Roadmap & TODO

> **Note:** The following items represent potential future enhancements and ideas. No timeline or guarantee is provided for implementation. Contributions are welcome for any of these features.

### Planned Features
- [ ] Add support for higher-degree polynomial equations (4th, 5th degree)
- [ ] Implement matrix calculator (addition, multiplication, determinants, inverse)
- [ ] Add graphing capabilities to visualize equations
- [ ] Export solutions to PDF format
- [ ] Add more theme options (custom theme builder)
- [ ] Implement equation input via LaTeX syntax
- [ ] Add scientific calculator mode with advanced functions (sin, cos, log, etc.)
- [ ] Support for parametric and polar equations
- [ ] Add step-by-step explanation animations
- [ ] Implement dark/light mode toggle independent of themes

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
- [ ] Add more language translations (Japanese, Chinese, Russian, Arabic)
- [ ] Implement right-to-left (RTL) support for Arabic
- [ ] Add localized number formatting
- [ ] Create translation contribution workflow

---

<div align="center">

**Built with precision and attention to detail**

© 2025 EquaSolver | [Report Issue](../../issues) | [Request Feature](../../issues)

</div>
