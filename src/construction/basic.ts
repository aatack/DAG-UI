import { Relation } from "./relation";
import { Template } from "../computation/template";

export abstract class BasicRelation extends Relation {

    possibleTemplates: Template[];

    /**
     * Defines a relation which determines an application order by brute
     * force, cycling through a list of possible templates until one is
     * found which can be applied to a set of known types.
     */
    constructor(possibleTemplates: Template[]) {
        super();
        this.possibleTemplates = possibleTemplates;
    }

    /**
     * Determine whether the relation can be used to resolve the types
     * of any unknown values in the graph.  If it can, modify their
     * type with the missing value and return a template or list of
     * templates which would need to be applied to compute that change
     * on an object of live values.
     */
    resolve(knownTypes: any): Template[] {
        var applicableTemplates: Template[] = [];

        this.possibleTemplates.forEach(
            template => this.checkTemplate(
                template, knownTypes, applicableTemplates
            )
        );

        return applicableTemplates;
    }

    checkTemplate(
        _template: Template, _knownTypes: any, _applicableTemplates: Template[]
    ): void {
        throw new Error("NYI");
    }

}
