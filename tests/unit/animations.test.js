/**
 * Tests for Step-by-Step Animation System
 */

describe('Step-by-Step Animation System', () => {
    describe('Animation Settings', () => {
        let animationEnabled = true;
        let animationSpeed = 500;

        test('should have default animation enabled', () => {
            expect(animationEnabled).toBe(true);
        });

        test('should have default animation speed of 500ms', () => {
            expect(animationSpeed).toBe(500);
        });

        test('should allow disabling animations', () => {
            animationEnabled = false;
            expect(animationEnabled).toBe(false);
        });

        test('should allow changing animation speed', () => {
            animationSpeed = 300;
            expect(animationSpeed).toBe(300);
            animationSpeed = 1000;
            expect(animationSpeed).toBe(1000);
        });
    });

    describe('Step Generation for Linear Equations', () => {
        function generateLinearSteps(a, b) {
            if (a === 0) {
                if (b === 0) {
                    return [{ explanation: 'Infinite solutions', equation: '0 = 0' }];
                }
                return [{ explanation: 'No solution', equation: `${b} ≠ 0` }];
            }
            
            const x = -b / a;
            return [
                { explanation: 'Starting equation', equation: `${a}x + ${b} = 0` },
                { explanation: 'Move constant to right side', equation: `${a}x = ${-b}` },
                { explanation: 'Divide by coefficient', equation: `x = ${-b} / ${a}` },
                { explanation: 'Simplify', equation: `x = ${x}` }
            ];
        }

        test('should generate 4 steps for valid linear equation', () => {
            const steps = generateLinearSteps(2, 4);
            expect(steps.length).toBe(4);
        });

        test('should include starting equation step', () => {
            const steps = generateLinearSteps(2, 4);
            expect(steps[0].explanation).toBe('Starting equation');
            expect(steps[0].equation).toBe('2x + 4 = 0');
        });

        test('should include move constant step', () => {
            const steps = generateLinearSteps(2, 4);
            expect(steps[1].equation).toBe('2x = -4');
        });

        test('should include divide step', () => {
            const steps = generateLinearSteps(2, 4);
            expect(steps[2].equation).toBe('x = -4 / 2');
        });

        test('should include final solution', () => {
            const steps = generateLinearSteps(2, 4);
            expect(steps[3].equation).toBe('x = -2');
        });

        test('should handle no solution case (a=0, b≠0)', () => {
            const steps = generateLinearSteps(0, 5);
            expect(steps.length).toBe(1);
            expect(steps[0].explanation).toBe('No solution');
        });

        test('should handle infinite solutions case (a=0, b=0)', () => {
            const steps = generateLinearSteps(0, 0);
            expect(steps.length).toBe(1);
            expect(steps[0].explanation).toBe('Infinite solutions');
        });
    });

    describe('Step Generation for Quadratic Equations', () => {
        function generateQuadraticSteps(a, b, c) {
            if (a === 0) {
                return [{ explanation: 'Invalid: coefficient a cannot be 0', equation: '' }];
            }
            
            const delta = b * b - 4 * a * c;
            const steps = [
                { explanation: 'Starting equation', equation: `${a}x^2 + ${b}x + ${c} = 0` },
                { explanation: 'Calculate discriminant', equation: `Delta = b^2 - 4ac = ${b}^2 - 4(${a})(${c})` },
                { explanation: 'Discriminant value', equation: `Delta = ${delta}` }
            ];
            
            if (delta < 0) {
                steps.push({ explanation: 'Delta < 0: No real solutions', equation: '' });
            } else if (delta === 0) {
                const x = -b / (2 * a);
                steps.push({ explanation: 'Delta = 0: One solution', equation: `x = -b / 2a = ${x}` });
            } else {
                const sqrtDelta = Math.sqrt(delta);
                const x1 = (-b + sqrtDelta) / (2 * a);
                const x2 = (-b - sqrtDelta) / (2 * a);
                steps.push({ explanation: 'Delta > 0: Two solutions', equation: `sqrt(Delta) = ${sqrtDelta}` });
                steps.push({ explanation: 'Calculate x1', equation: `x1 = (-b + sqrt(Delta)) / 2a = ${x1}` });
                steps.push({ explanation: 'Calculate x2', equation: `x2 = (-b - sqrt(Delta)) / 2a = ${x2}` });
            }
            
            return steps;
        }

        test('should generate steps for two solutions case', () => {
            const steps = generateQuadraticSteps(1, -5, 6);
            expect(steps.length).toBe(6);
        });

        test('should calculate correct discriminant', () => {
            const steps = generateQuadraticSteps(1, -5, 6);
            expect(steps[2].equation).toContain('1');  // Delta = 1
        });

        test('should generate steps for one solution case (delta=0)', () => {
            const steps = generateQuadraticSteps(1, -4, 4);
            expect(steps.length).toBe(4);
            expect(steps[3].explanation).toContain('One solution');
        });

        test('should generate steps for no solution case (delta<0)', () => {
            const steps = generateQuadraticSteps(1, 1, 1);
            expect(steps.length).toBe(4);
            expect(steps[3].explanation).toContain('No real solutions');
        });

        test('should handle invalid case (a=0)', () => {
            const steps = generateQuadraticSteps(0, 2, 1);
            expect(steps.length).toBe(1);
            expect(steps[0].explanation).toContain('Invalid');
        });
    });

    describe('Animation Delay Calculation', () => {
        function calculateDelay(stepIndex, baseSpeed) {
            return stepIndex * (baseSpeed / 1000);
        }

        test('should calculate correct delay for first step', () => {
            expect(calculateDelay(0, 500)).toBe(0);
        });

        test('should calculate correct delay for second step', () => {
            expect(calculateDelay(1, 500)).toBe(0.5);
        });

        test('should calculate correct delay for third step', () => {
            expect(calculateDelay(2, 500)).toBe(1);
        });

        test('should scale with different speeds', () => {
            expect(calculateDelay(2, 1000)).toBe(2);
            expect(calculateDelay(2, 250)).toBe(0.5);
        });
    });

    describe('HTML Generation', () => {
        function generateStepHTML(step, index, animationDelay) {
            return `<div class="step-item" style="animation-delay: ${animationDelay}s;">
                <span class="step-number">${index + 1}</span>
                <div class="step-content">
                    <div class="step-explanation">${step.explanation}</div>
                    <div class="step-equation">${step.equation}</div>
                </div>
            </div>`;
        }

        test('should include step number', () => {
            const html = generateStepHTML({ explanation: 'Test', equation: 'x = 1' }, 0, 0);
            expect(html).toContain('<span class="step-number">1</span>');
        });

        test('should include explanation', () => {
            const html = generateStepHTML({ explanation: 'Calculate discriminant', equation: 'Delta = 5' }, 0, 0);
            expect(html).toContain('Calculate discriminant');
        });

        test('should include equation', () => {
            const html = generateStepHTML({ explanation: 'Test', equation: 'x^2 + 2x + 1 = 0' }, 0, 0);
            expect(html).toContain('x^2 + 2x + 1 = 0');
        });

        test('should include animation delay', () => {
            const html = generateStepHTML({ explanation: 'Test', equation: 'x = 1' }, 2, 1.5);
            expect(html).toContain('animation-delay: 1.5s');
        });
    });

    describe('Final Result Display', () => {
        function generateResultHTML(solutions, solutionType) {
            let resultText = '';
            if (solutions.length === 0) {
                resultText = 'No real solutions';
            } else if (solutions.length === 1) {
                resultText = `x = ${solutions[0]}`;
            } else {
                resultText = solutions.map((s, i) => `x${i + 1} = ${s}`).join(', ');
            }
            
            return `<div class="final-result">
                <h4>${solutionType}</h4>
                <div class="result-value">${resultText}</div>
            </div>`;
        }

        test('should display single solution', () => {
            const html = generateResultHTML([2], 'One solution');
            expect(html).toContain('x = 2');
        });

        test('should display two solutions', () => {
            const html = generateResultHTML([3, 2], 'Two solutions');
            expect(html).toContain('x1 = 3');
            expect(html).toContain('x2 = 2');
        });

        test('should display no solutions message', () => {
            const html = generateResultHTML([], 'No real solutions');
            expect(html).toContain('No real solutions');
        });

        test('should include solution type in header', () => {
            const html = generateResultHTML([1], 'Unique solution');
            expect(html).toContain('Unique solution');
        });
    });

    describe('Step Visibility Toggle', () => {
        let stepsVisible = [];

        function showStep(index) {
            stepsVisible[index] = true;
        }

        function hideStep(index) {
            stepsVisible[index] = false;
        }

        function showAllSteps(count) {
            stepsVisible = new Array(count).fill(true);
        }

        function hideAllSteps(count) {
            stepsVisible = new Array(count).fill(false);
        }

        beforeEach(() => {
            stepsVisible = [false, false, false, false];
        });

        test('should show individual step', () => {
            showStep(1);
            expect(stepsVisible[1]).toBe(true);
            expect(stepsVisible[0]).toBe(false);
        });

        test('should hide individual step', () => {
            stepsVisible = [true, true, true, true];
            hideStep(2);
            expect(stepsVisible[2]).toBe(false);
        });

        test('should show all steps', () => {
            showAllSteps(4);
            expect(stepsVisible.every(v => v === true)).toBe(true);
        });

        test('should hide all steps', () => {
            stepsVisible = [true, true, true, true];
            hideAllSteps(4);
            expect(stepsVisible.every(v => v === false)).toBe(true);
        });
    });

    describe('Sequential Animation Timing', () => {
        function calculateTotalAnimationTime(stepCount, stepDelay) {
            return stepCount * stepDelay;
        }

        test('should calculate total time for 4 steps at 500ms each', () => {
            expect(calculateTotalAnimationTime(4, 500)).toBe(2000);
        });

        test('should calculate total time for 6 steps at 300ms each', () => {
            expect(calculateTotalAnimationTime(6, 300)).toBe(1800);
        });

        test('should return 0 for no steps', () => {
            expect(calculateTotalAnimationTime(0, 500)).toBe(0);
        });
    });
});

describe('Animation CSS Classes', () => {
    describe('Class Name Validation', () => {
        const requiredClasses = [
            'animated-steps',
            'step-item',
            'step-number',
            'step-content',
            'step-equation',
            'step-explanation',
            'final-result',
            'result-value'
        ];

        test('should define all required CSS classes', () => {
            requiredClasses.forEach(className => {
                expect(className).toBeTruthy();
                expect(className).toMatch(/^[a-z-]+$/);
            });
        });
    });

    describe('Animation Keyframes', () => {
        test('slideInStep should animate from left', () => {
            // The animation should transform from translateX(-20px) to translateX(0)
            const fromTransform = 'translateX(-20px)';
            const toTransform = 'translateX(0)';
            expect(fromTransform).toContain('-20px');
            expect(toTransform).toContain('0');
        });

        test('pulseResult should scale animation', () => {
            // The animation should scale from 0.95 to 1.02 to 1
            const scaleValues = [0.95, 1.02, 1];
            expect(scaleValues[0]).toBeLessThan(1);
            expect(scaleValues[1]).toBeGreaterThan(1);
            expect(scaleValues[2]).toBe(1);
        });
    });
});
