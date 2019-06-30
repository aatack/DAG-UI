import { Pointer } from "./pointer";

export abstract class Template {

    inputs: Set<string>;
    outputs: Set<string>;

    inputPointers: { [index: string]: Pointer } = {};
    outputPointers: { [index: string]: Pointer } = {};

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Set<string>, outputs: Set<string>) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputs.forEach(s => this.inputPointers[s] = Pointer.wrap(s));
        this.outputs.forEach(s => this.outputPointers[s] = Pointer.wrap(s));

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

}
