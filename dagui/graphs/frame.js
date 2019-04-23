/**
 * Create an empty div with the given parameters and return an object
 * with each of its properties as well as an HTML element.
 * @param {numeric} top 
 * @param {numeric} left 
 * @param {numeric} height 
 * @param {numeric} width 
 */
dag.div = function (top, left, height, width, parentElement = { element: dag.window }) {
    var output = {
        top: dag.wrap(top),
        left: dag.wrap(left),
        height: dag.wrap(height),
        width: dag.wrap(width)
    }
    output.element = document.createElement("div");
    output.element.style["position"] = "relative";
    ["top", "left", "height", "width"].forEach(function (a) {
        output[a].tie(output.element, "/" + a);
        output[a].update();
    });
    parentElement.element.appendChild(output.element);
    return output;
}
