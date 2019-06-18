class LinkedTemplate extends Template {

    innerTemplates: { [index: string]: Template };
    wrappedTemplate: Template;
    links: [Pointer, Pointer][];

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
        this.innerTemplates = innerTemplates
        this.wrappedTemplate = new AnonymousTemplate(innerTemplates);
        this.links = links;
        throw new Error("NYI");
    }

    static dereferencePointers(
        pointers: { [index: string]: Pointer },
        templates: { [index: string]: Template }
    ): { [index: string]: Template } {
        var references = {};
        var wrappedTemplate = new AnonymousTemplate(templates);
        for (let key in pointers) {
            references[key] = pointers[key].get(wrappedTemplate);
        }
        return references;
    }

    /**
     * Calculate the values of all outputs in-place from the inputs.
     */
    recalculate(): void {
        throw new Error("NYI");
    }

    /**
     * Apply a link, taking its values from the source destination and
     * copying them to the target destination.
     */
    applyLink(link: [Pointer, Pointer]): void {
        var [sourcePointer, targetPointer] = link;
        targetPointer.get(this.wrappedTemplate).copyFrom(
            sourcePointer.get(this.wrappedTemplate)
        );
    }

    /**
     * Apply the template pointed to by the given pointer, assuming its
     * inputs have already been updated and are valid.
     */
    applyTemplate(pointer: Pointer) {
        pointer.get(this.wrappedTemplate).recalculate();
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
            target[this.references[depth]] = value;
        } else {
            this.set(target.index(this.references[depth]), value, depth = depth + 1);
        }
    }

}
