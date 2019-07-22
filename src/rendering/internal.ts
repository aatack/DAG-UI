import { Structure } from "../util/structure";

export namespace Internal {

    /**
     * Get an object representing the attributes of an element.
     */
    export function attributes(
        structure: Structure<any>
    ): { [index: string]: Structure<any> } {
        return structure.getIndex(["attributes"]).extractKeyed();
    }

    /**
     * Get an object representing the style of an element.
     */
    export function style(
        structure: Structure<any>
    ): { [index: string]: Structure<any> } {
        return structure.getIndex(["style"]).extractKeyed();
    }

    /**
     * Get an object representing the children of an element.
     */
    export function children(structure: Structure<any>): Structure<any>[] {
        return structure.getIndex(["children"]).extractOrdered();
    }

}
