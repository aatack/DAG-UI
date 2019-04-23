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
    dagWindow.id = "dagWindow";
    document.body.appendChild(dagWindow);
    dag.window = { element: dagWindow };
}

/**
 * Add functions to the DAG window frame.
 */
function addDAGWindowFunctions() {
    var self = dag.window;
    self.top = dag.int(0);
    self.left = dag.int(0);
    dag.window.globalPosition = function () {
        return {
            x: dag.int(0),
            y: dag.int(0)
        }
    }
    dag.window.setUpEventList = function (eventName, alias) {
        if (self[alias] === undefined) {
            var frame = self;
            self[alias] = dag.array();
            self[alias].addUpdateCallback(function (u) {
                frame.element[eventName] = function (eventData) {
                    for (var i in u.value) {
                        u.value[i](eventData);
                    }
                }
            });
        }
    }
}
