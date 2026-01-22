/**
 * EquaSolver - Main Export Index for CommonJS (Jest Tests)
 * This file provides all exports for testing purposes
 * Browser uses script.js with ES6 modules
 */

// Math modules
const { 
    complexAdd, complexSub, complexMul, complexDiv, formatComplex, complexConjugate, 
    separateRoots, solveQuadraticComplex, solveCubicComplex, complexFromReal, 
    findPolynomialRootsComplex, complexScale, complexPow, complexSqrt, complexAbs,
    isEssentiallyReal, isEssentiallyZero
} = require('./math/complex.js');
const { addMatrices, multiplyMatrices, calculateDeterminant, invertMatrix, solveSystem3x3 } = require('./math/matrix.js');
const { gcd, lcm, gcdMultiple, lcmMultiple, primeFactorization, formatFactorization } = require('./math/gcd-lcm.js');
const { modulo, modularInverse, modularPower } = require('./math/modular.js');
const { factorial, factorialBig, permutation, combination } = require('./math/combinatorics.js');
const { simplifyFraction, simplifyFractionFunc, addFractions, multiplyFractions, divideFractions, fractionToDecimal, decimalToFraction, fractionToMixed } = require('./math/fractions.js');
const { calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStdDev } = require('./math/statistics.js');
const { generateArithmeticSequence, generateGeometricSequence, generateFibonacciSequence } = require('./math/sequences.js');

// Calculus modules
const { evaluateLimitFunction, evaluateLimit } = require('./calculus/limits.js');
const { taylorSin, taylorCos, taylorExp, taylorLn, taylorAtan } = require('./calculus/taylor.js');
const { trapezoidalRule, simpsonsRule } = require('./calculus/numerical-integration.js');

// Solver modules
const { solveLinearInequality, solveQuadraticInequality, solveAbsoluteInequality, formatInequality, flipOperator, evaluateComparison, formatOperator } = require('./solvers/inequality.js');
const { parsePolynomial, dividePolynomials, formatPolynomial } = require('./solvers/polynomial-division.js');
const { solveExponentialSimple, solveExponentialWithCoefficient, solveLogarithmicSimple, solveLogarithmicWithArgument, solveNaturalLog, solveCommonLog, solveNaturalExponential } = require('./solvers/exponential-log.js');

// Converter modules
const { convertBase } = require('./converters/base.js');
const { unitConversions, convertTemperature, convertUnit } = require('./converters/units.js');

// Parser modules
const { parseLatex } = require('./parsers/latex.js');
const { evaluateExpression, safeEval, preprocessExpression, implicitMultiplication } = require('./parsers/expression.js');

// Export all functions
module.exports = {
    // Complex
    complexAdd,
    complexSub,
    complexMul,
    complexDiv,
    complexScale,
    complexPow,
    complexSqrt,
    complexAbs,
    formatComplex,
    complexConjugate,
    complexFromReal,
    isEssentiallyReal,
    isEssentiallyZero,
    separateRoots,
    findPolynomialRootsComplex,
    
    // Matrix
    addMatrices,
    multiplyMatrices,
    calculateDeterminant,
    invertMatrix,
    solveSystem3x3,
    
    // GCD/LCM
    gcd,
    lcm,
    gcdMultiple,
    lcmMultiple,
    primeFactorization,
    formatFactorization,
    
    // Modular
    modulo,
    modularInverse,
    modularPower,
    
    // Combinatorics
    factorial,
    factorialBig,
    permutation,
    combination,
    
    // Fractions
    simplifyFraction,
    simplifyFractionFunc,
    addFractions,
    multiplyFractions,
    divideFractions,
    fractionToDecimal,
    decimalToFraction,
    fractionToMixed,
    
    // Statistics
    calculateMean,
    calculateMedian,
    calculateMode,
    calculateVariance,
    calculateStdDev,
    
    // Sequences
    generateArithmeticSequence,
    generateGeometricSequence,
    generateFibonacciSequence,
    
    // Limits/Calculus
    evaluateLimitFunction,
    evaluateLimit,
    
    // Taylor Series
    taylorSin,
    taylorCos,
    taylorExp,
    taylorLn,
    taylorAtan,
    
    // Numerical Integration
    trapezoidalRule,
    simpsonsRule,
    
    // Inequality Solver
    solveLinearInequality,
    solveQuadraticInequality,
    solveAbsoluteInequality,
    formatInequality,
    flipOperator,
    evaluateComparison,
    formatOperator,
    
    // Polynomial Division
    parsePolynomial,
    dividePolynomials,
    formatPolynomial,
    
    // Exponential & Logarithmic Solvers
    solveExponentialSimple,
    solveExponentialWithCoefficient,
    solveLogarithmicSimple,
    solveLogarithmicWithArgument,
    solveNaturalLog,
    solveCommonLog,
    solveNaturalExponential,
    
    // Base Conversion
    convertBase,
    
    // Unit Conversion
    unitConversions,
    convertTemperature,
    convertUnit,
    
    // LaTeX Parser
    parseLatex,
    
    // Expression Evaluation
    evaluateExpression,
    safeEval,
    preprocessExpression,
    implicitMultiplication,
    
    // Equation Solvers (from complex.js)
    solveQuadraticComplex,
    solveCubicComplex
};
