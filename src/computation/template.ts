import { Pointer } from "./pointer";

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
        var all = new Set([this.inputs, this.outputs]);
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
     * Get a pointer object from a path, assuming it points to one
     * of the template's inputs.
     */
    protected getInput(path: string): Pointer {
        return this.inputLookup[path];
    }

    /**
     * Get a pointer object from a path, assuming it points to one
     * of the template's outputs.
     */
    protected getOutput(path: string): Pointer {
        return this.outputLookup[path];
    }

}
