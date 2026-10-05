const {
    erf, normalPdf, normalCdf, logFactorial, binomialPmf, binomialCdf, poissonPmf, poissonCdf
} = require('../../src/js/math/probability.js');

describe('erf', () => {
    test('known values', () => {
        expect(erf(0)).toBe(0);
        expect(erf(1)).toBeCloseTo(0.8427007929497149, 12);
        expect(erf(2)).toBeCloseTo(0.9953222650189527, 12);
        expect(erf(3.5)).toBeCloseTo(0.9999992569016276, 12);
    });

    test('odd function, saturates', () => {
        expect(erf(-1)).toBeCloseTo(-erf(1), 14);
        expect(erf(10)).toBe(1);
        expect(erf(-10)).toBe(-1);
        expect(Number.isNaN(erf(NaN))).toBe(true);
    });
});

describe('normal distribution', () => {
    test('standard normal cdf', () => {
        expect(normalCdf(0)).toBeCloseTo(0.5, 14);
        expect(normalCdf(1.96)).toBeCloseTo(0.9750021048517795, 10);
        expect(normalCdf(-1.96)).toBeCloseTo(0.0249978951482205, 10);
        expect(normalCdf(1)).toBeCloseTo(0.8413447460685429, 12);
    });

    test('tails stay accurate and monotone', () => {
        expect(normalCdf(-5)).toBeCloseTo(2.866515718791939e-7, 15);
        expect(normalCdf(5)).toBeCloseTo(1 - 2.866515718791939e-7, 12);
        expect(normalCdf(3.0001)).toBeGreaterThan(normalCdf(2.9999));
        expect(normalCdf(-3.0001)).toBeLessThan(normalCdf(-2.9999));
    });

    test('location and scale', () => {
        expect(normalCdf(100, 100, 15)).toBeCloseTo(0.5, 14);
        expect(normalCdf(115, 100, 15)).toBeCloseTo(normalCdf(1), 14);
    });

    test('pdf', () => {
        expect(normalPdf(0)).toBeCloseTo(0.3989422804014327, 14);
        expect(normalPdf(10, 10, 2)).toBeCloseTo(0.3989422804014327 / 2, 14);
    });

    test('invalid sigma', () => {
        expect(Number.isNaN(normalCdf(0, 0, 0))).toBe(true);
        expect(Number.isNaN(normalPdf(0, 0, -1))).toBe(true);
    });
});

describe('logFactorial', () => {
    test('matches exact factorials', () => {
        expect(logFactorial(0)).toBe(0);
        expect(logFactorial(5)).toBeCloseTo(Math.log(120), 12);
        expect(logFactorial(20)).toBeCloseTo(Math.log(2432902008176640000), 12);
    });

    test('Stirling regime', () => {
        expect(logFactorial(21)).toBeCloseTo(Math.log(2432902008176640000) + Math.log(21), 10);
        expect(logFactorial(100)).toBeCloseTo(363.73937555556347, 8);
    });
});

describe('binomial distribution', () => {
    test('pmf', () => {
        expect(binomialPmf(3, 10, 0.5)).toBeCloseTo(120 / 1024, 12);
        expect(binomialPmf(0, 5, 0.2)).toBeCloseTo(0.8 ** 5, 12);
    });

    test('pmf sums to one', () => {
        let sum = 0;
        for (let k = 0; k <= 60; k++) sum += binomialPmf(k, 60, 0.3);
        expect(sum).toBeCloseTo(1, 10);
    });

    test('cdf', () => {
        expect(binomialCdf(5, 10, 0.5)).toBeCloseTo(0.623046875, 12);
        expect(binomialCdf(-1, 10, 0.5)).toBe(0);
        expect(binomialCdf(10, 10, 0.5)).toBe(1);
        expect(binomialCdf(99, 10, 0.5)).toBe(1);
    });

    test('degenerate probabilities', () => {
        expect(binomialPmf(0, 4, 0)).toBe(1);
        expect(binomialPmf(4, 4, 1)).toBe(1);
        expect(binomialPmf(2, 4, 1)).toBe(0);
    });

    test('out of support and invalid parameters', () => {
        expect(binomialPmf(11, 10, 0.5)).toBe(0);
        expect(binomialPmf(-1, 10, 0.5)).toBe(0);
        expect(Number.isNaN(binomialPmf(1, 10, 1.5))).toBe(true);
        expect(Number.isNaN(binomialPmf(1, 2.5, 0.5))).toBe(true);
        expect(Number.isNaN(binomialPmf(1.5, 10, 0.5))).toBe(true);
    });
});

describe('poisson distribution', () => {
    test('pmf', () => {
        expect(poissonPmf(0, 2)).toBeCloseTo(Math.exp(-2), 14);
        expect(poissonPmf(3, 2)).toBeCloseTo(Math.exp(-2) * 8 / 6, 14);
    });

    test('cdf', () => {
        expect(poissonCdf(2, 2)).toBeCloseTo(Math.exp(-2) * 5, 14);
        expect(poissonCdf(-1, 2)).toBe(0);
        expect(poissonCdf(100, 2)).toBeCloseTo(1, 14);
    });

    test('lambda zero and invalid input', () => {
        expect(poissonPmf(0, 0)).toBe(1);
        expect(poissonPmf(2, 0)).toBe(0);
        expect(Number.isNaN(poissonPmf(1, -1))).toBe(true);
        expect(Number.isNaN(poissonCdf(1.5, 2))).toBe(true);
    });
});
