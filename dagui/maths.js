class WrappedFunction extends Unit {

    constructor(inputs, valueFunction) {
        super(inputs, false);
        this.valueFunction = valueFunction;
        this.update();
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        var inputValues = {};
        for (var key in this.inputs) {
            inputValues[key] = this.inputs[key].value;
        }
        this.value = this.valueFunction(inputValues);
    }

}

dag.wrapFunction = f => function (inputs) {
    return new WrappedFunction(inputs, f);
};

dag.wrapMonadicFunction = function (f) {
    return function (a) {
        return new WrappedFunction({ a: a }, i => f(i.a))
    }
}

dag.wrapDyadicFunction = function (f) {
    return function (a, b) {
        return new WrappedFunction({ a: a, b: b }, i => f(i.a, i.b))
    }
}

dag.wrapTriadicFunction = function (f) {
    return function (a, b, c) {
        return new WrappedFunction({ a: a, b: b, c: c }, i => f(i.a, i.b, i.c))
    }
}

dag.add = dag.wrapDyadicFunction(function (a, b) {
    return a + b;
});

dag.subtract = dag.wrapDyadicFunction(function (a, b) {
    return a - b;
});

dag.multiply = dag.wrapDyadicFunction(function (a, b) {
    return a * b;
});

dag.divide = dag.wrapDyadicFunction(function (a, b) {
    return a / b;
});

dag.square = dag.wrapMonadicFunction(function (x) { return x * x; })

dag.pair = {
    max: dag.wrapDyadicFunction(function (a, b) {
        return a > b ? a : b;
    }),
    min: dag.wrapDyadicFunction(function (a, b) {
        return a < b ? a : b;
    }),
}
