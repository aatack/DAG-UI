import { PureTemplate } from "./template";
import { Kind, Kinds } from "../typing/kind";
import { Structure } from "../util/structure";

abstract class UnwrappedFunction extends PureTemplate {

    /**
     * Wrap a function and its arguments inside a template such that the
     * inputs and outputs can be accessed in the form of normal objects instead
     * of having to wrap and unwrap them in structures.
     */
    constructor(inputs: any, output: any) {
        super(Structure.wrap(inputs), Structure.wrap(output));
    }

    /**
     * Compute the value of the function's outputs given its unwrapped inputs.
     */
    protected abstract innerCompute(inputs: any): any;

    /**
     * Compute the function's output schema given its unwrapped input schema.
     */
    protected abstract innerComputeSchema(inputs: any): any;

    /**
     * Given a structure of input values which have been lifted from
     * the relevant source object, compute the output values that would
     * result from computing them.  If an output value cannot be calculated
     * from the given inputs, it should be set to Kinds.unknown.  The returned
     * structure must have the same layout as the template's output structure.
     */
    protected compute(inputs: Structure<any>): Structure<any> {
        return Structure.wrap(this.innerCompute(inputs.unwrap()));
    }

    /**
     * Given a structure of input kinds, whose layout matches the layout of
     * this template's inputs, produce a new structure whose layout matches
     * that of this template's outputs and whose values are the types of the
     * template's outputs if it were applied to a structure with the specified
     * input kinds.
     */
    protected computeSchema(inputKinds: Structure<Kind>): Structure<Kind> {
        return Structure.wrap(this.innerComputeSchema(inputKinds.unwrap()));
    }

}

class AnonymousDyadicFunction extends UnwrappedFunction {

    /**
     * Anonymously wrap a dyadic function in a template.
     */
    private valueFunction: (x: any, y: any) => any;
    private schemaFunction: (x: Kind, y: Kind) => Kind;

    constructor(
        value: (x: any, y: any) => any,
        schema: (x: Kind, y: Kind) => Kind,
        x: string,
        y: string,
        z: string
    ) {
        super([x, y], z);
        this.valueFunction = value;
        this.schemaFunction = schema;
    }

    /**
     * Compute the value of the function's outputs given its unwrapped inputs.
     */
    protected innerCompute(inputs: any): any {
        var [x, y] = inputs;
        return this.valueFunction(x, y);
    }

    /**
     * Compute the function's output schema given its unwrapped input schema.
     */
    protected innerComputeSchema(inputs: any): any {
        var [x, y] = inputs;
        return this.schemaFunction(x, y);
    }

    /**
     * Create a constructor for an anonymous dyadic function with its value
     * and schema functions partially applied.
     */
    static wrap(
        value: (x: any, y: any) => any, schema: (x: Kind, y: Kind) => Kind
    ): (x: string, y: string, z: string) => AnonymousDyadicFunction {
        return function (x: string, y: string, z: string) {
            return new AnonymousDyadicFunction(value, schema, x, y, z);
        }
    }

    /**
     * Return a function that checks whether or not both kinds are subsets
     * of a predicate kind.
     */
    static both(t: Kind): (x: Kind, y: Kind) => boolean {
        return (x, y) => t.containsKind(x) && t.containsKind(y);
    }

}

export namespace Maths {

    var bothInt = AnonymousDyadicFunction.both(Kinds.int);
    var bothFloat = AnonymousDyadicFunction.both(Kinds.float);

    var intOrFloat = (x: Kind, y: Kind) => {
        if (bothInt(x, y)) {
            return Kinds.int;
        } else if (bothFloat(x, y)) {
            return Kinds.float;
        } else {
            return Kinds.unknown;
        }
    }

    /**
     * Compute the sum of two numbers.
     */
    export var sum = AnonymousDyadicFunction.wrap(
        (x, y) => x + y, intOrFloat
    );

    /**
     * Compute the difference of two variables.
     */
    export var difference = AnonymousDyadicFunction.wrap(
        (x, y) => x - y, intOrFloat
    );

    /**
     * Compute the product of two variables.
     */
    export var product = AnonymousDyadicFunction.wrap(
        (x, y) => x * y, intOrFloat
    );

    /**
     * Compute the ratio of one variable to another.
     */
    export var ratio = AnonymousDyadicFunction.wrap(
        (x, y) => x / y,
        (x, y) => bothFloat(x, y) ? Kinds.float : Kinds.unknown
    );

}
