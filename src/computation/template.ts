import { Pointer } from "../util/pointer";
import { Structure } from "../util/structure";
import { Kind } from "../typing/kind";

export abstract class Template {

    inputs: Structure<string>;
    outputs: Structure<string>;

    private inputPointers: Structure<Pointer>;
    private outputPointers: Structure<Pointer>;

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Structure<string>, outputs: Structure<string>) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputPointers = this.inputs.map<string, Pointer>(s => Pointer.wrap(s));
        this.outputPointers = this.outputs.map<string, Pointer>(s => Pointer.wrap(s));
    }

    /**
     * Given a structure of input values which have been lifted from
     * the relevant source object, compute the output values that would
     * result from computing them.  If an output value cannot be calculated
     * from the given inputs, it should be set to undefined.  The returned
     * structure must have the same layout as the template's output structure.
     */
    abstract compute(resolvedInputs: Structure<any>): Structure<any>;

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, return a structure whose layout is the same as this template's
     * output structure but whose values are the kinds that would be produced if
     * this template were applied to an input structure of those types.
     */
    abstract determineSchema(inputKinds: Structure<Kind>): Structure<Kind>;

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

    /**
     * Lift the values of each of the template's inputs from the
     * given source object.  If a value does not exist in the source, it
     * will be resolved to undefined.
     */
    private resolveInputs(source: any): Structure<any> {
        return this.inputPointers.map<Pointer, any>(p => p.get(source));
    }

    /**
     * Given a schema object, for each input extract the type of that input.
     * A value of undefined means the type of that value is not yet known.
     */
    getInputKinds(source: Structure<Kind>): Structure<Kind> {
        return this.inputPointers.map<Pointer, Kind>(p => p.get(source));
    }

}
