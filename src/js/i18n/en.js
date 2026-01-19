// English translations
const en = {
    // General UI
    settings: "Settings",
    mode: "Mode",
    darkMode: "Dark",
    lightMode: "Light",
    theme: "Theme",
    language: "Language",
    close: "Close",
    subtitle: "Advanced Equation Calculator",
    welcome: "Choose your tool to get started",
    back: "Back",
    result: "Result",
    calculate: "Calculate",
    solve: "Solve",
    clear: "Clear",
    error: "Error",
    invalidInput: "Please enter valid values",
    
    // Tools
    standard: "Standard",
    scientific: "Scientific",
    linear: "Linear",
    quadratic: "Quadratic",
    cubic: "Cubic",
    quartic: "Quartic",
    quintic: "Quintic",
    systems: "Systems",
    matrix: "Matrices",
    graph: "Graph",
    parametric: "Parametric",
    polar: "Polar",
    latex: "LaTeX",
    gcdlcm: "GCD/LCM",
    
    // Tool descriptions
    standardDesc: "Basic calculator operations",
    scientificDesc: "Advanced mathematical functions",
    linearDesc: "Solve 1st degree equations",
    quadraticDesc: "Solve 2nd degree equations",
    cubicDesc: "Solve 3rd degree equations",
    systemsDesc: "Solve systems of equations",
    historyDesc: "View calculation history",
    matrixDesc: "Operations on 2×2 and 3×3 matrices",
    graphDesc: "Visualize equations",
    
    // Tool titles
    linearTitle: "Linear Equation",
    quadraticTitle: "Quadratic Equation",
    cubicTitle: "Cubic Equation",
    quarticTitle: "Quartic Equation",
    quinticTitle: "Quintic Equation",
    systemsTitle: "System of 2 Equations",
    system3x3Title: "System of 3 Equations (3x3)",
    matrixTitle: "Matrix Calculator",
    graphTitle: "Graph Visualization",
    parametricTitle: "Parametric Equations",
    polarTitle: "Polar Equations",
    latexTitle: "LaTeX Equation Input",
    
    // Multi-degree
    multiDegreeTitle: "Multi-degree Equations",
    multiDegreeDesc: "Solve linear up to cubic cases",
    multiDegreeHint: "Choose a degree",
    chooseSystemSize: "Choose system size",
    system2x2: "2x2 System",
    system3x3: "3x3 System",
    degreeOne: "1st degree",
    degreeTwo: "2nd degree",
    degreeThree: "3rd degree",
    degreeFour: "4th degree",
    degreeFive: "5th degree",
    
    // Hints
    linearHint: "Use Tab to navigate between fields",
    quadraticHint: "Use Tab to navigate between fields",
    cubicHint: "Use Tab to navigate between fields",
    quarticHint: "Use Tab to navigate between fields",
    quinticHint: "Use Tab to navigate between fields",
    systemsHint: "Use Tab to navigate between fields",
    system3x3Hint: "Enter coefficients for 3 variables",
    matrixHint: "Enter matrix values",
    
    // Solutions
    noRealSolutions: "No real solutions",
    solutionsFound: "solution(s) found",
    coefficient: "Coefficient",
    historyTitle: "History",
    clearHistory: "Clear",
    solution: "Solution",
    steps: "Solution Steps",
    exportPdf: "Export PDF",
    noSolution: "No solution",
    infiniteSolutions: "Infinite solutions",
    twoSolutions: "Two solutions",
    twoComplexSolutions: "Two complex conjugate solutions",
    oneSolution: "One solution",
    threeSolutions: "Three solutions",
    oneRealTwoComplex: "One real solution and two complex conjugates",
    realSolution: "real",
    complexSolution: "complex",
    complexRootsExplanation: "When Δ < 0, roots are complex conjugates:",
    discriminant: "Discriminant",
    enterEquation: "Enter your equation:",
    invalidFormat: "Invalid equation format",
    determinant: "Determinant",
    
    // Inequalities
    inequalities: "Inequalities",
    inequalitiesDesc: "Solve linear and quadratic",
    linearInequality: "Linear",
    quadraticInequality: "Quadratic",
    linearInequalityTitle: "Linear Inequality",
    quadraticInequalityTitle: "Quadratic Inequality",
    chooseType: "Choose type",
    inequality: "Inequality",
    inequalityHint: "Choose the inequality type and coefficients",
    solutionSet: "Solution set",
    intervalNotation: "Interval notation",
    divideNegative: "Dividing by negative number, inequality flips",
    notQuadratic: "Coefficient a cannot be zero for quadratic inequality",
    noRealRoots: "no real roots",
    oneRoot: "one root",
    twoRoots: "two roots",
    findRoots: "Find roots of",
    parabUpAlwaysPos: "Parabola opens upward, always positive",
    parabDownAlwaysNeg: "Parabola opens downward, always negative",
    parabolaTouches: "Parabola touches x-axis at",
    parabUpSign: "Parabola opens upward: negative between roots",
    parabDownSign: "Parabola opens downward: positive between roots",
    uniqueSolution: "Unique solution",
    system3x3NoUniqueSolution: "No unique solution (system is singular or dependent)",
    parallelLines: "Parallel lines (no solution)",
    coincidentLines: "Coincident lines (infinite solutions)",
    
    // Matrix
    matrixSize: "Matrix size",
    matrix2x2: "2×2 Matrix",
    matrix3x3: "3×3 Matrix",
    operation: "Operation",
    addition: "Addition",
    multiplication: "Multiplication",
    determinantCalc: "Determinant",
    inverse: "Inverse",
    matrixA: "Matrix A",
    matrixB: "Matrix B",
    singularMatrix: "Singular matrix (determinant = 0, no inverse)",
    invalidMatrix: "Invalid matrices for this operation",
    
    // Graph
    selectEquation: "Select equation",
    xRange: "X Range",
    yRange: "Y Range",
    showGrid: "Show grid",
    showAxes: "Show axes",
    plotGraph: "Plot graph",
    resetView: "Reset view",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    
    // Theme
    customTheme: "Custom Theme Builder",
    primaryColor: "Primary Color",
    secondaryColor: "Secondary Color",
    accentColor: "Accent Color",
    bgPrimary: "Background Primary",
    bgSecondary: "Background Secondary",
    applyTheme: "Apply Theme",
    saveTheme: "Save Theme",
    
    // LaTeX
    enterLatex: "Enter LaTeX equation:",
    parseAndSolve: "Parse and Solve",
    shortcuts: "Quick Insert:",
    examples: "Examples:",
    latexHint: "Supports polynomial equations. Enter coefficients using LaTeX syntax.",
    
    // Parametric/Polar
    tRange: "t Range:",
    parametricHint: "Use t as parameter. Supported: sin, cos, tan, sqrt, pow, exp, log",
    thetaRange: "Theta Range:",
    presets: "Presets:",
    polarHint: "Use theta as angle. Supported: sin, cos, tan, sqrt, pow, abs",
    
    // Step by step
    startEquation: "Starting equation",
    moveConstant: "Move constant to the right side",
    divideByCoef: "Divide by coefficient",
    simplify: "Simplify",
    calcDiscriminant: "Calculate discriminant",
    discriminantValue: "Discriminant value",
    deltaLessThanZero: "Delta < 0, no real solutions",
    deltaEqualsZero: "Delta = 0, one solution",
    deltaGreaterThanZero: "Delta > 0, two solutions",
    calcX1: "Calculate x1",
    calcX2: "Calculate x2",
    
    // PWA
    offlineReady: "App ready for offline use",
    updateAvailable: "New version available",
    installApp: "Install app",
    installed: "App installed",
    
    // GCD/LCM
    gcdlcmTitle: "GCD and LCM Calculator",
    gcdlcmDesc: "Calculate the Greatest Common Divisor and Least Common Multiple of two or more numbers",
    enterNumbers: "Enter numbers (comma separated):",
    gcdlcmHint: "Enter at least 2 positive integers separated by commas",
    gcdlcmError: "Please enter at least 2 positive integers",
    numbers: "Numbers",
    gcdResult: "GCD (Greatest Common Divisor)",
    lcmResult: "LCM (Least Common Multiple)",
    primeFactorizations: "Prime Factorizations",
    
    // ===================================
    // NEW MENU CATEGORIES
    // ===================================
    
    // Number Tools Category
    numberTools: "Number Tools",
    numberToolsDesc: "GCD, LCM, fractions, and more",
    
    // Statistics Category
    statistics: "Statistics",
    statisticsDesc: "Statistical analysis tools",
    
    // Converters Category
    converters: "Converters",
    convertersDesc: "Unit and base conversions",
    
    // Calculus Category
    calculus: "Calculus",
    calculusDesc: "Limits, series, and integration",
    
    // ===================================
    // MODULAR ARITHMETIC
    // ===================================
    modular: "Modular",
    modularTitle: "Modular Arithmetic Calculator",
    modularDesc: "Modulo, modular inverse, modular exponentiation",
    modularHint: "Enter values for modular operations",
    moduloOperation: "Modulo (a mod n)",
    modInverseOperation: "Modular Inverse (a⁻¹ mod n)",
    modPowerOperation: "Modular Power (a^b mod n)",
    valueA: "Value a:",
    valueB: "Value b (for power):",
    modulus: "Modulus n:",
    moduloResult: "a mod n",
    modInverseResult: "Modular Inverse",
    modPowerResult: "a^b mod n",
    noModInverse: "No modular inverse exists (a and n are not coprime)",
    selectModOperation: "Select operation:",
    
    // ===================================
    // COMBINATORICS
    // ===================================
    combinatorics: "Combinatorics",
    combinatoricsTitle: "Combinatorics Calculator",
    combinatoricsDesc: "Permutations, combinations, binomial coefficients",
    combinatoricsHint: "Enter values for combinatorial calculations",
    permutation: "Permutation P(n,r)",
    combination: "Combination C(n,r)",
    binomial: "Binomial Coefficient",
    factorial: "Factorial n!",
    valueN: "Value n:",
    valueR: "Value r:",
    permutationResult: "P(n,r) = n!/(n-r)!",
    combinationResult: "C(n,r) = n!/[r!(n-r)!]",
    binomialResult: "Binomial coefficient",
    factorialResult: "n! = ",
    invalidNR: "n must be ≥ r and both must be non-negative integers",
    selectCombOperation: "Select operation:",
    
    // ===================================
    // BASE CONVERTER
    // ===================================
    baseConverter: "Base Converter",
    baseConverterTitle: "Number Base Converter",
    baseConverterDesc: "Convert between binary, octal, decimal, hexadecimal",
    baseConverterHint: "Enter a number and select the source base",
    inputNumber: "Input number:",
    fromBase: "From base:",
    binary: "Binary (2)",
    octal: "Octal (8)",
    decimal: "Decimal (10)",
    hexadecimal: "Hexadecimal (16)",
    conversionResults: "Conversion Results",
    binaryResult: "Binary (base 2)",
    octalResult: "Octal (base 8)",
    decimalResult: "Decimal (base 10)",
    hexResult: "Hexadecimal (base 16)",
    invalidBaseNumber: "Invalid number for the selected base",
    
    // ===================================
    // FRACTION CALCULATOR
    // ===================================
    fractions: "Fractions",
    fractionsTitle: "Fraction Calculator",
    fractionsDesc: "Add, subtract, multiply, divide fractions with simplification",
    fractionsHint: "Enter fractions as numerator/denominator",
    fraction1: "Fraction 1:",
    fraction2: "Fraction 2:",
    numerator: "Numerator",
    denominator: "Denominator",
    fractionOperation: "Operation:",
    addFractions: "Add (+)",
    subtractFractions: "Subtract (−)",
    multiplyFractions: "Multiply (×)",
    divideFractions: "Divide (÷)",
    simplifyFraction: "Simplify",
    fractionResult: "Result",
    simplifiedForm: "Simplified form",
    mixedNumber: "Mixed number",
    decimalValue: "Decimal value",
    invalidFraction: "Please enter valid fractions (denominator cannot be 0)",
    
    // ===================================
    // PERCENTAGE CALCULATOR
    // ===================================
    percentage: "Percentage",
    percentageTitle: "Percentage Calculator",
    percentageDesc: "Calculate percentage increase, decrease, and difference",
    percentageHint: "Select an operation and enter values",
    percentOf: "What is X% of Y?",
    percentChange: "Percentage change from X to Y",
    percentIncrease: "Increase X by Y%",
    percentDecrease: "Decrease X by Y%",
    valueX: "Value X:",
    valueY: "Value Y:",
    percentResult: "Result",
    percentageValue: "Percentage value",
    originalValue: "Original value",
    newValue: "New value",
    changePercent: "Change (%)",
    isIncreaseOf: "is an increase of",
    isDecreaseOf: "is a decrease of",
    selectPercentOperation: "Select operation:",
    
    // ===================================
    // RATIO AND PROPORTION
    // ===================================
    ratio: "Ratio",
    ratioTitle: "Ratio and Proportion Solver",
    ratioDesc: "Solve proportions, find missing values, simplify ratios",
    ratioHint: "Enter values for ratio calculations",
    simplifyRatio: "Simplify Ratio",
    solveProportion: "Solve Proportion (a:b = c:x)",
    ratioA: "a:",
    ratioB: "b:",
    ratioC: "c:",
    ratioX: "x (unknown):",
    simplifiedRatio: "Simplified ratio",
    proportionResult: "Proportion solution",
    ratioEquals: "equals",
    missingValue: "Missing value x",
    enterRatioValues: "Enter at least two values",
    selectRatioOperation: "Select operation:",
    
    // ===================================
    // UNIT CONVERTER
    // ===================================
    unitConverter: "Unit Converter",
    unitConverterTitle: "Unit Converter",
    unitConverterDesc: "Convert between units of length, mass, temperature, time, area, volume",
    unitConverterHint: "Select category and units",
    selectCategory: "Category:",
    fromUnit: "From:",
    toUnit: "To:",
    inputValue: "Value:",
    length: "Length",
    mass: "Mass",
    temperature: "Temperature",
    time: "Time",
    area: "Area",
    volume: "Volume",
    // Length units
    meter: "Meter (m)",
    kilometer: "Kilometer (km)",
    centimeter: "Centimeter (cm)",
    millimeter: "Millimeter (mm)",
    mile: "Mile (mi)",
    yard: "Yard (yd)",
    foot: "Foot (ft)",
    inch: "Inch (in)",
    // Mass units
    kilogram: "Kilogram (kg)",
    gram: "Gram (g)",
    milligram: "Milligram (mg)",
    pound: "Pound (lb)",
    ounce: "Ounce (oz)",
    ton: "Metric Ton (t)",
    // Temperature units
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    kelvin: "Kelvin (K)",
    // Time units
    second: "Second (s)",
    minute: "Minute (min)",
    hour: "Hour (h)",
    day: "Day (d)",
    week: "Week (wk)",
    month: "Month (mo)",
    year: "Year (yr)",
    // Area units
    squareMeter: "Square Meter (m²)",
    squareKilometer: "Square Kilometer (km²)",
    squareFoot: "Square Foot (ft²)",
    squareMile: "Square Mile (mi²)",
    acre: "Acre",
    hectare: "Hectare (ha)",
    // Volume units
    liter: "Liter (L)",
    milliliter: "Milliliter (mL)",
    cubicMeter: "Cubic Meter (m³)",
    gallon: "Gallon (gal)",
    quart: "Quart (qt)",
    pint: "Pint (pt)",
    cup: "Cup",
    
    // ===================================
    // STATISTICS CALCULATOR
    // ===================================
    statisticsCalc: "Statistics",
    statisticsCalcTitle: "Statistics Calculator",
    statisticsCalcDesc: "Mean, median, mode, variance, standard deviation",
    statisticsHint: "Enter numbers separated by commas",
    enterDataSet: "Enter data set:",
    mean: "Mean (Average)",
    median: "Median",
    mode: "Mode",
    variance: "Variance",
    stdDeviation: "Standard Deviation",
    range: "Range",
    sum: "Sum",
    count: "Count",
    min: "Minimum",
    max: "Maximum",
    noMode: "No mode (all values appear equally)",
    multipleMode: "Multiple modes",
    statisticsResults: "Statistical Analysis",
    
    // ===================================
    // SEQUENCE CALCULATOR
    // ===================================
    sequences: "Sequences",
    sequencesTitle: "Sequence Calculator",
    sequencesDesc: "Arithmetic, geometric, and Fibonacci sequences",
    sequencesHint: "Configure sequence parameters",
    arithmeticSeq: "Arithmetic Sequence",
    geometricSeq: "Geometric Sequence",
    fibonacciSeq: "Fibonacci Sequence",
    firstTerm: "First term (a₁):",
    commonDiff: "Common difference (d):",
    commonRatio: "Common ratio (r):",
    numTerms: "Number of terms (n):",
    nthTerm: "Find nth term:",
    sequenceTerms: "Sequence terms",
    sumOfTerms: "Sum of terms",
    nthTermResult: "nth term",
    generalFormula: "General formula",
    selectSeqType: "Sequence type:",
    
    // ===================================
    // LIMIT CALCULATOR
    // ===================================
    limits: "Limits",
    limitsTitle: "Limit Calculator",
    limitsDesc: "Calculate limits of simple functions",
    limitsHint: "Enter function and limit point",
    enterFunction: "Function f(x):",
    limitPoint: "x approaches:",
    limitDirection: "Direction:",
    fromLeft: "From left (x⁻)",
    fromRight: "From right (x⁺)",
    bothSides: "Both sides",
    limitResult: "Limit result",
    limitExists: "Limit exists",
    limitDNE: "Limit does not exist",
    infinity: "Infinity (∞)",
    negInfinity: "Negative infinity (-∞)",
    indeterminate: "Indeterminate form",
    limitExamples: "Examples: x^2, sin(x)/x, 1/x, sqrt(x)",
    
    // ===================================
    // TAYLOR SERIES
    // ===================================
    taylor: "Taylor Series",
    taylorTitle: "Taylor Series Calculator",
    taylorDesc: "Taylor and Maclaurin series expansions",
    taylorHint: "Select function and number of terms",
    selectFunction: "Function:",
    expansionPoint: "Expansion point (a):",
    numSeriesTerms: "Number of terms:",
    taylorResult: "Taylor Series Expansion",
    maclaurinNote: "Maclaurin series (a = 0)",
    polynomialApprox: "Polynomial approximation",
    remainderTerm: "Remainder term",
    convergenceRadius: "Radius of convergence",
    sinFunction: "sin(x)",
    cosFunction: "cos(x)",
    expFunction: "e^x",
    lnFunction: "ln(1+x)",
    atanFunction: "arctan(x)",
    
    // ===================================
    // NUMERICAL INTEGRATION
    // ===================================
    integration: "Integration",
    integrationTitle: "Numerical Integration",
    integrationDesc: "Trapezoidal and Simpson's rule integration",
    integrationHint: "Enter function and integration bounds",
    functionToIntegrate: "Function f(x):",
    lowerBound: "Lower bound (a):",
    upperBound: "Upper bound (b):",
    numIntervals: "Number of intervals (n):",
    integrationMethod: "Method:",
    trapezoidalRule: "Trapezoidal Rule",
    simpsonsRule: "Simpson's Rule",
    integrationResult: "Integration Result",
    approximateValue: "Approximate value",
    estimatedError: "Estimated error",
    methodUsed: "Method used",
    intervalsUsed: "Intervals used",
    simpsonsNote: "Note: Simpson's rule requires even number of intervals"
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = en;
}
