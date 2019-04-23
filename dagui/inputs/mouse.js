/**
 * A function that returns two units denoting the mouse's position relative
 * to the top left corner of the given frame.  
 */
dag.inputs.mousePosition = function (frame = dag.window) {
    var framePosition = frame.globalPosition();
    var globalMousePosition = dag.inputs.getMousePositionUnits();
    return {
        x: dag.subtract(globalMousePosition.x, framePosition.x),
        y: dag.subtract(globalMousePosition.y, framePosition.y)
    }
}

/**
 * A function that returns units referring to the global mouse coordinates,
 * updated whenever the mouse moves within the DAG window.
 */
dag.inputs.getMousePositionUnits = function () {
    if (dag.inputs.globalMouseX === undefined) {
        dag.inputs.globalMouseX = dag.int(0);
        dag.inputs.globalMouseY = dag.int(0);
        dag.window.element.onmousemove = function (event) {
            dag.inputs.globalMouseX.set(event.clientX);
            dag.inputs.globalMouseY.set(event.clientY);
        }
    }
    return { x: dag.inputs.globalMouseX, y: dag.inputs.globalMouseY }
}

/**
 * A function that returns a unit representing whether or not the mouse
 * is within the current frame.
 */
dag.inputs.mouseWithin = function (frame) {
    var mouseWithin = dag.boolean(false);
    frame.element.onmouseenter = function () {
        mouseWithin.verify();
    }
    frame.element.onmouseleave = function () {
        mouseWithin.falsify();
    }
    return mouseWithin;
}