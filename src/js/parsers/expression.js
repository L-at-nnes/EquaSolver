// ===================================
// EXPRESSION EVALUATOR
// ===================================
// Safe recursive-descent parser: no eval / Function, so user input can never
// run arbitrary JavaScript. Supports unary minus (-x^2), implicit
// multiplication (2x, 3(x+1), 2sin(x)), constants (pi, e) and common functions.

const EXPRESSION_FUNCTIONS = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    abs: Math.abs,
    exp: Math.exp,
    ln: Math.log,
    log10: Math.log10,
    log2: Math.log2,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    sign: Math.sign,
    pow: Math.pow,
    min: Math.min,
    max: Math.max,
    atan2: Math.atan2
};

const EXPRESSION_CONSTANTS = {
    pi: Math.PI,
    e: Math.E
};

function tokenizeExpression(source) {
    const input = source
        .replace(/−/g, '-')
        .replace(/[×·]/g, '*')
        .replace(/÷/g, '/')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/π/g, 'pi')
        .replace(/\*\*/g, '^');
    const tokens = [];
    let i = 0;

    while (i < input.length) {
        const ch = input[i];
        if (/\s/.test(ch)) {
            i++;
            continue;
        }
        const numberMatch = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(input.slice(i));
        if (numberMatch) {
            tokens.push({ type: 'num', value: parseFloat(numberMatch[0]) });
            i += numberMatch[0].length;
            continue;
        }
        const identMatch = /^[A-Za-z_Ͱ-Ͽ][A-Za-z0-9_Ͱ-Ͽ]*/.exec(input.slice(i));
        if (identMatch) {
            tokens.push({ type: 'id', value: identMatch[0] });
            i += identMatch[0].length;
            continue;
        }
        if ('+-*/%^(),'.includes(ch)) {
            tokens.push({ type: 'op', value: ch });
            i++;
            continue;
        }
        return null;
    }
    return tokens;
}

/**
 * Compile an expression into a function of one variable.
 * Returns null when the expression is not syntactically valid.
 * @param {string} expr
 * @param {string} varName
 * @param {{log?: 'ln'|'log10'}} [options] meaning of log(); defaults to natural log
 */
function compileExpression(expr, varName, options = {}) {
    if (typeof expr !== 'string') return null;
    const tokens = tokenizeExpression(expr);
    if (!tokens || tokens.length === 0) return null;

    const functions = Object.assign({}, EXPRESSION_FUNCTIONS, {
        log: options.log === 'log10' ? Math.log10 : Math.log
    });
    let pos = 0;
    let failed = false;

    const peek = () => tokens[pos];
    const isOp = (token, value) => token && token.type === 'op' && token.value === value;
    const fail = () => {
        failed = true;
        return () => NaN;
    };

    function parseSum() {
        let left = parseProduct();
        while (isOp(peek(), '+') || isOp(peek(), '-')) {
            const op = tokens[pos++].value;
            const right = parseProduct();
            const l = left;
            left = op === '+' ? v => l(v) + right(v) : v => l(v) - right(v);
        }
        return left;
    }

    function startsFactor(token) {
        return token && (token.type === 'num' || token.type === 'id' || isOp(token, '('));
    }

    function parseProduct() {
        let left = parseUnary();
        for (;;) {
            const token = peek();
            let op = null;
            if (isOp(token, '*') || isOp(token, '/') || isOp(token, '%')) {
                op = tokens[pos++].value;
            } else if (startsFactor(token)) {
                op = '*';
            } else {
                break;
            }
            const right = parseUnary();
            const l = left;
            if (op === '*') left = v => l(v) * right(v);
            else if (op === '/') left = v => l(v) / right(v);
            else left = v => l(v) % right(v);
        }
        return left;
    }

    function parseUnary() {
        if (isOp(peek(), '-')) {
            pos++;
            const operand = parseUnary();
            return v => -operand(v);
        }
        if (isOp(peek(), '+')) {
            pos++;
            return parseUnary();
        }
        return parsePower();
    }

    function parsePower() {
        const base = parseAtom();
        if (isOp(peek(), '^')) {
            pos++;
            const exponent = parseUnary();
            return v => Math.pow(base(v), exponent(v));
        }
        return base;
    }

    function parseAtom() {
        const token = tokens[pos++];
        if (!token) return fail();

        if (token.type === 'num') {
            const value = token.value;
            return () => value;
        }

        if (isOp(token, '(')) {
            const inner = parseSum();
            if (!isOp(peek(), ')')) return fail();
            pos++;
            return inner;
        }

        if (token.type === 'id') {
            if (token.value === varName) return v => v;

            if (Object.prototype.hasOwnProperty.call(functions, token.value) && isOp(peek(), '(')) {
                pos++;
                const args = [];
                if (!isOp(peek(), ')')) {
                    args.push(parseSum());
                    while (isOp(peek(), ',')) {
                        pos++;
                        args.push(parseSum());
                    }
                }
                if (!isOp(peek(), ')')) return fail();
                pos++;
                const fn = functions[token.value];
                return v => fn(...args.map(arg => arg(v)));
            }

            if (Object.prototype.hasOwnProperty.call(EXPRESSION_CONSTANTS, token.value)) {
                const value = EXPRESSION_CONSTANTS[token.value];
                return () => value;
            }
        }

        return fail();
    }

    const compiled = parseSum();
    if (failed || pos < tokens.length) return null;
    return compiled;
}

function evaluateExpression(expr, varName, value, options) {
    const compiled = compileExpression(expr, varName, options);
    if (!compiled) return NaN;
    const result = compiled(value);
    return typeof result === 'number' ? result : NaN;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        evaluateExpression,
        compileExpression
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.evaluateExpression = evaluateExpression;
    window.compileExpression = compileExpression;
}
