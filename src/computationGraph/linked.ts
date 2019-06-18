class LinkedTemplate extends Template {

    /**
     * Create a template by linking multiple other templates together.
     */
    constructor(
        innerTemplates: { [index: string]: Template },
        links: [Pointer, Pointer][],
        inputPointers: { [index: string]: Pointer },
        outputPointers: { [index: string]: Pointer }
    ) {
        super(
            LinkedTemplate.dereferencePointers(inputPointers, innerTemplates),
            LinkedTemplate.dereferencePointers(outputPointers, innerTemplates)
        );
        throw new Error("NYI");
    }

    static dereferencePointers(
        pointers: { [index: string]: Pointer },
        templates: { [index: string]: Template }
    ): { [index: string]: Template } {
        var references = {};
        var wrappedTemplates = new AnonymousTemplate(templates);
        for (let key in pointers) {
            references[key] = pointers[key].get(wrappedTemplates);
        }
        return references;
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
    get(target: Template, depth: number = 0): any {
        if (depth >= this.maximumDepth) {
            return target;
        } else {
            return this.get(target.index(this.references[depth]), depth = depth + 1);
        }
    }

    /**
     * Reference the pointer's value from an object and set its value.
     */
    set(target: Template, value: any, depth: number = 0): any {
        if (depth >= this.maximumDepth - 1) {
            return target[this.references[depth]] = value;
        } else {
            this.set(target.index(this.references[depth]), value, depth = depth + 1);
        }
    }

}
