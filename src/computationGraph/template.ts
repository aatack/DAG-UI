abstract class Template {

    inputs: [string, Template][];
    outputs: [string, Template][];

    /*
    Put the objects in the template into a JSON object.
    */
    unwrap(unwrapLeaves: boolean): object {
        var output = {};
        var allNodes = this.inputs.concat(this.outputs);
        allNodes.forEach(function (pair) {
            var [name, template] = pair;
            output[name] = template.unwrap(unwrapLeaves);
        });
        return output;
    };

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    extract(json: object): void {
        var allNodes = this.inputs.concat(this.outputs);
        allNodes.forEach(function (pair) {
            var [name, template] = pair;
            template.extract(json[name]);
        });
    }

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    abstract recalculate(): void;

}
