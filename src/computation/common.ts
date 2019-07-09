import { PureTemplate } from "./template";
import { Kind, Kinds } from "../typing/kind";
import { Structure } from "../util/structure";

abstract class StandardFunction extends PureTemplate {

    /**
     * Create a function, in the form of a template, which takes a list
     * of arguments and computes a function of those arguments.
     */
    constructor(inputs: string[], output: string) {
        super(Structure.wrap(inputs), Structure.wrap(output));
    }

    /**
     * Calculate the return value of the function from its inputs.
     */
    protected abstract innerCompute(inputs: any[]): any;

    /**
     * Determine the return kind of the function from those of its inputs.
     */
    protected abstract innerDetermineSchema(kinds: Kind[]): Kind;

    /**
     * Given a structure of input values which have been lifted from
     * the relevant source object, compute the output values that would
     * result from computing them.  If an output value cannot be calculated
     * from the given inputs, it should be set to Kinds.unknown.  The returned
     * structure must have the same layout as the template's output structure.
     */
    compute(resolvedInputs: Structure<any>): Structure<any> {
        return Structure.wrap(this.innerCompute(resolvedInputs.unwrap()));
    }

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, return a structure whose layout is the same as this template's
     * output structure but whose values are the kinds that would be produced if
     * this template were applied to an input structure of those types.
     */
    protected determineSchema(resolvedInputKinds: Structure<Kind>): Structure<Kind> {
        return Structure.wrap(
            this.innerDetermineSchema(resolvedInputKinds.unwrap())
        );
    }

}

class AnonymousFunction extends StandardFunction {

    valueFunction: (i: any[]) => any;
    kindFunction: (i: Kind[]) => Kind;

    constructor(
        inputs: string[],
        output: string,
        valueFunction: (i: any[]) => any,
        kindFunction: (i: Kind[]) => Kind
    ) {
        super(inputs, output);
        this.valueFunction = valueFunction;
        this.kindFunction = kindFunction;
    }

    /**
     * Calculate the return value of the function from its inputs.
     */
    protected innerCompute(inputs: any[]): any {
        return this.valueFunction(inputs);
    }

    /**
     * Determine the return kind of the function from those of its inputs.
     */
    protected innerDetermineSchema(kinds: Kind[]): Kind {
        return this.kindFunction(kinds);
    }

}

/**
 * Return a partially applied dyadic function, which can be given pointers
 * to its inputs and output to turn it into a complete template.
 */
function partialDyadic(
    valueFunction: (a: any, b: any) => any,
    kindFunction: (a: Kind, b: Kind) => Kind
): ((a: string, b: string, c: string) => AnonymousFunction) {
    return function (firstInput: string, secondInput: string, output: string) {
        var innerValueFunction = function (inputValues: any[]): any {
            var first = inputValues[0];
            var second = inputValues[1];
            return valueFunction(first, second);
        };
        var innerTypeFunction = function (inputKinds: Kind[]): Kind {
            var first = inputKinds[0];
            var second = inputKinds[1];
            return kindFunction(first, second);
        };

        return new AnonymousFunction(
            [firstInput, secondInput], output, innerValueFunction, innerTypeFunction
        );
    }
}

function both(t: Kind): (a: Kind, b: Kind) => boolean {
    return (a, b) => t.containsKind(a) && t.containsKind(b);
}

export namespace Maths {

    /**
     * Compute the sum of two numbers.
     */
    export var sum = partialDyadic(
        (x, y) => x + y,
        (x, y) => {
            if (both(Kinds.int)(x, y)) {
                return Kinds.int;
            } else if (both(Kinds.float)(x, y)) {
                return Kinds.float;
            } else {
                return Kinds.unknown;
            }
        }
    );

    /**
     * Compute the difference of two variables.
     */
    export var difference = partialDyadic(
        (x, y) => x - y,
        (x, y) => {
            if (both(Kinds.int)(x, y)) {
                return Kinds.int;
            } else if (both(Kinds.float)(x, y)) {
                return Kinds.float;
            } else {
                return Kinds.unknown;
            }
        }
    );

    /**
     * Compute the product of two variables.
     */
    export var product = partialDyadic(
        (x, y) => x * y,
        (x, y) => {
            if (both(Kinds.int)(x, y)) {
                return Kinds.int;
            } else if (both(Kinds.float)(x, y)) {
                return Kinds.float;
            } else {
                return Kinds.unknown;
            }
        }
    );

    /**
     * Compute the ratio of one variable to another.
     */
    export var ratio = partialDyadic(
        (x, y) => x / y,
        (x, y) => {
            if (both(Kinds.float)(x, y)) {
                return Kinds.float;
            } else {
                return Kinds.unknown;
            }
        }
    );

}
