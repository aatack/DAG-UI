dag = {};

window.onload = function () {
    dag.frame = document.createElement("div");
    dag.frame.style.position = "fixed";
    ["top", "left", "bottom", "right"].forEach(function (k) {
        dag.frame.style[k] = 0;
    });
    dag.frame.style.overflow = "auto";
    dag.frame.id = "dagFrame";
    document.body.appendChild(dag.frame);
}
