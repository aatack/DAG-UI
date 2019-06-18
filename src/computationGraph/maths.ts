abstract class DyadicFunction extends Template {

    inputs;
    outputs;

    firstInput: Template;
    secondInput: Template;
    output: Template;

    firstInputName: string;
    secondInputName: string;
    outputName: string;

    /**
     * Construct a dyadic function, which takes two arguments and
     * produces a single output.
     */
    constructor(
        nodeNames: [string, string, string], firstInput: Value, secondInput: Value
    ) {
        super(
            DyadicFunction.buildInputObject(nodeNames, firstInput, secondInput),
            DyadicFunction.buildOutputObject(nodeNames)
        );
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    abstract getOutputValue(firstInput: any, secondInput: any): any;

    /**
     * Construct an input node dictionary to be passed to
     * the call to the super constructor.
     */
    static buildInputObject(
        nodeNames: [string, string, string],
        firstInput: Value,
        secondInput: Value
    ): { [index: string]: Template } {
        var [firstInputName, secondInputName, outputName] = nodeNames;
        return { firstInputName: firstInput, secondInputName: secondInput };
    }

    /**
     * Construct an output node dictionary to be passed to
     * the call to the super constructor.
     */
    static buildOutputObject(
        nodeNames: [string, string, string]
    ): { [index: string]: Template } {
        var [firstInputName, secondInputName, outputName] = nodeNames;
        return { outputName: new Value(undefined) };
    }

    /**
     * Calculate the values of all outputs in-place from the inputs.
     */
    recalculate(): void {
        this.outputs[0][1].set(this.getOutputValue(
            this.inputs[0][1].get(), this.inputs[1][1].get()
        ));
    }

}

class Sum extends DyadicFunction {

    /**
     * Create a template representing a summation.
     */
    constructor(addend: Value, augend: Value) {
        super(["addend", "augend", "sum"], addend, augend);
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput + secondInput;
    }

}

class Difference extends DyadicFunction {

    /**
     * Create a template representing a subtraction.
     */
    constructor(subtrahend: Value, minuend: Value) {
        super(["subtrahend", "minuend", "difference"], subtrahend, minuend);
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput - secondInput;
    }

}

class Product extends DyadicFunction {

    /**
     * Create a template representing a multiplication.
     */
    constructor(multiplicand: Value, multiplier: Value) {
        super(["multiplicand", "multiplier", "product"], multiplicand, multiplier);
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput * secondInput;
    }

}

class Ratio extends DyadicFunction {

    /**
     * Create a template representing a summation.
     */
    constructor(dividend: Value, divisor: Value) {
        super(["dividend", "divisor", "ratio"], dividend, divisor);
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput / secondInput;
    }

}

class Square extends Value {

}
