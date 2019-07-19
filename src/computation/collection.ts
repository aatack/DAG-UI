import { Template } from "./template";
import { Structure } from "../util/structure";
import { Pointer } from "../util/pointer";
import { Kind } from "../typing/kind";

export class Map extends Template {

    innerTemplate: Template;

    sourcePointer: Pointer;
    targetPointer: Pointer;

    /**
     * Create a template which applies an inner template to every element
     * of an ordered structure.
     */
    constructor(innerTemplate: Template, source: string, target: string) {
        super(Structure.wrap<any>(source), Structure.wrap<any>(target));
        this.innerTemplate = innerTemplate;

        this.sourcePointer = this.inputPointers.extractUnit().extendDownwards(["0"]);
        this.targetPointer = this.outputPointers.extractUnit().extendDownwards(["0"]);
    }

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    apply(source: Structure<any>, target: Structure<any>): void {
        var orderedSource = (
            this.sourcePointer.get(source, false).extractOrdered()
        );

        for (var i = 0; i < orderedSource.length; i++) {
            var innerTarget = Structure.empty();
            this.innerTemplate.apply(orderedSource[i], innerTarget);
            target.setIndex([String(i)], innerTarget);
        }
    }

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    applySchema(sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>): void {
        var targetKind = Structure.empty<Kind>();
        this.innerTemplate.applySchema(
            this.sourcePointer.get(sourceKinds, false), targetKind
        );
        this.targetPointer.set(targetKinds, targetKind);
    }

}
