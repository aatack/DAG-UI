dag = {
    util: {},
    graphs: {},
    inputs: {},
    elements: {},
    config: {
        raiseCyclicErrors: true,
    }
};

window.onload = function () {
    makeDAGWindow();

    // NOTE: for debugging purposes only
    runTests();
}

function makeDAGWindow() {
    var screenDimensions = dag.inputs.screenDimensions();
    dag.window = new Frame({
        top: 0,
        left: 0,
        width: screenDimensions.width,
        height: screenDimensions.height
    }, { element: document.body });
}
