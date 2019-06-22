/// <reference path="../references.ts"/>

export module Computation {

    export class Value extends Template {

        inputs;
        outputs;

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
            return unwrapLeaves ? this : this.get();
        }

        /**
         * Overwrite the current sub-template values using those from a
         * JSON object.
         */
        extract(json: object): void {
            this.set(json);
        }

        /**
         * Copy the values of this template from another template.
         */
        copyFrom(source: Template) {
            if (!(source instanceof Value)) {
                throw new Error("cannot copy to a value from a non-value template");
            } else {
                var sourceValue = <Value>source;
                this.value = source.value;
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

}
