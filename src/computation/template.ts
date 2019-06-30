import { Pointer } from "./pointer";
import { SetFunctions } from "../util/set";

export abstract class Template {

    inputs: Set<string>;
    outputs: Set<string>;

    private inputLookup: { [index: string]: Pointer } = {};
    private outputLookup: { [index: string]: Pointer } = {};

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Set<string>, outputs: Set<string>) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputs.forEach(s => this.inputLookup[s] = Pointer.wrap(s));
        this.outputs.forEach(s => this.outputLookup[s] = Pointer.wrap(s));

        this.checkCyclicDependencies();
    }

    /**
     * Throw an error if there are any cyclic dependencies.
     */
    private checkCyclicDependencies(): void {
        var all = SetFunctions.union(this.inputs, this.outputs);
        if (all.size < this.inputs.size + this.outputs.size) {
            throw new Error(
                "cyclic dependency found: a value is pointed " +
                "to in both the inputs and outputs of a template"
            );
        }
    }

    /**
     * Apply the template to a given target, modifying it in place.
     * Return a set of pointers to those outputs which were changed
     * by applying the operation.
     */
    abstract apply(target: any, changedInputs: Set<string>): Set<string>;

    /**
     * Given an object whose structure models that of the real input structure,
     * but whose roots contain type variable instead of actual values, return
     * a dictionary mapping the paths of this template's output nodes to the
     * types they would take on if the template were applied to an input object
     * whose values had those types.  A type of undefined means that the type
     * is not specified or otherwise unavailable (eg. the input types would
     * cause an error.)
     */
    abstract determineSchema(
        inputTypes: { [index: string]: any }
    ): { [index: string]: any };

    /**
     * Given a schema object, for each input extract the type of that input.
     * A value of undefined means the type of that value is not yet known.
     */
    getInputTypes(source: any): { [index: string]: any } {
        var output: { [index: string]: any } = {};
        this.inputs.forEach(p => {
            output[p] = this.getInput(p).get(source);
        });
        return output;
    }

    /**
     * Get a pointer object from a path, assuming it points to one
     * of the template's inputs.
     */
    getInput(path: string): Pointer {
        return this.inputLookup[path];
    }

    /**
     * Get a pointer object from a path, assuming it points to one
     * of the template's outputs.
     */
    getOutput(path: string): Pointer {
        return this.outputLookup[path];
    }

}
