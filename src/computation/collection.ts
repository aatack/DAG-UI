import { Template } from "./template";
import { Structure } from "../util/structure";
import { Pointer } from "../util/pointer";
import { Kind } from "../typing/kind";

export class Map extends Template {

    innerTemplate: Template;

    sourcePointer: Pointer;
    targetPointer: Pointer;

    schemaSourcePointer: Pointer;
    schemaTargetPointer: Pointer;

    /**
     * Create a template which applies an inner template to every element
     * of an ordered structure.
     */
    constructor(innerTemplate: Template, source: string, target: string) {
        super(Structure.wrap<any>(source), Structure.wrap<any>(target));
        this.innerTemplate = innerTemplate;

        this.sourcePointer = this.inputPointers.extractUnit();
        this.schemaSourcePointer = this.sourcePointer.extendDownwards(["0"]);

        this.targetPointer = this.outputPointers.extractUnit();
        this.schemaTargetPointer = this.targetPointer.extendDownwards(["0"]);
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
        var ordered = [];

        for (var i = 0; i < orderedSource.length; i++) {
            var innerTarget = Structure.empty();
            this.innerTemplate.apply(orderedSource[i], innerTarget);
            ordered[i] = innerTarget;
        }
        this.targetPointer.set(target, Structure.wrap(ordered));
    }

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    applySchema(sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>): void {
        var targetKind = Structure.empty<Kind>();
        this.innerTemplate.applySchema(
            this.schemaSourcePointer.get(sourceKinds, false), targetKind
        );
        this.schemaTargetPointer.set(targetKinds, targetKind);
    }

}

export class ScanLeftRight extends Template {

    innerTemplate: Template;

    initialiserPointer: Pointer;
    sourcePointer: Pointer;
    targetPointer: Pointer;

    schemaSourcePointer: Pointer;
    schemaTargetPointer: Pointer;

    /**
     * Create a template which scans from left to right over its source, assumed
     * to be an ordered structure, and accumulates a value over each one, depositing
     * that value in the corresponding cell of its target.  The values are
     * calculated by a template, which is applied to a structure whose keys are
     * `accumulated` for the accumulated value and `current` for the next item
     * in the list.
     */
    constructor(
        innerTemplate: Template,
        initialiser: string,
        source: string,
        target: string
    ) {
        super(Structure.wrap<any>(source), Structure.wrap<any>(target));
        this.innerTemplate = innerTemplate;

        this.initialiserPointer = Pointer.wrap(initialiser);

        this.sourcePointer = this.inputPointers.extractUnit();
        this.schemaSourcePointer = this.sourcePointer.extendDownwards(["0"]);

        this.targetPointer = this.outputPointers.extractUnit();
        this.schemaTargetPointer = this.targetPointer.extendDownwards(["0"]);
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
        var ordered = [this.initialiserPointer.get(source, false)];

        for (var i = 0; i < orderedSource.length; i++) {
            var innerTarget = Structure.empty();
            this.innerTemplate.apply(
                Structure.wrap({
                    "accumulated": ordered[i],
                    "current": orderedSource[i]
                }),
                innerTarget
            );
            ordered[i + 1] = innerTarget;
        }
        this.targetPointer.set(target, Structure.wrap(ordered));
    }

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    applySchema(sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>): void {
        var targetKind = Structure.empty<Kind>();
        this.innerTemplate.applySchema(
            Structure.wrap<Kind>({
                "accumulated": this.initialiserPointer.get(sourceKinds, false),
                "current": this.schemaSourcePointer.get(sourceKinds, false)
            }),
            targetKind
        );
        this.schemaTargetPointer.set(targetKinds, targetKind);
    }

}
