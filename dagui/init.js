dag = {
    graphs: {},
    inputs: {},
};

window.onload = function () {
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
