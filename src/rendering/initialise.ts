import { Structure } from "../util/structure";

/**
 * Initialise the element represented by the given structure by adding it to
 * the top level of the DOM.
 */
export function initialise(
    structure: Structure<any>, parent: HTMLElement = document.body
): HTMLElement {
    var type: string = structure.hasIndex(["metadata", "type"]) ?
        structure.getIndex(["metadata", "type"]).extractUnit() : "div";

    var element = createElement(type, parent);
    setAttributes(element, structure.getIndex(["attributes"]).unwrap());
    setStyle(element, structure.getIndex(["style"]).unwrap());
    setChildren(element, structure.getIndex(["children"]).extractOrdered());

    return element;
}

/**
 * Create an empty element with the given tag name and append
 * it to the DOM body.
 */
function createElement(type: string, parent: HTMLElement): HTMLElement {
    var element = document.createElement(type);
    parent.appendChild(element);
    return element;
}

/**
 * Set the attributes of the given element.
 */
function setAttributes(
    element: HTMLElement, attributes: { [index: string]: any }
): void {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

/**
 * Set the style of the given element.
 */
function setStyle(
    element: HTMLElement, style: { [index: string]: any }
): void {
    for (let key in style) {
        (<any>element.style)[key] = style[key];
    }
}

/**
 * Add children to the specified HTML element.
 */
function setChildren(element: HTMLElement, children: Structure<any>[]): void {
    children.forEach(child => element.appendChild(initialise(child)));
}
