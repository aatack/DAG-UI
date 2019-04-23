dag = {
    graphs: {},
    inputs: {},
};

window.onload = function () {
    defineDAGWindow();
    addDAGWindowFunctions();

    // NOTE: for debugging purposes only
    runTests();
}

/**
 * Create the DAG window.
 */
function defineDAGWindow() {
    var dagWindow = document.createElement("div");
    dagWindow.style.position = "fixed";
    ["top", "left", "bottom", "right"].forEach(function (k) {
        dagWindow.style[k] = 0;
    });
    dagWindow.style.overflow = "auto";
    dagWindow.id = "dagWindow";
    document.body.appendChild(dagWindow);
    dag.window = { element: dagWindow };
}

/**
 * Add functions to the DAG window frame.
 */
function addDAGWindowFunctions() {
    dag.window.globalPosition = function () {
        return {
            x: dag.int(0),
            y: dag.int(0)
        }
    }
}
