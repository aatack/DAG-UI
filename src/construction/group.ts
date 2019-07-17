import { Constraint } from "./constraint";
import { Template } from "../computation/template";
import { Kind } from "../typing/kind";
import { Structure } from "../util/structure";

export class ConstraintGroup implements Constraint {

    constraints: Constraint[];

    /**
     * Create a group of constraints that all apply to the same structure.
     */
    constructor(constraints: Constraint[]) {
        this.constraints = constraints;
    }

    /**
     * Determine whether the constraint can be used to resolve the types
     * of any unknown values in the graph.  If it can, modify their
     * type with the missing value and return a template or list of
     * templates which would need to be applied to compute that change
     * on an object of live values.
     */
    resolve(knownKinds: Structure<Kind>): Template[] {
        var updateInPreviousRound = true;
        var templates: Template[] = [];

        while (updateInPreviousRound) {
            updateInPreviousRound = false;
            this.constraints.forEach(constraint => {
                var newTemplates = constraint.resolve(knownKinds);
                newTemplates.forEach(template => {
                    updateInPreviousRound = true;
                    templates.push(template);
                });
            });
        }

        return templates;
    }

}
