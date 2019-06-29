import { Pointer } from "./pointer";
import { Template } from "./template";

export class Sequential extends Template {

    sequence: Template[];

    constructor(sequence: Template[]) {
        super(
            Sequential.findInputs(sequence),
            Sequential.findOutputs(sequence)
        );
        this.sequence = sequence;
        this.checkSequence();
    }

    /**
     * Apply the template to a given target, modifying it in place.
     * Return a set of pointers to those outputs which were changed
     * by applying the operation.
     */
    apply(target: any, changedInputs: Set<Pointer>): Set<Pointer> {
        throw new Error("NYI");
    }

    /**
     * Find the set of pointers which are used as inputs to one or more
     * templates in the sequence, but which are not altered as outputs
     * of another template in the sequence.
     */
    private static findInputs(sequence: Template[]): Set<Pointer> {
        var inputs = new Set<Pointer>();
        sequence.forEach(template => {
            template.inputs.forEach(pointer => inputs.add(pointer));
        });
        sequence.forEach(template => {
            template.outputs.forEach(pointer => {
                if (inputs.has(pointer)) {
                    inputs.delete(pointer);
                }
            });
        });
        return inputs;
    }

    /**
     * Find the set of pointers which are altered as outputs by a
     * template in the sequence.  An error will be thrown if a pointer
     * is altered by multiple templates.
     */
    private static findOutputs(sequence: Template[]): Set<Pointer> {
        var outputs = new Set<Pointer>();
        sequence.forEach(template => {
            template.outputs.forEach(pointer => {
                if (outputs.has(pointer)) {
                    throw new Error(
                        "multiple templates alter the same pointer"
                    );
                } else {
                    outputs.add(pointer);
                }
            });
        });
        return outputs;
    }

    /**
     * Check the sequence of template applications and throw an error if it
     * contains any cyclic dependencies.
     */
    private checkSequence(): void {
        var read = new Set<Pointer>();
        var written = new Set<Pointer>();

        // A cyclic dependency exists if, during the sequence of applications,
        // a template tries to write to a pointer that has already been read
        this.sequence.forEach(template => {
            template.inputs.forEach(pointer => read.add(pointer));
            template.outputs.forEach(pointer => {
                written.add(pointer);
                if (read.has(pointer)) {
                    throw new Error(
                        "cyclic dependency found in sequential template"
                    );
                }
            });
        });
    }

}