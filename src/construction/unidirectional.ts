import { Template } from "../computation/template";
import { Constraint } from "./constraint";
import { Structure } from "../util/structure";
import { Kind, Kinds } from "../typing/kind";

export abstract class UnidirectionalConstraint
    extends Template implements Constraint {

    /**
     * Determine whether the constraint can be used to resolve the types
     * of any unknown values in the graph.  If it can, modify their
     * type with the missing value and return a template or list of
     * templates which would need to be applied to compute that change
     * on an object of live values.
     */
    resolve(knownKinds: Structure<Kind>): Template[] {
        return this.providesAdditionalInformation(knownKinds) ?
            [this] : [];
    }

    /**
     * Determine whether or not the constraint would provide any additional
     * information if applied to the given schema.
     */
    providesAdditionalInformation(knownKinds: Structure<Kind>): boolean {
        var unknownBefore = knownKinds.filter(k => k == Kinds.unknown).count();
        var totalBefore = knownKinds.count();

        this.applySchema(knownKinds, knownKinds);

        var unknownAfter = knownKinds.filter(k => k == Kinds.unknown).count();
        var totalAfter = knownKinds.count();

        // TODO: replace this with a more robust check
        //       for provision of additional information
        return unknownAfter < unknownBefore || (
            unknownBefore == unknownAfter && totalAfter > totalBefore
        );
    }

}
