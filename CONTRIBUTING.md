# Contributing to EquaSolver

Thank you for your interest in contributing to EquaSolver! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/EquaSolver.git
   cd EquaSolver
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+ (for running tests)
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Git

### Running the Application

Open `index.html` in your browser or use a local server:

```bash
npx serve .
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
EquaSolver/
|-- src/                    # Source files
|   |-- index.html          # Main application
|   |-- assets/             # Static assets (icons)
|   |-- css/style.css       # Styles and themes
|   |-- js/
|       |-- script.js       # Core application logic
|       |-- translations.js # i18n translations
|       |-- flags.js        # Country flag images
|-- tests/
|   |-- unit/               # Jest unit tests
|   |-- e2e/                # Playwright E2E tests
|   |-- manual/             # Manual browser tests
|-- docs/                   # Documentation
```

## Making Changes

### Before You Start

1. Check existing [issues](../../issues) to avoid duplicate work
2. For major changes, open an issue first to discuss your approach
3. Keep changes focused and atomic

### Guidelines

- **One feature per pull request** - Makes review easier
- **Keep commits small and focused** - Each commit should represent a logical change
- **Write meaningful commit messages** - Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): short description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(solver): add support for polynomial degree 6
fix(calculator): handle division by zero correctly
docs(readme): update installation instructions
test(matrix): add tests for inverse calculation
```

## Code Style

### JavaScript

- Use vanilla JavaScript (no frameworks)
- Use `const` and `let` (never `var`)
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

```javascript
/**
 * Solves a quadratic equation ax^2 + bx + c = 0
 * @param {number} a - Coefficient of x^2 (must not be 0)
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @returns {Object} Solution object with discriminant and roots
 */
function solveQuadratic(a, b, c) {
    // Implementation
}
```

### CSS

- Use CSS custom properties (variables) for theming
- Follow BEM naming convention for classes
- Keep selectors simple and avoid deep nesting
- Group related properties together

```css
/* Good */
.calculator-panel {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    background: var(--bg-secondary);
}

/* Avoid */
.container > div.wrapper > .panel .content { }
```

### HTML

- Use semantic HTML5 elements
- Include appropriate ARIA attributes for accessibility
- Add `data-translate` attributes for translatable text

## Testing

### Unit Tests

- Write tests for all mathematical functions
- Test edge cases (zero, negative, very large numbers)
- Use descriptive test names

```javascript
describe('Quadratic Solver', () => {
    test('should find two real roots when discriminant > 0', () => {
        const result = solveQuadratic(1, -5, 6);
        expect(result.roots).toEqual([3, 2]);
    });
    
    test('should return no solution when discriminant < 0', () => {
        const result = solveQuadratic(1, 1, 1);
        expect(result.roots).toEqual([]);
    });
});
```

### E2E Tests

- Test complete user workflows
- Verify UI interactions work correctly
- Test across different themes and languages

## Submitting Changes

1. **Ensure all tests pass**:
   ```bash
   npm test
   ```

2. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference to any related issues
   - Screenshots for UI changes

4. **Address review feedback** promptly

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventions
- [ ] No console.log statements left in code
- [ ] Works in all supported browsers

## Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to reproduce** - Minimal steps to reproduce the issue
3. **Expected behavior** - What you expected to happen
4. **Actual behavior** - What actually happened
5. **Environment** - Browser, OS, screen size
6. **Screenshots** - If applicable

Use the [bug report template](../../issues/new?template=bug_report.md) when available.

## Requesting Features

For feature requests, please include:

1. **Problem statement** - What problem does this solve?
2. **Proposed solution** - How would this feature work?
3. **Alternatives considered** - Other approaches you've thought of
4. **Additional context** - Mockups, examples, etc.

Use the [feature request template](../../issues/new?template=feature_request.md) when available.

---

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the "question" label
- Check existing documentation in the `docs/` folder

Thank you for contributing to EquaSolver!
