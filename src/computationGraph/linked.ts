type Order = Pointer | [Pointer, Pointer];


class LinkedTemplate extends Template {

    innerTemplates: { [index: string]: Template };
    wrappedTemplate: Template;
    links: [Pointer, Pointer][];

    applicationOrder: Order[];

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

        this.applicationOrder = this.determineApplicationOrder();
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
        this.applicationOrder.forEach(this.applyLinkOrTemplate);
    }

    /**
     * Apply the given link or template within this linked template.
     */
    applyLinkOrTemplate(order: Order): void {
        if (order instanceof Pointer) {
            this.applyTemplate(<Pointer>order);
        } else {
            this.applyLink(<[Pointer, Pointer]>order);
        }
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

    /**
     * Return the order in which the links and templates must be applied
     * to calculate the template's values.
     */
    private determineApplicationOrder(): Order[] {
        var [unappliedTemplates, unappliedLinks] = this.getOrderLists();

        var appliedTemplates: Pointer[] = [];
        var appliedLinks: [Pointer, Pointer][] = [];
        var applicationOrder: Order[] = [];

        while (unappliedTemplates.length > 0 || unappliedLinks.length > 0) {
            this.iterateApplicationOrderDetermination(
                unappliedTemplates,
                unappliedLinks,
                appliedTemplates,
                appliedLinks,
                applicationOrder
            );
        }

        return applicationOrder;
    }

    private iterateApplicationOrderDetermination(
        unappliedTemplates: Pointer[],
        unappliedLinks: [Pointer, Pointer][],
        appliedTemplates: Pointer[],
        appliedLinks: [Pointer, Pointer][],
        applicationOrder: Order[]
    ): void {
        var movingTemplates: Pointer[] = [];
        var movingLinks: [Pointer, Pointer][] = [];

        throw new Error("NYI");

        if (movingTemplates.length + movingLinks.length == 0) {
            throw new Error("cyclic dependency in linked template");
        }
    }

    /**
     * Determine whether the given template can be applied.  A template
     * can be applied if no unapplied links point into it.
     */
    private canApplyTemplate(
        template: Pointer, unappliedLinks: [Pointer, Pointer][]
    ): boolean {
        for (var i = 0; i < unappliedLinks.length; i++) {
            if (unappliedLinks[i][1].pointsWithin(template)) {
                return false;
            }
        }
        return true;
    }

    private canApplyLink(
        link: [Pointer, Pointer], unappliedTemplates: Pointer[]
    ): boolean {
        var source, _ = link;
        for (var i = 0; i < unappliedTemplates.length; i++) {
            if (source.pointsWithin(unappliedTemplates[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get lists for all the inner templates and links contained within
     * the linked template.
     */
    private getOrderLists(): [Pointer[], [Pointer, Pointer][]] {
        var unappliedTemplates: Pointer[] = [];
        for (let key in this.innerTemplates) {
            unappliedTemplates.push(new Pointer([key]));
        }

        var unappliedLinks: [Pointer, Pointer][] = [];
        for (var i = 0; i < this.links.length; i++) {
            unappliedLinks.push(this.links[i]);
        }

        return [unappliedTemplates, unappliedLinks];
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

    /**
     * Return true if this pointer points to a location which sits within
     * another pointer.
     */
    pointsWithin(other: Pointer, depth: number = 0): boolean {
        if (depth >= other.references.length) {
            return true;
        } else if (depth >= this.references.length) {
            return false;
        } else if (this.references[depth] != other.references[depth]) {
            return false;
        } else {
            return this.pointsWithin(other, depth = depth + 1);
        }
    }

}
