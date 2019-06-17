class LinkedTemplate extends Template {

    /**
     * Create a template by linking multiple other templates together.
     */
    constructor(
        innerTemplates: [string, Template][],
        links: [Pointer, Pointer][],
        inputs: [string, Pointer][],
        outputs: [string, Pointer][]
    ) {
        super();
        throw new Error("NYI");
    }

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    recalculate(): void {
        throw new Error("NYI");
    }

}

class Pointer {

    references: string[];
    maximumDepth: number;

    /**
     * Create a pointer to a specific value within an object.
     */
    constructor(references: string[]) {
        this.references = references;
        this.maximumDepth = this.references.length;
    }

    /**
     * Reference the pointer's value from an object.
     */
    get(target: object, depth: number = 0): any {
        if (depth >= this.maximumDepth) {
            return target;
        } else {
            return this.get(target[this.references[depth]], depth = depth + 1);
        }
    }

    /**
     * Reference the pointer's value from an object and set its value.
     */
    set(target: object, value: any, depth: number = 0): any {
        if (depth >= this.maximumDepth - 1) {
            return target[this.references[depth]] = value;
        } else {
            this.set(target[this.references[depth]], value, depth = depth + 1);
        }
    }

}
