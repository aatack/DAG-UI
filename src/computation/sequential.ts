import { Structure } from "../util/structure";
import { Kind } from "../typing/kind";
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
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    applySchema(sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>): void {
        this.sequence.forEach(t => t.applySchema(sourceKinds, targetKinds));
    }

}
