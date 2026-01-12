/**
 * End-to-End Tests for EquaSolver
 * Tests complete user workflows using Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Application Loading', () => {
    test('should load the home screen', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Check that the title is correct
        await expect(page).toHaveTitle(/EquaSolver/);
        
        // Check that the home screen is visible
        const homeScreen = page.locator('#homeScreen');
        await expect(homeScreen).toBeVisible();
    });

    test('should display all tool cards', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Check for main tool cards
        const toolCards = page.locator('.tool-card');
        await expect(toolCards).toHaveCount(7); // Adjust based on actual count
    });

    test('should have particles background', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        const particles = page.locator('#particles-js');
        await expect(particles).toBeVisible();
    });
});

test.describe('Settings Panel', () => {
    test('should open and close settings', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Open settings
        await page.click('#settingsBtn');
        const settingsPanel = page.locator('#settingsPanel');
        await expect(settingsPanel).toHaveClass(/active/);
        
        // Close settings
        await page.click('#closeSettings');
        await expect(settingsPanel).not.toHaveClass(/active/);
    });

    test('should change theme', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Open settings
        await page.click('#settingsBtn');
        
        // Click cyberpunk theme
        await page.click('[data-theme="cyberpunk"]');
        
        // Check body has correct theme class
        await expect(page.locator('body')).toHaveClass(/theme-cyberpunk/);
    });

    test('should toggle dark/light mode', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Open settings
        await page.click('#settingsBtn');
        
        // Click light mode
        await page.click('[data-mode="light"]');
        
        // Check body has light-mode class
        await expect(page.locator('body')).toHaveClass(/light-mode/);
        
        // Toggle back to dark
        await page.click('[data-mode="dark"]');
        await expect(page.locator('body')).not.toHaveClass(/light-mode/);
    });

    test('should change language', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Open settings
        await page.click('#settingsBtn');
        
        // Click French language
        await page.click('[data-lang="fr"]');
        
        // Check that some text changed to French
        const settingsTitle = page.locator('[data-translate="settings"]');
        await expect(settingsTitle).toHaveText('Parametres');
    });
});

test.describe('Standard Calculator', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="standard"]');
    });

    test('should display calculator panel', async ({ page }) => {
        const calculatorPanel = page.locator('#standard');
        await expect(calculatorPanel).toHaveClass(/active/);
    });

    test('should perform basic addition', async ({ page }) => {
        // Click: 5 + 3 =
        await page.click('.btn:has-text("5")');
        await page.click('.btn.operator:has-text("+")');
        await page.click('.btn:has-text("3")');
        await page.click('[data-action="equals"]');
        
        const display = page.locator('.display');
        await expect(display).toHaveText('8');
    });

    test('should perform subtraction', async ({ page }) => {
        // Click: 9 - 4 =
        await page.click('.btn:has-text("9")');
        await page.click('.btn.operator:has-text("-")');
        await page.click('.btn:has-text("4")');
        await page.click('[data-action="equals"]');
        
        const display = page.locator('.display');
        await expect(display).toHaveText('5');
    });

    test('should clear display', async ({ page }) => {
        await page.click('.btn:has-text("5")');
        await page.click('[data-action="clear"]');
        
        const display = page.locator('.display');
        await expect(display).toHaveText('0');
    });
});

test.describe('Linear Equation Solver', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="linear"]');
    });

    test('should solve 2x + 4 = 0', async ({ page }) => {
        // Enter coefficients
        await page.fill('#linearA', '2');
        await page.fill('#linearB', '4');
        
        // Click solve
        await page.click('#solveLinear');
        
        // Check solution
        const solution = page.locator('#linearSolution');
        await expect(solution).toContainText('-2');
    });

    test('should handle a = 0 case', async ({ page }) => {
        await page.fill('#linearA', '0');
        await page.fill('#linearB', '5');
        
        await page.click('#solveLinear');
        
        const solution = page.locator('#linearSolution');
        await expect(solution).toContainText('No solution');
    });
});

test.describe('Quadratic Equation Solver', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="quadratic"]');
    });

    test('should solve x^2 - 5x + 6 = 0', async ({ page }) => {
        await page.fill('#quadA', '1');
        await page.fill('#quadB', '-5');
        await page.fill('#quadC', '6');
        
        await page.click('#solveQuadratic');
        
        const solution = page.locator('#quadraticSolution');
        await expect(solution).toContainText('3');
        await expect(solution).toContainText('2');
    });

    test('should show discriminant', async ({ page }) => {
        await page.fill('#quadA', '1');
        await page.fill('#quadB', '-5');
        await page.fill('#quadC', '6');
        
        await page.click('#solveQuadratic');
        
        const solution = page.locator('#quadraticSolution');
        await expect(solution).toContainText('1'); // discriminant = 1
    });

    test('should handle no real solutions', async ({ page }) => {
        await page.fill('#quadA', '1');
        await page.fill('#quadB', '1');
        await page.fill('#quadC', '1');
        
        await page.click('#solveQuadratic');
        
        const solution = page.locator('#quadraticSolution');
        await expect(solution).toContainText('No');
    });
});

test.describe('Matrix Calculator', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="matrix"]');
    });

    test('should display matrix input grids', async ({ page }) => {
        const matrixInputs = page.locator('.matrix-input');
        await expect(matrixInputs.first()).toBeVisible();
    });

    test('should calculate determinant of 2x2 matrix', async ({ page }) => {
        // Select 2x2 size
        await page.selectOption('#matrixSize', '2');
        
        // Select determinant operation
        await page.selectOption('#matrixOperation', 'determinant');
        
        // Fill matrix A: [[1, 2], [3, 4]]
        const inputs = page.locator('#matrixA input');
        await inputs.nth(0).fill('1');
        await inputs.nth(1).fill('2');
        await inputs.nth(2).fill('3');
        await inputs.nth(3).fill('4');
        
        await page.click('#calculateMatrix');
        
        // det = 1*4 - 2*3 = -2
        const result = page.locator('#matrixSolution');
        await expect(result).toContainText('-2');
    });
});

test.describe('Tab Navigation', () => {
    test('should switch between equation types', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="linear"]');
        
        // Switch to quadratic tab
        await page.click('[data-tab="quadratic"]');
        
        const quadraticPanel = page.locator('#quadratic');
        await expect(quadraticPanel).toHaveClass(/active/);
        
        // Switch to cubic tab
        await page.click('[data-tab="cubic"]');
        
        const cubicPanel = page.locator('#cubic');
        await expect(cubicPanel).toHaveClass(/active/);
    });
});

test.describe('History', () => {
    test('should add calculation to history', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="linear"]');
        
        // Solve an equation
        await page.fill('#linearA', '2');
        await page.fill('#linearB', '4');
        await page.click('#solveLinear');
        
        // Go to history
        await page.click('[data-tool="history"]');
        
        const historyList = page.locator('#historyList');
        await expect(historyList).toContainText('2x + 4 = 0');
    });
});

test.describe('Keyboard Navigation', () => {
    test('should support keyboard input on calculator', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="standard"]');
        
        // Type numbers using keyboard
        await page.keyboard.press('5');
        await page.keyboard.press('+');
        await page.keyboard.press('3');
        await page.keyboard.press('Enter');
        
        const display = page.locator('.display');
        await expect(display).toHaveText('8');
    });

    test('should clear with Escape key', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        await page.click('[data-tool="standard"]');
        
        await page.keyboard.press('5');
        await page.keyboard.press('Escape');
        
        const display = page.locator('.display');
        await expect(display).toHaveText('0');
    });
});

test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('http://localhost:3000/src/index.html');
        
        // Check that the app is still usable
        const homeScreen = page.locator('#homeScreen');
        await expect(homeScreen).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('http://localhost:3000/src/index.html');
        
        const homeScreen = page.locator('#homeScreen');
        await expect(homeScreen).toBeVisible();
    });
});

test.describe('Accessibility', () => {
    test('should have proper focus management', async ({ page }) => {
        await page.goto('http://localhost:3000/src/index.html');
        
        // Tab through elements
        await page.keyboard.press('Tab');
        
        // Check that something is focused
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });
});
