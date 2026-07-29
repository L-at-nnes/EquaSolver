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

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animationEnabled,
        animationSpeed,
        setAnimationEnabled,
        setAnimationSpeed,
        generateAnimatedSteps
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.generateAnimatedSteps = generateAnimatedSteps;
}

