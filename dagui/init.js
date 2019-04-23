dag = {
    graphs: {},
    inputs: {},
};

window.onload = function () {
    makeDAGWindow();

    // NOTE: for debugging purposes only
    runTests();
}

function makeDAGWindow() {
    dag.window = new Frame({
        top: 0,
        left: 0,
        width: screen.width,
        height: screen.height
    }, { element: document.body });
}
