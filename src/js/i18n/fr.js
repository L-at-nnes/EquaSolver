// French translations
const fr = {
    // General UI
    settings: "Paramètres",
    mode: "Mode",
    darkMode: "Sombre",
    lightMode: "Clair",
    theme: "Thème",
    language: "Langue",
    close: "Fermer",
    subtitle: "Calculatrice d'équations avancée",
    welcome: "Choisissez votre outil pour commencer",
    back: "Retour",
    result: "Résultat",
    calculate: "Calculer",
    solve: "Résoudre",
    clear: "Effacer",
    error: "Erreur",
    invalidInput: "Veuillez entrer des valeurs valides",
    
    // Tools
    standard: "Standard",
    scientific: "Scientifique",
    linear: "1er Degré",
    quadratic: "2nd Degré",
    cubic: "3ème Degré",
    quartic: "4e degré",
    quintic: "5e degré",
    systems: "Systèmes",
    matrix: "Matrices",
    graph: "Graphique",
    parametric: "Paramétrique",
    polar: "Polaire",
    latex: "LaTeX",
    gcdlcm: "PGCD/PPCM",
    
    // Tool descriptions
    standardDesc: "Opérations de base",
    scientificDesc: "Fonctions mathématiques avancées",
    linearDesc: "Résoudre équations 1er degré",
    quadraticDesc: "Résoudre équations 2nd degré",
    cubicDesc: "Résoudre équations 3ème degré",
    systemsDesc: "Résoudre systèmes d'équations",
    historyDesc: "Voir l'historique des calculs",
    matrixDesc: "Opérations sur matrices 2×2 et 3×3",
    graphDesc: "Visualiser les équations",
    
    // Tool titles
    linearTitle: "Équation du 1er degré",
    quadraticTitle: "Équation du 2nd degré",
    cubicTitle: "Équation du 3ème degré",
    quarticTitle: "Équation du 4e degré",
    quinticTitle: "Équation du 5e degré",
    systemsTitle: "Système de 2 équations",
    matrixTitle: "Calculateur de matrices",
    graphTitle: "Visualisation graphique",
    parametricTitle: "Équations paramétriques",
    polarTitle: "Équations polaires",
    latexTitle: "Saisie d'équation LaTeX",
    
    // Multi-degree
    multiDegreeTitle: "Équations multi-degrés",
    multiDegreeDesc: "Accédez aux résolveurs 1er à 3e degré",
    multiDegreeHint: "Choisissez un degré",
    degreeOne: "1er degré",
    degreeTwo: "2e degré",
    degreeThree: "3e degré",
    degreeFour: "4e degré",
    degreeFive: "5e degré",
    
    // Hints
    linearHint: "Utilisez Tab pour naviguer entre les champs",
    quadraticHint: "Utilisez Tab pour naviguer entre les champs",
    cubicHint: "Utilisez Tab pour naviguer entre les champs",
    quarticHint: "Utilisez Tab pour naviguer entre les champs",
    quinticHint: "Utilisez Tab pour naviguer entre les champs",
    systemsHint: "Utilisez Tab pour naviguer entre les champs",
    matrixHint: "Entrez les valeurs de la matrice",
    
    // Solutions
    noRealSolutions: "Pas de solutions réelles",
    solutionsFound: "solution(s) trouvée(s)",
    coefficient: "Coefficient",
    historyTitle: "Historique",
    clearHistory: "Effacer",
    solution: "Solution",
    steps: "Étapes de résolution",
    exportPdf: "Exporter PDF",
    noSolution: "Pas de solution",
    infiniteSolutions: "Infinité de solutions",
    twoSolutions: "Deux solutions",
    oneSolution: "Une solution",
    threeSolutions: "Trois solutions",
    discriminant: "Discriminant",
    enterEquation: "Entrez votre équation :",
    invalidFormat: "Format d'équation invalide",
    determinant: "Déterminant",
    uniqueSolution: "Solution unique",
    parallelLines: "Droites parallèles (pas de solution)",
    coincidentLines: "Droites confondues (infinité de solutions)",
    
    // Matrix
    matrixSize: "Taille de la matrice",
    matrix2x2: "Matrice 2×2",
    matrix3x3: "Matrice 3×3",
    operation: "Opération",
    addition: "Addition",
    multiplication: "Multiplication",
    determinantCalc: "Déterminant",
    inverse: "Inverse",
    matrixA: "Matrice A",
    matrixB: "Matrice B",
    singularMatrix: "Matrice singulière (déterminant = 0, pas d'inverse)",
    invalidMatrix: "Matrices invalides pour cette opération",
    
    // Graph
    selectEquation: "Sélectionner l'équation",
    xRange: "Plage X",
    yRange: "Plage Y",
    showGrid: "Afficher la grille",
    showAxes: "Afficher les axes",
    plotGraph: "Tracer le graphique",
    resetView: "Réinitialiser la vue",
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    
    // Theme
    customTheme: "Constructeur de thème personnalisé",
    primaryColor: "Couleur primaire",
    secondaryColor: "Couleur secondaire",
    accentColor: "Couleur d'accent",
    bgPrimary: "Fond primaire",
    bgSecondary: "Fond secondaire",
    applyTheme: "Appliquer le thème",
    saveTheme: "Sauvegarder le thème",
    
    // LaTeX
    enterLatex: "Entrez l'équation LaTeX:",
    parseAndSolve: "Analyser et résoudre",
    shortcuts: "Insertion rapide:",
    examples: "Exemples:",
    latexHint: "Supporte les équations polynomiales. Entrez les coefficients en syntaxe LaTeX.",
    
    // Parametric/Polar
    tRange: "Intervalle t:",
    parametricHint: "Utilisez t comme paramètre. Supporte: sin, cos, tan, sqrt, pow, exp, log",
    thetaRange: "Intervalle theta:",
    presets: "Prédéfinis:",
    polarHint: "Utilisez theta comme angle. Supporte: sin, cos, tan, sqrt, pow, abs",
    
    // Step by step
    startEquation: "Équation de départ",
    moveConstant: "Déplacer la constante à droite",
    divideByCoef: "Diviser par le coefficient",
    simplify: "Simplifier",
    calcDiscriminant: "Calculer le discriminant",
    discriminantValue: "Valeur du discriminant",
    deltaLessThanZero: "Delta < 0, pas de solutions réelles",
    deltaEqualsZero: "Delta = 0, une solution",
    deltaGreaterThanZero: "Delta > 0, deux solutions",
    calcX1: "Calculer x1",
    calcX2: "Calculer x2",
    
    // PWA
    offlineReady: "Application prête pour utilisation hors ligne",
    updateAvailable: "Nouvelle version disponible",
    installApp: "Installer l'application",
    installed: "Application installée",
    
    // GCD/LCM
    gcdlcmTitle: "Calculateur PGCD et PPCM",
    gcdlcmDesc: "Calculer le Plus Grand Commun Diviseur et le Plus Petit Commun Multiple",
    enterNumbers: "Entrez les nombres (séparés par des virgules):",
    gcdlcmHint: "Entrez au moins 2 entiers positifs séparés par des virgules",
    gcdlcmError: "Veuillez entrer au moins 2 entiers positifs",
    numbers: "Nombres",
    gcdResult: "PGCD (Plus Grand Commun Diviseur)",
    lcmResult: "PPCM (Plus Petit Commun Multiple)",
    primeFactorizations: "Décompositions en facteurs premiers",
    
    // ===================================
    // NEW MENU CATEGORIES
    // ===================================
    
    // Number Tools Category
    numberTools: "Outils Numériques",
    numberToolsDesc: "PGCD, PPCM, fractions et plus",
    
    // Statistics Category
    statistics: "Statistiques",
    statisticsDesc: "Outils d'analyse statistique",
    
    // Converters Category
    converters: "Convertisseurs",
    convertersDesc: "Conversions d'unités et de bases",
    
    // Calculus Category
    calculus: "Calcul",
    calculusDesc: "Limites, séries et intégration",
    
    // ===================================
    // MODULAR ARITHMETIC
    // ===================================
    modular: "Modulaire",
    modularTitle: "Calculateur d'arithmétique modulaire",
    modularDesc: "Modulo, inverse modulaire, exponentiation modulaire",
    modularHint: "Entrez les valeurs pour les opérations modulaires",
    moduloOperation: "Modulo (a mod n)",
    modInverseOperation: "Inverse modulaire (a⁻¹ mod n)",
    modPowerOperation: "Puissance modulaire (a^b mod n)",
    valueA: "Valeur a:",
    valueB: "Valeur b (pour la puissance):",
    modulus: "Module n:",
    moduloResult: "a mod n",
    modInverseResult: "Inverse modulaire",
    modPowerResult: "a^b mod n",
    noModInverse: "Pas d'inverse modulaire (a et n ne sont pas premiers entre eux)",
    selectModOperation: "Sélectionner l'opération:",
    
    // ===================================
    // COMBINATORICS
    // ===================================
    combinatorics: "Combinatoire",
    combinatoricsTitle: "Calculateur de combinatoire",
    combinatoricsDesc: "Permutations, combinaisons, coefficients binomiaux",
    combinatoricsHint: "Entrez les valeurs pour les calculs combinatoires",
    permutation: "Permutation P(n,r)",
    combination: "Combinaison C(n,r)",
    binomial: "Coefficient binomial",
    factorial: "Factorielle n!",
    valueN: "Valeur n:",
    valueR: "Valeur r:",
    permutationResult: "P(n,r) = n!/(n-r)!",
    combinationResult: "C(n,r) = n!/[r!(n-r)!]",
    binomialResult: "Coefficient binomial",
    factorialResult: "n! = ",
    invalidNR: "n doit être ≥ r et les deux doivent être des entiers non négatifs",
    selectCombOperation: "Sélectionner l'opération:",
    
    // ===================================
    // BASE CONVERTER
    // ===================================
    baseConverter: "Convertisseur de base",
    baseConverterTitle: "Convertisseur de bases numériques",
    baseConverterDesc: "Convertir entre binaire, octal, décimal, hexadécimal",
    baseConverterHint: "Entrez un nombre et sélectionnez la base source",
    inputNumber: "Nombre à convertir:",
    fromBase: "Base source:",
    binary: "Binaire (2)",
    octal: "Octal (8)",
    decimal: "Décimal (10)",
    hexadecimal: "Hexadécimal (16)",
    conversionResults: "Résultats de conversion",
    binaryResult: "Binaire (base 2)",
    octalResult: "Octal (base 8)",
    decimalResult: "Décimal (base 10)",
    hexResult: "Hexadécimal (base 16)",
    invalidBaseNumber: "Nombre invalide pour la base sélectionnée",
    
    // ===================================
    // FRACTION CALCULATOR
    // ===================================
    fractions: "Fractions",
    fractionsTitle: "Calculateur de fractions",
    fractionsDesc: "Additionner, soustraire, multiplier, diviser avec simplification",
    fractionsHint: "Entrez les fractions comme numérateur/dénominateur",
    fraction1: "Fraction 1:",
    fraction2: "Fraction 2:",
    numerator: "Numérateur",
    denominator: "Dénominateur",
    fractionOperation: "Opération:",
    addFractions: "Additionner (+)",
    subtractFractions: "Soustraire (−)",
    multiplyFractions: "Multiplier (×)",
    divideFractions: "Diviser (÷)",
    simplifyFraction: "Simplifier",
    fractionResult: "Résultat",
    simplifiedForm: "Forme simplifiée",
    mixedNumber: "Nombre mixte",
    decimalValue: "Valeur décimale",
    invalidFraction: "Veuillez entrer des fractions valides (le dénominateur ne peut pas être 0)",
    
    // ===================================
    // PERCENTAGE CALCULATOR
    // ===================================
    percentage: "Pourcentage",
    percentageTitle: "Calculateur de pourcentage",
    percentageDesc: "Calculer augmentation, diminution et différence en pourcentage",
    percentageHint: "Sélectionnez une opération et entrez les valeurs",
    percentOf: "Combien fait X% de Y?",
    percentChange: "Variation en % de X à Y",
    percentIncrease: "Augmenter X de Y%",
    percentDecrease: "Diminuer X de Y%",
    valueX: "Valeur X:",
    valueY: "Valeur Y:",
    percentResult: "Résultat",
    percentageValue: "Valeur en pourcentage",
    originalValue: "Valeur initiale",
    newValue: "Nouvelle valeur",
    changePercent: "Variation (%)",
    isIncreaseOf: "est une augmentation de",
    isDecreaseOf: "est une diminution de",
    selectPercentOperation: "Sélectionner l'opération:",
    
    // ===================================
    // RATIO AND PROPORTION
    // ===================================
    ratio: "Ratio",
    ratioTitle: "Résolveur de ratios et proportions",
    ratioDesc: "Résoudre proportions, trouver valeurs manquantes, simplifier ratios",
    ratioHint: "Entrez les valeurs pour les calculs de ratio",
    simplifyRatio: "Simplifier le ratio",
    solveProportion: "Résoudre la proportion (a:b = c:x)",
    ratioA: "a:",
    ratioB: "b:",
    ratioC: "c:",
    ratioX: "x (inconnu):",
    simplifiedRatio: "Ratio simplifié",
    proportionResult: "Solution de la proportion",
    ratioEquals: "égale",
    missingValue: "Valeur manquante x",
    enterRatioValues: "Entrez au moins deux valeurs",
    selectRatioOperation: "Sélectionner l'opération:",
    
    // ===================================
    // UNIT CONVERTER
    // ===================================
    unitConverter: "Convertisseur d'unités",
    unitConverterTitle: "Convertisseur d'unités",
    unitConverterDesc: "Convertir entre unités de longueur, masse, température, temps, surface, volume",
    unitConverterHint: "Sélectionnez la catégorie et les unités",
    selectCategory: "Catégorie:",
    fromUnit: "De:",
    toUnit: "Vers:",
    inputValue: "Valeur:",
    length: "Longueur",
    mass: "Masse",
    temperature: "Température",
    time: "Temps",
    area: "Surface",
    volume: "Volume",
    // Length units
    meter: "Mètre (m)",
    kilometer: "Kilomètre (km)",
    centimeter: "Centimètre (cm)",
    millimeter: "Millimètre (mm)",
    mile: "Mile (mi)",
    yard: "Yard (yd)",
    foot: "Pied (ft)",
    inch: "Pouce (in)",
    // Mass units
    kilogram: "Kilogramme (kg)",
    gram: "Gramme (g)",
    milligram: "Milligramme (mg)",
    pound: "Livre (lb)",
    ounce: "Once (oz)",
    ton: "Tonne métrique (t)",
    // Temperature units
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    kelvin: "Kelvin (K)",
    // Time units
    second: "Seconde (s)",
    minute: "Minute (min)",
    hour: "Heure (h)",
    day: "Jour (j)",
    week: "Semaine (sem)",
    month: "Mois (mois)",
    year: "Année (an)",
    // Area units
    squareMeter: "Mètre carré (m²)",
    squareKilometer: "Kilomètre carré (km²)",
    squareFoot: "Pied carré (ft²)",
    squareMile: "Mile carré (mi²)",
    acre: "Acre",
    hectare: "Hectare (ha)",
    // Volume units
    liter: "Litre (L)",
    milliliter: "Millilitre (mL)",
    cubicMeter: "Mètre cube (m³)",
    gallon: "Gallon (gal)",
    quart: "Quart (qt)",
    pint: "Pinte (pt)",
    cup: "Tasse",
    
    // ===================================
    // STATISTICS CALCULATOR
    // ===================================
    statisticsCalc: "Statistiques",
    statisticsCalcTitle: "Calculateur statistique",
    statisticsCalcDesc: "Moyenne, médiane, mode, variance, écart-type",
    statisticsHint: "Entrez les nombres séparés par des virgules",
    enterDataSet: "Entrez les données:",
    mean: "Moyenne",
    median: "Médiane",
    mode: "Mode",
    variance: "Variance",
    stdDeviation: "Écart-type",
    range: "Étendue",
    sum: "Somme",
    count: "Effectif",
    min: "Minimum",
    max: "Maximum",
    noMode: "Pas de mode (toutes les valeurs apparaissent également)",
    multipleMode: "Modes multiples",
    statisticsResults: "Analyse statistique",
    
    // ===================================
    // SEQUENCE CALCULATOR
    // ===================================
    sequences: "Suites",
    sequencesTitle: "Calculateur de suites",
    sequencesDesc: "Suites arithmétiques, géométriques et de Fibonacci",
    sequencesHint: "Configurez les paramètres de la suite",
    arithmeticSeq: "Suite arithmétique",
    geometricSeq: "Suite géométrique",
    fibonacciSeq: "Suite de Fibonacci",
    firstTerm: "Premier terme (a₁):",
    commonDiff: "Raison (d):",
    commonRatio: "Raison (r):",
    numTerms: "Nombre de termes (n):",
    nthTerm: "Trouver le nième terme:",
    sequenceTerms: "Termes de la suite",
    sumOfTerms: "Somme des termes",
    nthTermResult: "nième terme",
    generalFormula: "Formule générale",
    selectSeqType: "Type de suite:",
    
    // ===================================
    // LIMIT CALCULATOR
    // ===================================
    limits: "Limites",
    limitsTitle: "Calculateur de limites",
    limitsDesc: "Calculer les limites de fonctions simples",
    limitsHint: "Entrez la fonction et le point limite",
    enterFunction: "Fonction f(x):",
    limitPoint: "x tend vers:",
    limitDirection: "Direction:",
    fromLeft: "Par la gauche (x⁻)",
    fromRight: "Par la droite (x⁺)",
    bothSides: "Des deux côtés",
    limitResult: "Résultat de la limite",
    limitExists: "La limite existe",
    limitDNE: "La limite n'existe pas",
    infinity: "Infini (∞)",
    negInfinity: "Moins l'infini (-∞)",
    indeterminate: "Forme indéterminée",
    limitExamples: "Exemples: x^2, sin(x)/x, 1/x, sqrt(x)",
    
    // ===================================
    // TAYLOR SERIES
    // ===================================
    taylor: "Séries de Taylor",
    taylorTitle: "Calculateur de séries de Taylor",
    taylorDesc: "Développements en séries de Taylor et Maclaurin",
    taylorHint: "Sélectionnez la fonction et le nombre de termes",
    selectFunction: "Fonction:",
    expansionPoint: "Point de développement (a):",
    numSeriesTerms: "Nombre de termes:",
    taylorResult: "Développement en série de Taylor",
    maclaurinNote: "Série de Maclaurin (a = 0)",
    polynomialApprox: "Approximation polynomiale",
    remainderTerm: "Terme de reste",
    convergenceRadius: "Rayon de convergence",
    sinFunction: "sin(x)",
    cosFunction: "cos(x)",
    expFunction: "e^x",
    lnFunction: "ln(1+x)",
    atanFunction: "arctan(x)",
    
    // ===================================
    // NUMERICAL INTEGRATION
    // ===================================
    integration: "Intégration",
    integrationTitle: "Intégration numérique",
    integrationDesc: "Intégration par méthode des trapèzes et de Simpson",
    integrationHint: "Entrez la fonction et les bornes d'intégration",
    functionToIntegrate: "Fonction f(x):",
    lowerBound: "Borne inférieure (a):",
    upperBound: "Borne supérieure (b):",
    numIntervals: "Nombre d'intervalles (n):",
    integrationMethod: "Méthode:",
    trapezoidalRule: "Méthode des trapèzes",
    simpsonsRule: "Méthode de Simpson",
    integrationResult: "Résultat de l'intégration",
    approximateValue: "Valeur approchée",
    estimatedError: "Erreur estimée",
    methodUsed: "Méthode utilisée",
    intervalsUsed: "Intervalles utilisés",
    simpsonsNote: "Note: La méthode de Simpson nécessite un nombre pair d'intervalles"
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fr;
}
