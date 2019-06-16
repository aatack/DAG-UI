interface Template {

    inputs: [string, Template][];
    outputs: [string, Template][];

    /*
    Put the objects in the template into a JSON object.
    */
    toJson(unwrapValues: boolean): object;

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    fromJson(json: object): void;

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    recalculate(): void;

}
