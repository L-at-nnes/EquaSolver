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
- [x] Implement undo/redo functionality for calculator
- [x] Add favorites system to bookmark frequent calculations
- [x] Add print-friendly view for solutions

### Visualization
- [x] Add 3D graphing capabilities for 3-variable equations (z = f(x, y) surface plotter)
- [x] Implement zoom and pan gestures on touch devices
- [x] Add animation for graph plotting (curves of the function plotter draw themselves)
- [x] Support for multiple equations overlay on same graph
- [x] Add intersection point detection between curves

### Navigation and sharing
- [x] Open a tool from the URL hash (`#quadratic`, `#graph`): the PWA shortcuts already point there but nothing reads it
- [x] Search box on the home screen to filter tools by name
- [x] Copy-result button on every solution

### Calculator
- [x] Ctrl+Z / Ctrl+Y shortcuts wired to the existing undo/redo logic
- [x] Degrees / radians switch for the trigonometric keys
- [x] Memory keys (MC, MR, M+, M-)

### Solvers
- [x] Exact form for quadratic roots (fractions and square roots, e.g. (3 ± √5) / 2)
- [x] Gaussian elimination with steps for linear systems up to 5x5
- [x] Polynomial factoring over the rationals (shown with polynomial division)
- [x] Partial fraction decomposition

### Graphing
- [x] Function plotter: several y = f(x) curves on one canvas, drag to pan, wheel to zoom
- [x] Roots, extrema and intersection markers on the function plotter
- [x] Export the plot as PNG

### Quality
- [x] Print stylesheet so a solution prints without chrome
- [x] Pin results from the history as favorites
- [x] Smoke test that boots the real page and runs every tool with its default values
- [x] Keyboard navigation audit (tab order, focus trap in the settings panel)
