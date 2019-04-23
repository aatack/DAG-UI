class Frame {

    constructor(positionParameters, parent = { element: dag.window }) {
        this.positionParameters = positionParameters;
        this.parent = parent;
    }

}

/**
 * Define a graph for a div element such that a div can be created from any
 * combination of its height, width, top, bottom, left, or right coordinates.
 */
dag.graphs.div = new Group(
    ["top", "right", "bottom", "left", "height", "width"]
);
dag.graphs.div.addRelationships([
    {
        graph: dag.graphs.sum,
        mappings: { addend: "top", augend: "height", sum: "bottom" }
    },
    {
        graph: dag.graphs.sum,
        mappings: { addend: "left", augend: "width", sum: "right" }
    },
]);

/**
 * Create an empty div with the given parameters and return an object
 * with each of its properties as well as an HTML element.
 * @param {Object} positionParameters
 * @param {Object} parentElement
 */
dag.div = function (positionParameters, parentElement = { element: dag.window }) {
    var output = {};
    ["top", "left", "height", "width"].forEach(function (key) {
        if (positionParameters[key] === undefined || positionParameters[key] === null) {
            throw "position parameter '" + key + "' not defined";
        }
        output[key] = dag.wrap(positionParameters[key]);
    });
    output.element = document.createElement("div");
    output.element.style["position"] = "relative";
    ["top", "left", "height", "width"].forEach(function (a) {
        output[a].tie(output.element, "/" + a);
        output[a].update();
    });
    parentElement.element.appendChild(output.element);
    return output;
}
