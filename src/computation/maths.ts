import { Template } from "./template";
import { Value } from "./value";

export abstract class DyadicFunction extends Template {

    firstInput: Value;
    secondInput: Value;
    output: Value;

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

        [this.firstInputName, this.secondInputName, this.outputName] = nodeNames;
        this.firstInput = <Value>this.inputs[this.firstInputName];
        this.secondInput = <Value>this.inputs[this.secondInputName];
        this.output = <Value>this.outputs[this.outputName];
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
        var inputObject: { [index: string]: Template } = {};
        inputObject[nodeNames[0]] = firstInput;
        inputObject[nodeNames[1]] = secondInput;
        return inputObject;
    }

    /**
     * Construct an output node dictionary to be passed to
     * the call to the super constructor.
     */
    static buildOutputObject(
        nodeNames: [string, string, string]
    ): { [index: string]: Template } {
        var outputObject: { [index: string]: Template } = {};
        outputObject[nodeNames[2]] = new Value(undefined);
        return outputObject;
    }

    /**
     * Calculate the values of all outputs in-place from the inputs.
     */
    recalculate(): void {
        this.output.set(this.getOutputValue(
            this.firstInput.get(), this.secondInput.get()
        ));
    }

}

export class Sum extends DyadicFunction {

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

/**
 * Return a template summing the two values.
 */
export function sum(a: Value, b: Value) {
    return new Sum(a, b);
}

export class Difference extends DyadicFunction {

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

/**
 * Return a template taking the difference of two values.
 */
export function difference(a: Value, b: Value) {
    return new Difference(a, b);
}

export class Product extends DyadicFunction {

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

/**
 * Return a template finding the product of two values.
 */
export function product(a: Value, b: Value) {
    return new Product(a, b);
}

export class Ratio extends DyadicFunction {

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

/**
 * Return a template calculating the ratio of two values.
 */
export function ratio(a: Value, b: Value) {
    return new Ratio(a, b);
}
