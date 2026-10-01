# EquaSolver TODO

## Roadmap & TODO

> **Note:** The following items represent potential future enhancements. Contributions are welcome for any of these features.

### Planned Features
- [x] Add complex number support for equation solvers
- [x] Implement inequality solver (linear and quadratic inequalities)
- [x] Add derivative and integral calculator
- [x] Support for trigonometric equation solving
- [x] Add logarithmic and exponential equation solvers
- [x] Implement 3x3 system of linear equations solver
- [x] Add polynomial long division calculator
- [x] Support for absolute value equations

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

### Navigation and sharing
- [x] Open a tool from the URL hash (`#quadratic`, `#graph`): the PWA shortcuts already point there but nothing reads it
- [x] Search box on the home screen to filter tools by name
- [ ] Copy-result button on every solution

### Calculator
- [ ] Ctrl+Z / Ctrl+Y shortcuts wired to the existing undo/redo logic
- [ ] Degrees / radians switch for the trigonometric keys
- [ ] Memory keys (MC, MR, M+, M-)

### Solvers
- [ ] Exact form for quadratic roots (fractions and square roots, e.g. (3 ± √5) / 2)
- [ ] Gaussian elimination with steps for linear systems up to 5x5
- [ ] Partial fraction decomposition and polynomial factoring over the rationals

### Graphing
- [ ] Function plotter: several y = f(x) curves on one canvas, drag to pan, wheel to zoom
- [ ] Roots, extrema and intersection markers on the function plotter
- [ ] Export the plot as PNG

### Quality
- [ ] Print stylesheet so a solution prints without chrome
- [ ] Pin results from the history as favorites
- [ ] Playwright smoke test that opens every tool and solves with default values
- [ ] Keyboard navigation audit (tab order, focus trap in the settings panel)
