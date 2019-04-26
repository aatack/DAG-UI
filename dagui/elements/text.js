/**
 * A function for creating a frame containing some text.  The content of the
 * text box can be changed using frame.text.set.
 */
dag.elements.text = function (positionParameters, parent = dag.window) {
    positionParameters.height = dag.placeholder(0);

    var frame = dag.frame(positionParameters, parent);
    var container = document.createElement("div");
    container.style.overflow = "hidden";
    var text = dag.string("");

    text.addUpdateCallback(function (u) {
        container.innerText = u.value;
    });

    frame.element.appendChild(container);
    frame.text = text;

    frame.minimumHeight = dag.int(0);
    var inputSize = dag.inputs.size(container).height;
    var newSize = dag.pair.max(
        frame.minimumHeight, inputSize
    )
    frame.height.newSource(newSize);

    return frame;
}
