/**
 * Create an empty box with the given parameters and return an object
 * with each of its properties as well as an HTML element.
 * @param {numeric} top 
 * @param {numeric} left 
 * @param {numeric} height 
 * @param {numeric} width 
 */
dag.box = function (top, left, height, width) {
    var output = {
        top: dag.wrap(top),
        left: dag.wrap(left),
        height: dag.wrap(height),
        width: dag.wrap(width)
    }
    output.element = document.createElement("div");
    output.element.style["position"] = "fixed";
    ["top", "left", "height", "width"].forEach(function (a) {
        output[a].tie(output.element, "/" + a);
        output[a].update();
    });
    dag.frame.appendChild(output.element);
    return output;
}