abstract class Template {

    inputs: [string, Template][];
    outputs: [string, Template][];

    /*
    Put the objects in the template into a JSON object.
    */
    abstract toJson(unwrapValues: boolean): object;

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    abstract fromJson(json: object): void;

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    abstract recalculate(): void;

}
