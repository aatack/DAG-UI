import { Structure } from "../util/structure";
import { Internal } from "./internal";

/**
 * Tie the values of a structure to the attributes, style, and children of
 * an HTML element.
 */
export function tether(structure: Structure<any>, element: HTMLElement): void {
    tetherAttributes(element, Internal.attributes(structure));
    tetherStyle(element, Internal.style(structure));
    tetherChildren(element, Internal.children(structure));
}

/**
 * Tether an element to its attributes, as expressed by a structure of values.
 */
function tetherAttributes(
    element: HTMLElement, attributes: { [index: string]: Structure<any> }
) {
    for (let key in attributes) {
        attributes[key].addUnitCallback(a => element.setAttribute(key, a));
    }
}

/**
 * Tether an element to its style, as expressed by a structure of values.
 */
function tetherStyle(
    element: HTMLElement, style: { [index: string]: Structure<any> }
) {
    for (let key in style) {
        style[key].addUnitCallback(s => (<any>element.style)[key] = s);
    }
}

/**
 * Tether an element to its children, as expressed by a structure of values.
 */
function tetherChildren(
    element: HTMLElement, children: Structure<any>[]
) {
    for (var i = 0; i < children.length; i++) {
        tether(children[i], <HTMLElement>element.children[i]);
    }
}
