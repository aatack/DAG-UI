import { Pointer } from "../util/pointer";
import { Structure } from "../util/structure";
import { Kind } from "../typing/kind";
import { KindUtils } from "../typing/utils";

export abstract class Template {

    inputs: Structure<string>;
    outputs: Structure<string>;

    inputPointers: Structure<Pointer>;
    outputPointers: Structure<Pointer>;

    /**
     * Create a new template, which codifies a computation which can be
     * performed on a JavaScript object.
     */
    constructor(inputs: Structure<string>, outputs: Structure<string>) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputPointers = this.inputs.map<Pointer>(s => Pointer.wrap(s));
        this.outputPointers = this.outputs.map<Pointer>(s => Pointer.wrap(s));
    }

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    abstract apply(source: Structure<any>, target: Structure<any>): void;

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    abstract applySchema(
        sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>
    ): void;

    /**
     * Given a structure of values, find those values which are referenced
     * by this template's inputs and lift them out of the source structure,
     * putting them into a new structure whose layout is the same as this
     * template's input structure.
     */
    protected liftInputsFromSource(source: Structure<any>): Structure<any> {
        return this.inputPointers.map<any>(p => p.get(source));
    }

    /**
     * Given a structure of values representing the outputs of this template,
     * place those values into another structure in the locations defined by
     * this template's corresponding output pointers.
     */
    protected placeOutputsInTarget(
        outputs: Structure<any>, target: Structure<any>
    ): void {
        Structure.zip(this.outputPointers, outputs).forEach(pair => {
            var [pointer, value] = pair;
            pointer.set(target, value);
        });
    }

    /**
     * Given a structure of kinds, lift the kinds relevant to this template
     * and reformat them to be in the same structure as this template's inputs.
     * If the pointer's path does not exist, the unknown type is returned.
     */
    protected liftKindsFromSource(source: Structure<Kind>): Structure<Kind> {
        return this.inputPointers.map<Kind>(
            p => KindUtils.getKindOrUnknown(source, p)
        );
    }

    /**
     * Place the given output kinds in a structure of kinds, being careful not
     * to override any kinds that are not currently unknown with unknown kinds.
     */
    protected placeKindsInTarget(
        outputs: Structure<Kind>, target: Structure<Kind>
    ): void {
        Structure.zip(this.outputPointers, outputs).forEach(pair => {
            var [pointer, value] = pair;
            KindUtils.setKindIfNotUnknown(target, pointer, value);
        });
    }

}

export abstract class PureTemplate extends Template {

    /**
     * Given a structure of input values which have been lifted from
     * the relevant source object, compute the output values that would
     * result from computing them.  If an output value cannot be calculated
     * from the given inputs, it should be set to Kinds.unknown.  The returned
     * structure must have the same layout as the template's output structure.
     */
    protected abstract compute(inputs: Structure<any>): Structure<any>;

    /**
     * Given a structure of input kinds, whose layout matches the layout of
     * this template's inputs, produce a new structure whose layout matches
     * that of this template's outputs and whose values are the types of the
     * template's outputs if it were applied to a structure with the specified
     * input kinds.
     */
    protected abstract computeSchema(inputKinds: Structure<Kind>): Structure<Kind>;

    /**
     * Taking input values from a given source object, compute the values of
     * any outputs where possible, and then apply those outputs to a target
     * object.
     */
    apply(source: any, target: any): void {
        this.placeOutputsInTarget(
            this.compute(this.liftInputsFromSource(source)), target
        );
    }

    /**
     * Given a structure of kinds representing each input, some of which may be
     * unknown, calculate any known kinds and place them in the target structure.
     */
    applySchema(
        sourceKinds: Structure<Kind>, targetKinds: Structure<Kind>
    ): void {
        this.placeKindsInTarget(
            this.computeSchema(this.liftKindsFromSource(sourceKinds)),
            targetKinds
        );
    }

}
