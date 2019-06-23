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
        this.output = <Value>this.inputs[this.outputName];
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
        var [firstInputName, secondInputName, _] = nodeNames;
        var inputObject: { [index: string]: Template } = {};
        inputObject[firstInputName] = firstInput;
        inputObject[secondInputName] = secondInput;
        return inputObject;
    }

    /**
     * Construct an output node dictionary to be passed to
     * the call to the super constructor.
     */
    static buildOutputObject(
        nodeNames: [string, string, string]
    ): { [index: string]: Template } {
        var [_, _, outputName] = nodeNames;
        var outputObject: { [index: string]: Template } = {};
        outputObject[outputName] = new Value(undefined);
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

export class Square extends Value {

}
