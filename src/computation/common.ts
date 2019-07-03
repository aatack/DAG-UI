import { Pointer } from "./pointer";
import { Template } from "./template";
import { SetFunctions } from "../util/set";
import { Type } from "../typing/type";

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
        this.inputPointerList = inputs.map(i => this.getInput(i));

        this.output = output;
        this.outputPointer = this.getOutput(output);
    }

    /**
     * Calculate the output value of the template given its inputs.
     */
    protected abstract computeOutputValue(inputValues: any[]): any;

    /**
     * Calculate the output type of the template given its inputs.
     */
    protected abstract computeOutputType(inputTypes: any[]): any;

    /**
     * Apply the template to a given target, modifying it in place.
     * Return a set of pointers to those outputs which were changed
     * by applying the operation.
     */
    apply(target: any, changedInputs: Set<string>): Set<string> {
        if (SetFunctions.intersection(this.inputs, changedInputs).size > 0) {
            this.outputPointer.set(
                target, this.computeOutputValue(this.getInputValues(target))
            );
            return this.outputs;
        }
        return new Set();
    }

    /**
     * Given an object whose structure models that of the real input structure,
     * but whose roots contain type variable instead of actual values, return
     * a dictionary mapping the paths of this template's output nodes to the
     * types they would take on if the template were applied to an input object
     * whose values had those types.  A type of undefined means that the type
     * is not specified or otherwise unavailable (eg. the input types would
     * cause an error.)
     */
    determineSchema(inputTypes: { [index: string]: any }): { [index: string]: any } {
        var schema: { [index: string]: any } = {};
        var outputName = this.output;
        var inputTypeList = this.inputList.map(i => inputTypes[i]);
        var outputType = this.computeOutputType(inputTypeList);
        schema[outputName] = outputType;
        return schema;
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

    valueFunction: (i: any[]) => any;
    typeFunction: (i: any[]) => any;

    constructor(
        inputs: string[],
        output: string,
        valueFunction: (i: any[]) => any,
        typeFunction: (i: any[]) => any
    ) {
        super(inputs, output);
        this.valueFunction = valueFunction;
        this.typeFunction = typeFunction;
    }

    /**
     * Calculate the output value of the function given its inputs.
     */
    protected computeOutputValue(inputValues: any[]): any {
        return this.valueFunction(inputValues);
    }

    /**
     * Calculate the output type of the template given its inputs.
     */
    protected computeOutputType(inputTypes: any[]): any {
        return this.typeFunction(inputTypes);
    }

}

/**
 * Return a partially applied dyadic function, which can be given pointers
 * to its inputs and output to turn it into a complete template.
 */
function partialDyadic(
    valueFunction: (a: any, b: any) => any, typeFunction: (a: any, b: any) => any
): ((a: string, b: string, c: string) => AnonymousFunction) {
    return function (
        firstInput: string,
        secondInput: string,
        output: string
    ) {
        var innerValueFunction = function (inputValues: any[]): any {
            var first = inputValues[0];
            var second = inputValues[1];
            return valueFunction(first, second);
        };
        var innerTypeFunction = function (inputTypes: any[]): any {
            var first = inputTypes[0];
            var second = inputTypes[1];
            return typeFunction(first, second);
        };

        return new AnonymousFunction(
            [firstInput, secondInput], output, innerValueFunction, innerTypeFunction
        );
    }
}

function both(t: any): (a: any, b: any) => boolean {
    return (a, b) => Type.checkType(a, t) && Type.checkType(b, t);
}

/**
 * Compute the sum of two numbers.
 */
export var Sum = partialDyadic(
    (x, y) => x + y,
    (x, y) => {
        if (both(Type.int)(x, y)) {
            return Type.int;
        } else if (both(Type.float)(x, y)) {
            return Type.float;
        } else {
            return undefined;
        }
    }
);

/**
 * Compute the difference of two variables.
 */
export var Difference = partialDyadic(
    (x, y) => x - y,
    (x, y) => {
        if (both(Type.int)(x, y)) {
            return Type.int;
        } else if (both(Type.float)(x, y)) {
            return Type.float;
        } else {
            return undefined;
        }
    }
);

/**
 * Compute the product of two variables.
 */
export var Product = partialDyadic(
    (x, y) => x * y,
    (x, y) => {
        if (both(Type.int)(x, y)) {
            return Type.int;
        } else if (both(Type.float)(x, y)) {
            return Type.float;
        } else {
            return undefined;
        }
    }
);

/**
 * Compute the ratio of one variable to another.
 */
export var Ratio = partialDyadic(
    (x, y) => x / y,
    (x, y) => {
        if (both(Type.float)(x, y)) {
            return Type.float;
        } else {
            return undefined;
        }
    }
);
