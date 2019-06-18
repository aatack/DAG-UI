abstract class Template {

    inputs: { [index: string]: Template };
    outputs: { [index: string]: Template };
    allNodes: { [index: string]: Template };

    /**
     * Set the template's inputs and outputs and check them for values
     * that are not also templates or duplicate keys.
     */
    constructor(
        inputs: { [index: string]: Template },
        outputs: { [index: string]: Template }
    ) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.allNodes = {};
        for (let key in this.inputs) {
            if (this.allNodes[key] !== undefined) {
                throw new Error(key + " is defined twice");
            }
            this.allNodes[key] = this.inputs[key];
        }
        for (let key in this.outputs) {
            if (this.allNodes[key] !== undefined) {
                throw new Error(key + " is defined twice");
            }
            this.allNodes[key] = this.outputs[key];
        }
    }

    /**
     * Put the objects in the template into a JSON object.
     */
    unwrap(unwrapLeaves: boolean): object {
        var output = {};

        for (let key in this.allNodes) {
            output[key] = this.allNodes[key].unwrap(unwrapLeaves);
        }

        return output;
    };

    /**
     * Overwrite the current sub-template values using those from a
     * JSON object.
     */
    extract(json: object): void {
        for (let key in this.allNodes) {
            this.allNodes[key].extract(json[key]);
        };
    }

    /**
     * Calculate the values of all outputs in-place from the inputs.
     */
    abstract recalculate(): void;

    /**
     * Get a sub-template from the template by name.
     */
    index(reference: string): Template {
        return this.allNodes[reference];
    }

    /**
     * Get a sub-template from the template's inputs by name.
     */
    indexInputs(reference: string): Template {
        return this.inputs[reference];
    }

    /**
     * Get a sub-template from the template's outputs by name.
     */
    indexOutputs(reference: string): Template {
        return this.outputs[reference];
    }

}

class AnonymousTemplate extends Template {

    /**
     * Create an anonymous template which has only inputs and no outputs.
     * Its main purpose is for wrapping an object of templates in a
     * template's interface.
     */
    constructor(nodes: { [index: string]: Template }) {
        super(nodes, {});
    }

    /**
     * Recalculating an anonymous template does nothing because it has
     * no outputs.
     */
    recalculate(): void { }

}
