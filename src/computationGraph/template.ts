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

    /*
    Put the objects in the template into a JSON object.
    */
    unwrap(unwrapLeaves: boolean): object {
        var output = {};

        for (let key in this.allNodes) {
            output[key] = this.allNodes[key].unwrap(unwrapLeaves);
        }

        return output;
    };

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    extract(json: object): void {
        for (let key in this.allNodes) {
            this.allNodes[key].extract(json[key]);
        };
    }

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    abstract recalculate(): void;

}
