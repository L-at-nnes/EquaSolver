/**
 * Tests for Base and Unit Converters
 * 
 * This test suite covers:
 * - Base conversion (binary, octal, decimal, hexadecimal)
 * - Unit conversion (length, mass, temperature, time, area, volume)
 * - Edge cases and validation
 */

// Mock DOM elements
document.body.innerHTML = `
    <input type="text" id="baseInput" value="255">
    <select id="fromBase"><option value="10">Decimal</option></select>
    <div id="baseConverterSolution"></div>
    <button id="convertBase"></button>
    <button id="exportBaseConverterPdf" style="display:none"></button>
    <select id="unitCategory"><option value="length">Length</option></select>
    <input type="number" id="unitValue" value="100">
    <select id="fromUnit"><option value="meter">Meter</option></select>
    <select id="toUnit"><option value="kilometer">Kilometer</option></select>
    <div id="unitConverterSolution"></div>
    <button id="convertUnit"></button>
    <button id="exportUnitConverterPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        invalidBaseNumber: "Invalid number for the selected base",
        binaryResult: "Binary",
        octalResult: "Octal",
        decimalResult: "Decimal",
        hexResult: "Hexadecimal",
        result: "Result"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    convertTemperature,
    unitConversions
} = require('../../src/js/script.js');

describe('Base Conversion Logic', () => {
    // Test the underlying conversion logic
    describe('Decimal to other bases', () => {
        test('should convert 255 to binary 11111111', () => {
            expect((255).toString(2)).toBe('11111111');
        });

        test('should convert 255 to octal 377', () => {
            expect((255).toString(8)).toBe('377');
        });

        test('should convert 255 to hex FF', () => {
            expect((255).toString(16).toUpperCase()).toBe('FF');
        });

        test('should convert 0 correctly', () => {
            expect((0).toString(2)).toBe('0');
            expect((0).toString(8)).toBe('0');
            expect((0).toString(16)).toBe('0');
        });

        test('should convert 1024 to binary', () => {
            expect((1024).toString(2)).toBe('10000000000');
        });
    });

    describe('Other bases to decimal', () => {
        test('should convert binary 1010 to decimal 10', () => {
            expect(parseInt('1010', 2)).toBe(10);
        });

        test('should convert octal 17 to decimal 15', () => {
            expect(parseInt('17', 8)).toBe(15);
        });

        test('should convert hex FF to decimal 255', () => {
            expect(parseInt('FF', 16)).toBe(255);
        });

        test('should convert hex abc to decimal 2748', () => {
            expect(parseInt('ABC', 16)).toBe(2748);
        });
    });

    describe('Edge cases', () => {
        test('should handle large numbers', () => {
            const large = 1000000;
            expect(parseInt(large.toString(2), 2)).toBe(large);
            expect(parseInt(large.toString(16), 16)).toBe(large);
        });

        test('should be reversible', () => {
            const num = 12345;
            expect(parseInt(num.toString(2), 2)).toBe(num);
            expect(parseInt(num.toString(8), 8)).toBe(num);
            expect(parseInt(num.toString(16), 16)).toBe(num);
        });
    });
});

describe('Temperature Conversion', () => {
    describe('Celsius to Fahrenheit', () => {
        test('should convert 0°C to 32°F', () => {
            expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
        });

        test('should convert 100°C to 212°F', () => {
            expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
        });

        test('should convert -40°C to -40°F', () => {
            expect(convertTemperature(-40, 'celsius', 'fahrenheit')).toBe(-40);
        });

        test('should convert 37°C (body temp) to 98.6°F', () => {
            expect(convertTemperature(37, 'celsius', 'fahrenheit')).toBeCloseTo(98.6, 1);
        });
    });

    describe('Fahrenheit to Celsius', () => {
        test('should convert 32°F to 0°C', () => {
            expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
        });

        test('should convert 212°F to 100°C', () => {
            expect(convertTemperature(212, 'fahrenheit', 'celsius')).toBe(100);
        });

        test('should convert 98.6°F to 37°C', () => {
            expect(convertTemperature(98.6, 'fahrenheit', 'celsius')).toBeCloseTo(37, 1);
        });
    });

    describe('Celsius to Kelvin', () => {
        test('should convert 0°C to 273.15K', () => {
            expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15);
        });

        test('should convert -273.15°C to 0K (absolute zero)', () => {
            expect(convertTemperature(-273.15, 'celsius', 'kelvin')).toBeCloseTo(0, 5);
        });

        test('should convert 100°C to 373.15K', () => {
            expect(convertTemperature(100, 'celsius', 'kelvin')).toBe(373.15);
        });
    });

    describe('Kelvin to Celsius', () => {
        test('should convert 273.15K to 0°C', () => {
            expect(convertTemperature(273.15, 'kelvin', 'celsius')).toBeCloseTo(0, 5);
        });

        test('should convert 0K to -273.15°C', () => {
            expect(convertTemperature(0, 'kelvin', 'celsius')).toBe(-273.15);
        });
    });

    describe('Fahrenheit to Kelvin', () => {
        test('should convert 32°F to 273.15K', () => {
            expect(convertTemperature(32, 'fahrenheit', 'kelvin')).toBeCloseTo(273.15, 2);
        });
    });

    describe('Same unit conversion', () => {
        test('should return same value for same unit', () => {
            expect(convertTemperature(50, 'celsius', 'celsius')).toBe(50);
            expect(convertTemperature(100, 'fahrenheit', 'fahrenheit')).toBe(100);
            expect(convertTemperature(300, 'kelvin', 'kelvin')).toBe(300);
        });
    });
});

describe('Unit Conversion Factors', () => {
    describe('Length conversions', () => {
        test('should have correct meter-based factors', () => {
            expect(unitConversions.length.meter).toBe(1);
            expect(unitConversions.length.kilometer).toBe(0.001);
            expect(unitConversions.length.centimeter).toBe(100);
            expect(unitConversions.length.millimeter).toBe(1000);
        });

        test('should convert 1 km to 1000 m', () => {
            // 1 km * (1/0.001) = 1000 m
            expect(1 / unitConversions.length.kilometer * unitConversions.length.meter).toBe(1000);
        });

        test('should convert 1 mile to approximately 1609 m', () => {
            const mileInMeters = 1 / unitConversions.length.mile;
            expect(mileInMeters).toBeCloseTo(1609.34, 0);
        });
    });

    describe('Mass conversions', () => {
        test('should have correct kilogram-based factors', () => {
            expect(unitConversions.mass.kilogram).toBe(1);
            expect(unitConversions.mass.gram).toBe(1000);
        });

        test('should convert 1 kg to approximately 2.2 pounds', () => {
            expect(unitConversions.mass.pound).toBeCloseTo(2.2, 1);
        });
    });

    describe('Time conversions', () => {
        test('should have correct second-based factors', () => {
            expect(unitConversions.time.second).toBe(1);
            expect(unitConversions.time.minute).toBeCloseTo(1/60, 10);
            expect(unitConversions.time.hour).toBeCloseTo(1/3600, 10);
        });

        test('should convert 1 day to 86400 seconds', () => {
            expect(1 / unitConversions.time.day).toBe(86400);
        });
    });

    describe('Area conversions', () => {
        test('should have correct square meter-based factors', () => {
            expect(unitConversions.area.squareMeter).toBe(1);
            expect(unitConversions.area.squareKilometer).toBe(0.000001);
        });

        test('should convert 1 hectare to 10000 m²', () => {
            expect(1 / unitConversions.area.hectare).toBe(10000);
        });
    });

    describe('Volume conversions', () => {
        test('should have correct liter-based factors', () => {
            expect(unitConversions.volume.liter).toBe(1);
            expect(unitConversions.volume.milliliter).toBe(1000);
        });

        test('should convert 1 gallon to approximately 3.78 liters', () => {
            expect(1 / unitConversions.volume.gallon).toBeCloseTo(3.78, 1);
        });
    });
});

describe('Unit Conversion Accuracy', () => {
    // Helper function to convert units
    const convertUnit = (value, category, from, to) => {
        if (category === 'temperature') {
            return convertTemperature(value, from, to);
        }
        const toBase = value / unitConversions[category][from];
        return toBase * unitConversions[category][to];
    };

    test('100 cm should equal 1 m', () => {
        expect(convertUnit(100, 'length', 'centimeter', 'meter')).toBeCloseTo(1, 5);
    });

    test('1000 g should equal 1 kg', () => {
        expect(convertUnit(1000, 'mass', 'gram', 'kilogram')).toBeCloseTo(1, 5);
    });

    test('3600 seconds should equal 1 hour', () => {
        expect(convertUnit(3600, 'time', 'second', 'hour')).toBeCloseTo(1, 5);
    });

    test('conversion should be reversible', () => {
        const original = 100;
        const toKm = convertUnit(original, 'length', 'meter', 'kilometer');
        const backToM = convertUnit(toKm, 'length', 'kilometer', 'meter');
        expect(backToM).toBeCloseTo(original, 5);
    });
});
