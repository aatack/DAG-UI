import { Template } from "./template";

export class Value extends Template {

    value: any;

    /**
     * Create a new Value.
     */
    constructor(value: any) {
        super({}, {});
        this.value = value;
    }

    /**
     * Put the objects in the template into a JSON object.
     */
    unwrap(unwrapLeaves: boolean): object {
        return unwrapLeaves ? this.get() : this;
    }

    /**
     * Overwrite the current sub-template values using those from a
     * JSON object.
     */
    extract(json: any): void {
        this.set(json);
    }

    /**
     * Copy the values of this template from another template.
     */
    copyFrom(source: Template) {
        if (!(source instanceof Value)) {
            throw new Error("cannot copy to a value from a non-value template");
        } else {
            var sourceAsValue = <Value>source;
            this.value = sourceAsValue.value;
        }
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
