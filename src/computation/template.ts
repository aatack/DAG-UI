import { Pointer } from "../util/pointer";
import { Structure } from "../util/structure";
import { Kind } from "../typing/kind";

export abstract class Template {

    inputs: Structure<string>;
    outputs: Structure<string>;

    inputPointers: Structure<Pointer>;
    outputPointers: Structure<Pointer>;

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Structure<string>, outputs: Structure<string>) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputPointers = this.inputs.map<Pointer>(s => Pointer.wrap(s));
        this.outputPointers = this.outputs.map<Pointer>(s => Pointer.wrap(s));
    }

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    abstract apply(source: any, target: any): void;

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, return a structure whose layout is the same as this template's
     * output structure but whose values are the kinds that would be produced if
     * this template were applied to an input structure of those types.
     */
    protected abstract determineSchema(
        resolvedInputKinds: Structure<Kind>
    ): Structure<Kind>;

    /**
     * Lift the values of each of the template's inputs from the
     * given source object.  If a value does not exist in the source, it
     * will be resolved to undefined.
     */
    protected resolveInputs(source: any): Structure<any> {
        return this.inputPointers.map<any>(p => p.get(source));
    }

    /**
     * Given a schema object, for each input extract the type of that input.
     */
    protected resolveInputKinds(source: Structure<Kind>): Structure<Kind> {
        var unwrapped = source.unwrap();
        return this.inputPointers.map<Kind>(
            p => p.get(unwrapped)
        );
    }

    /**
     * Given a structure representing the known kinds for a source structure,
     * work out (where possible) which kinds the outputs may be expected to be.
     */
    expectedKinds(_source: Structure<Kind>): Structure<Kind> {
        throw new Error("NYI");
    }

}

export abstract class PureTemplate extends Template {

    /**
     * Given a structure of input values which have been lifted from
     * the relevant source object, compute the output values that would
     * result from computing them.  If an output value cannot be calculated
     * from the given inputs, it should be set to Kinds.unknown.  The returned
     * structure must have the same layout as the template's output structure.
     */
    abstract compute(resolvedInputs: Structure<any>): Structure<any>;

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    apply(source: any, target: any): void {
        var alterations = this.compute(this.resolveInputs(source));
        Structure.zip(this.outputPointers, alterations).forEach(pair => {
            var [pointer, value] = pair;
            if (value !== undefined) {
                pointer.set(target, value);
            }
        });
    }

}
