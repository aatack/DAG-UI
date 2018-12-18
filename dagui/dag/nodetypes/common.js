/**
 * Return either a monadic function node or a constant node,
 * depending on whether the input is a node or a value.
 * @param {function} f 
 * @param {Node or value} input 
 */
function nodeOrValueMonadicFunction(f, input) {
    if (input instanceof Node) {
        return new MonadicFunction(f, input);
    } else {
        return new ConstantNode(f(input));
    }
}

/**
 * Return a node whose value is the square of its input.
 * @param {Node or value} node 
 */
function square(node) {
    return nodeOrValueMonadicFunction(x => x * x, node);
}

/**
 * Return a node whose value is the square root of its input.
 * @param {Node or value} node 
 */
function sqrt(node) {
    return nodeOrValueMonadicFunction(x => Math.sqrt(x), node);
}

/**
 * Return a node whose value is one divided by that of its input.
 * @param {Node or value} node 
 */
function reciprocal(node) {
    return nodeOrValueMonadicFunction(x => 1 / x, node);
}

/**
 * Return a node whose value is the natural logarithm of its input.
 * @param {Node or value} node 
 */
function naturalLogarithm(node) {
    return nodeOrValueMonadicFunction(x => Math.log(x), node);
}

/**
 * Return a node which takes the nth root of an input.
 * @param {value} degree 
 * @param {Node or value} radicand 
 */
function nthRoot(degree, radicand) {
    var exp = 1 / degree;
    return nodeOrValueMonadicFunction(x => x ** exp, radicand);
}

/**
 * Return either a diadic function node, monadic function node,
 * or constant node, depending on whether both, one, or none of
 * the inputs are nodes.
 * @param {function} f 
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function nodeOrValueDiadicFunction(
    f, firstArgumentName, secondArgumentName,
    firstArgument, secondArgument
) {
    if (firstArgument instanceof Node && secondArgument instanceof Node) {
        return new DiadicFunction(f, firstArgumentName, secondArgumentName,
            firstArgument, secondArgument);
    } else if (firstArgument instanceof Node) {
        return new MonadicFunction(x => f(x, secondArgument), firstArgument);
    } else if (secondArgument instanceof Node) {
        return new MonadicFunction(x => f(firstArgument, x), secondArgument);
    } else {
        return new ConstantNode(f(firstArgument, secondArgument));
    }
}

/**
 * Return a node which sums its two inputs.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function sum(addend, augend) {
    return nodeOrValueDiadicFunction((p, q) => p + q,
        "addend", "augend", addend, augend);
}

/**
 * Return a node which finds the product of its inputs.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function product(multiplicand, multiplier) {
    return nodeOrValueDiadicFunction((p, q) => p * q,
        "multiplicand", "multiplier", multiplicand, multiplier);
}

/**
 * Return a node which takes the difference of its inputs.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function difference(minuend, subtrahend) {
    return nodeOrValueDiadicFunction((p, q) => p - q,
        "minuend", "subtrahend", minuend, subtrahend);
}

/**
 * Return a node which finds the ratio of its inputs.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function quotient(dividend, divisor) {
    return nodeOrValueDiadicFunction((p, q) => p / q,
        "dividend", "divisor", dividend, divisor);
}

/**
 * Return a node which finds the remainder when one of its
 * inputs is divided by the other.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function remainder(dividend, divisor) {
    return nodeOrValueDiadicFunction((p, q) => p % q,
        "dividend", "divisor", dividend, divisor);
}

/**
 * Return a node which raises one of its inputs to the power
 * of the other.
 * @param {Node or value} a 
 * @param {Node or value} b 
 */
function power(base, exponent) {
    return nodeOrValueDiadicFunction((p, q) => p ** q,
        "base", "exponent", base, exponent);
}
