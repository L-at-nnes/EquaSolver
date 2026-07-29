// ===================================
// BASE CONVERTER
// ===================================

function convertToBase(input, fromBase) {
    const upperInput = input.toUpperCase();
    const isNegative = upperInput.startsWith('-');
    const cleanInput = isNegative ? upperInput.substring(1) : upperInput;

    const validChars = '0123456789ABCDEF'.substring(0, fromBase);
    const isValid = cleanInput.length > 0 && cleanInput.split('').every(char => validChars.includes(char));

    if (!isValid) {
        return null;
    }

    const decimal = parseInt(cleanInput, fromBase);

    if (isNaN(decimal) || decimal === 0) {
        return {
            binary: '0',
            octal: '0',
            decimal: '0',
            hexadecimal: '0'
        };
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