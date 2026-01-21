// ===================================
// BASE CONVERTER
// ===================================

function convertToBase(input, fromBase) {
    const validChars = '0123456789ABCDEF'.substring(0, fromBase);
    const upperInput = input.toUpperCase();
    const isValid = upperInput.split('').every(char => validChars.includes(char) || char === '-');
    
    if (!isValid) {
        return null;
    }
    
    const isNegative = upperInput.startsWith('-');
    const cleanInput = isNegative ? upperInput.substring(1) : upperInput;
    const decimal = parseInt(cleanInput, fromBase);
    
    if (isNaN(decimal)) {
        return null;
    }
    
    const sign = isNegative ? '-' : '';
    return {
        binary: sign + Math.abs(decimal).toString(2),
        octal: sign + Math.abs(decimal).toString(8),
        decimal: sign + Math.abs(decimal).toString(10),
        hexadecimal: sign + Math.abs(decimal).toString(16).toUpperCase()
    };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToBase
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.convertToBase = convertToBase;
}