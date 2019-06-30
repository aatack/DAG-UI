import { Pointer } from "./pointer";
import { Template } from "./template";
import { SetFunctions } from "../util/set";

export abstract class TemplateFunction extends Template {

    inputList: string[];
    inputPointerList: Pointer[];

    output: string;
    outputPointer: Pointer;

    /**
     * Create a function, in the form of a template, which takes a list
     * of arguments and computes a function of those arguments.
     */
    constructor(inputs: string[], output: string) {
        super(new Set(inputs), new Set([output]));

        this.inputList = inputs;
        this.inputPointerList = inputs.map(this.getInput);

        this.output = output;
        this.outputPointer = this.getOutput(output);
    }

    /**
     * Calculate the output value of the function given its inputs.
     */
    abstract computeOutput(inputValues: any[]): any;

    /**
     * Apply the template to a given target, modifying it in place.
     * Return a set of pointers to those outputs which were changed
     * by applying the operation.
     */
    apply(target: any, changedInputs: Set<string>): Set<string> {
        if (SetFunctions.intersection(this.inputs, changedInputs).size > 0) {
            this.outputPointer.set(
                target, this.computeOutput(this.getInputValues(target))
            );
            return this.outputs;
        }
        return new Set();
    }

    /**
     * Index a JavaScript object, retrieving the values pointed to by each
     * of this function's inputs and returning them as an ordered list.
     */
    getInputValues(source: any): any[] {
        return this.inputPointerList.map(p => p.get(source));
    }

}

export class AnonymousFunction extends TemplateFunction {

    f: (i: any[]) => any;

    constructor(inputs: string[], output: string, f: (i: any[]) => any) {
        super(inputs, output);
        this.f = f;
    }

    /**
     * Calculate the output value of the function given its inputs.
     */
    computeOutput(inputValues: any[]): any {
        return this.f(inputValues);
    }

}

/**
 * Return a partially applied dyadic function, which can be given pointers
 * to its inputs and output to turn it into a complete template.
 */
function partialDyadic(f: (a: any, b: any) => any): (
    (a: string, b: string, c: string) => AnonymousFunction
) {
    return function (firstInput: string, secondInput: string, output: string) {
        var innerFunction = function (inputValues: any[]): any {
            var first = inputValues[0];
            var second = inputValues[1];
            return f(first, second);
        };

        return new AnonymousFunction(
            [firstInput, secondInput], output, innerFunction
        );
    }
}

/**
 * Compute the sum of two numbers.
 */
export var Sum = partialDyadic((x, y) => x + y);

/**
 * Compute the difference of two variables.
 */
export var Difference = partialDyadic((x, y) => x - y);

/**
 * Compute the product of two variables.
 */
export var Product = partialDyadic((x, y) => x * y);

/**
 * Compute the ratio of one variable to another.
 */
export var Ratio = partialDyadic((x, y) => x / y);

