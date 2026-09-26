// ===================================
// UNIT CONVERTER
// ===================================

const unitConversions = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 1 / 1609.344,
        yard: 1 / 0.9144,
        foot: 1 / 0.3048,
        inch: 1 / 0.0254
    },
    mass: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 1 / 0.45359237,
        ounce: 1 / 0.028349523125,
        ton: 0.001
    },
    temperature: {
        celsius: 'special',
        fahrenheit: 'special',
        kelvin: 'special'
    },
    time: {
        second: 1,
        minute: 1/60,
        hour: 1/3600,
        day: 1/86400,
        week: 1/604800,
        month: 1/2592000,
        year: 1/31536000
    },
    area: {
        squareMeter: 1,
        squareKilometer: 0.000001,
        squareFoot: 1 / 0.09290304,
        squareMile: 1 / 2589988.110336,
        acre: 1 / 4046.8564224,
        hectare: 0.0001
    },
    volume: {
        liter: 1,
        milliliter: 1000,
        cubicMeter: 0.001,
        gallon: 1 / 3.785411784,
        quart: 4 / 3.785411784,
        pint: 8 / 3.785411784,
        cup: 16 / 3.785411784
    }
};

function convertTemperature(value, from, to) {
    let celsius;
    switch (from) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * 5/9; break;
        case 'kelvin': celsius = value - 273.15; break;
    }
    
    switch (to) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
    }
}

function convertUnit(value, category, fromUnit, toUnit) {
    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }
    
    const toBase = value / unitConversions[category][fromUnit];
    return toBase * unitConversions[category][toUnit];
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        unitConversions,
        convertTemperature,
        convertUnit
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.unitConversions = unitConversions;
    window.convertTemperature = convertTemperature;
    window.convertUnit = convertUnit;
}