// ===================================
// UNIT CONVERTER
// ===================================

const unitConversions = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 0.000621371,
        yard: 1.09361,
        foot: 3.28084,
        inch: 39.3701
    },
    mass: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 2.20462,
        ounce: 35.274,
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
        squareFoot: 10.7639,
        squareMile: 3.861e-7,
        acre: 0.000247105,
        hectare: 0.0001
    },
    volume: {
        liter: 1,
        milliliter: 1000,
        cubicMeter: 0.001,
        gallon: 0.264172,
        quart: 1.05669,
        pint: 2.11338,
        cup: 4.22675
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