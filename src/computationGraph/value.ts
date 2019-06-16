class Value implements Template {

    inputs;
    outputs;

    value: any;

    /**
     * Create a new Value.
     */
    constructor(value: any) {
        this.value = value;
        this.inputs = [];
        this.outputs = [];
    }

    /**
     * Put the objects in the template into a JSON object.
     */
    toJson(unwrapValues: boolean): object {
        return unwrapValues ? this : this.get();
    }

    /**
     * Overwrite the current sub-template values using those from a
     * JSON object.
     */
    fromJson(json: object): void {
        this.set(json);
    }

    /**
     * Calculate the values of all outputs in-place from the inputs.
     */
    recalculate(): void { }

    /**
     * Set the node to a particular value.
     */
    set(value: any): void {
        this.value = value;
    }

    /**
     * Get the node's value, unwrapped.
     */
    get(): any {
        return this.value;
    }

}
