import { Constraint } from "./constraint";
import { Template } from "../computation/template";
import { Structure } from "../util/structure";
import { Kind, Kinds } from "../typing/kind";

export class BasicConstraint implements Constraint {

    possibleTemplates: Template[];

    /**
     * Defines a constraint which determines an application order by brute
     * force, cycling through a list of possible templates until one is
     * found which can be applied to a set of known types.
     */
    constructor(possibleTemplates: Template[]) {
        this.possibleTemplates = possibleTemplates;
    }

    /**
     * Determine whether the constraint can be used to resolve the types
     * of any unknown values in the graph.  If it can, modify their
     * type with the missing value and return a template or list of
     * templates which would need to be applied to compute that change
     * on an object of live values.
     */
    resolve(knownKinds: Structure<Kind>): Template[] {
        var applicableTemplates: Template[] = [];
        var kinds = knownKinds.copy();
        var unknownCount = this.countUnknown(kinds);
        var totalCount = kinds.count();

        this.possibleTemplates.forEach(template => {
            template.applySchema(kinds, kinds);

            var newUnknownCount = this.countUnknown(kinds);
            var newTotalCount = kinds.count();

            // TODO: replace this with a more robust
            //       check for provision of additional information
            if (
                newUnknownCount < unknownCount || (
                    newUnknownCount == unknownCount &&
                    newTotalCount > totalCount
                )
            ) {
                applicableTemplates.push(template);
            }
            unknownCount = newUnknownCount;
            totalCount = newTotalCount;
        });

        if (applicableTemplates.length > 0) {
            knownKinds.copyFrom(kinds);
        }

        return applicableTemplates;
    }

    /**
     * Count the number of units whose kind is unknown.
     */
    countUnknown(kinds: Structure<Kind>): number {
        return kinds.filter(k => k == Kinds.unknown).count();
    }

}
