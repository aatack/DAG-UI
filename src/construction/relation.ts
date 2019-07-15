import { Template } from "../computation/template";
import { Structure } from "../util/structure";
import { Kind } from "../typing/kind";

export abstract class Relation {

    /**
     * Determine whether the relation can be used to resolve the types
     * of any unknown values in the graph.  If it can, modify their
     * type with the missing value and return a template or list of
     * templates which would need to be applied to compute that change
     * on an object of live values.
     */
    abstract resolve(knownTypes: Structure<Kind>): Template[];

}
