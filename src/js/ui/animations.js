// ===================================
// STEP-BY-STEP ANIMATIONS
// ===================================

let animationEnabled = true;
let animationSpeed = 500; // ms per step

function setAnimationEnabled(enabled) {
    animationEnabled = enabled;
}

function setAnimationSpeed(speed) {
    animationSpeed = speed;
}

function generateAnimatedSteps(steps, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container && typeof document === 'undefined') return '';
    
    let html = '<div class="animated-steps">';
    
    steps.forEach((step, index) => {
        const delay = animationEnabled ? index * (animationSpeed / 1000) : 0;
        html += `
            <div class="step-item" style="animation-delay: ${delay}s;">
                <span class="step-number">${index + 1}</span>
                <div class="step-content">
                    <div class="step-explanation">${step.explanation}</div>
                    <div class="step-equation">${step.equation}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function createLinearSteps(a, b, x, trans) {
    return [
        { explanation: trans.startEquation || 'Starting equation', equation: `${a}x + ${b} = 0` },
        { explanation: trans.moveConstant || 'Move constant to the right side', equation: `${a}x = ${-b}` },
        { explanation: trans.divideByCoef || 'Divide by coefficient', equation: `x = ${-b} / ${a}` },
        { explanation: trans.simplify || 'Simplify', equation: `x = ${x.toFixed(4)}` }
    ];
}

function createQuadraticSteps(a, b, c, delta, x1, x2, trans) {
    const steps = [
        { explanation: trans.startEquation || 'Starting equation', equation: `${a}x² + ${b}x + ${c} = 0` },
        { explanation: trans.calcDiscriminant || 'Calculate discriminant', equation: `Δ = b² - 4ac = ${b}² - 4(${a})(${c})` },
        { explanation: trans.discriminantValue || 'Discriminant value', equation: `Δ = ${delta.toFixed(4)}` }
    ];
    
    if (delta < 0) {
        steps.push({ explanation: trans.deltaLessThanZero || 'Δ < 0, no real solutions', equation: trans.noRealSolutions || 'No real solutions' });
    } else if (delta === 0) {
        steps.push({ explanation: trans.deltaEqualsZero || 'Δ = 0, one solution', equation: `x = -b / 2a = ${-b} / ${2 * a}` });
        steps.push({ explanation: trans.simplify || 'Simplify', equation: `x = ${x1.toFixed(4)}` });
    } else {
        steps.push({ explanation: trans.deltaGreaterThanZero || 'Δ > 0, two solutions', equation: `√Δ = ${Math.sqrt(delta).toFixed(4)}` });
        steps.push({ explanation: trans.calcX1 || 'Calculate x₁', equation: `x₁ = (-b + √Δ) / 2a = ${x1.toFixed(4)}` });
        steps.push({ explanation: trans.calcX2 || 'Calculate x₂', equation: `x₂ = (-b - √Δ) / 2a = ${x2.toFixed(4)}` });
    }
    
    return steps;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animationEnabled,
        animationSpeed,
        setAnimationEnabled,
        setAnimationSpeed,
        generateAnimatedSteps,
        createLinearSteps,
        createQuadraticSteps
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.generateAnimatedSteps = generateAnimatedSteps;
    window.createLinearSteps = createLinearSteps;
    window.createQuadraticSteps = createQuadraticSteps;
}

