dag = {};

window.onload = function () {
    dag.window = document.createElement("div");
    dag.window.style.position = "fixed";
    ["top", "left", "bottom", "right"].forEach(function (k) {
        dag.window.style[k] = 0;
    });
    dag.window.style.overflow = "auto";
    dag.window.id = "dagWindow";
    document.body.appendChild(dag.window);
}
