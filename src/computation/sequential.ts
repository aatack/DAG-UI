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
    apply(target: any, changedInputs: Set<string>): Set<string> {
        var alteredInputs = new Set(changedInputs);
        var alteredOutputs = new Set<string>();
        for (var i = 0; i < this.sequence.length; i++) {
            var changed = this.sequence[i].apply(target, alteredInputs);
            changed.forEach(pointer => {
                alteredInputs.add(pointer);
                alteredOutputs.add(pointer);
            });
        }
        return alteredOutputs;
    }

    /**
     * Find the set of pointers which are used as inputs to one or more
     * templates in the sequence, but which are not altered as outputs
     * of another template in the sequence.
     */
    private static findInputs(sequence: Template[]): Set<string> {
        var inputs = new Set<string>();
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
    private static findOutputs(sequence: Template[]): Set<string> {
        var outputs = new Set<string>();
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
        var read = new Set<string>();
        var written = new Set<string>();

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