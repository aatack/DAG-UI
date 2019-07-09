import { Structure } from "../util/structure";
import { Kind, Kinds } from "../typing/kind";
import { Template } from "./template";

export class Sequential extends Template {

    sequence: Template[];

    constructor(sequence: Template[]) {
        super(
            Structure.wrap(sequence.map(t => t.inputs)),
            Structure.wrap(sequence.map(t => t.outputs))
        );

        this.sequence = sequence;
    }

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    apply(source: any, target: any): void {
        this.sequence.forEach(t => t.apply(source, target));
    }

    /**
     * Given an object whose structure models that of the real input structure,
     * but whose roots contain type variable instead of actual values, return
     * a dictionary mapping the paths of this template's output nodes to the
     * types they would take on if the template were applied to an input object
     * whose values had those types.  A type of undefined means that the type
     * is not specified or otherwise unavailable (eg. the input types would
     * cause an error.)
     */
    determineSchema(inputKinds: Structure<Kind>): Structure<Kind> {
        var resolved = inputKinds.copy();
        this.sequence.forEach(template => {
            var alterations = Structure.zip(
                template.outputPointers,
                template.determineSchema(resolved)
            );
            alterations.forEach(pair => {
                var [pointer, kind] = pair;
                if (kind !== Kinds.unknown) {
                    pointer.set(resolved, kind);
                }
            });
        });
        return resolved;
    }

}
