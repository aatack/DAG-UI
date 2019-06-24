import { Pointer } from "./pointer";

export abstract class Template {

    inputs: Set<Pointer>;
    outputs: Set<Pointer>;

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Set<Pointer>, outputs: Set<Pointer>) {
        this.inputs = inputs;
        this.outputs = outputs;
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
    abstract apply(target: any, changedInputs: Pointer[]): Pointer[];

}
