/**
 * A function which returns an array unit whose contingent functions
 * are each called every time the screen is resized.
 */
dag.inputs.getScreenResizeEvents = function () {
    if (dag.inputs.screenResizeEvents === undefined) {
        var screenResizeEvents = dag.array();
        screenResizeEvents.addUpdateCallback(function (u) {
            window.onresize = function (e) {
                for (var i in u.value) {
                    u.value[i](e);
                }
            };
        });
        dag.inputs.screenResizeEvents = screenResizeEvents;
    }
    return dag.inputs.screenResizeEvents;
}

/**
 * A function which returns two units denoting the screen width and height.
 */
dag.inputs.screenDimensions = function () {
    var events = dag.inputs.getScreenResizeEvents();
    var dimensions = {
        width: dag.int(window.innerWidth),
        height: dag.int(window.innerHeight)
    };
    events.append(function () {
        dimensions.width.set(window.innerWidth);
    });
    events.append(function () {
        dimensions.height.set(window.innerHeight);
    });
    return dimensions;
}
