/**
 * Return units representing the size of the given element in pixels.
 */
dag.inputs.size = function (element) {
    var size = {
        height: dag.int(element.offsetHeight),
        width: dag.int(element.offsetWidth)
    }
    new ResizeObserver(function () {
        size.height.set(element.offsetHeight);
        size.width.set(element.offsetWidth);
    }).observe(element);
    return size;
}