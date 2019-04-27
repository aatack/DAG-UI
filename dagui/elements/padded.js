/**
 * A function for creating a frame with internal padding.  Both the internal
 * and external frames are returned.  The padding size should be provided as an
 * integer describing its width in pixels.
 */
dag.elements.padded = function (positionParameters, padding, parent = dag.window) {
    var external = dag.frame(positionParameters, parent);
    return {
        "external": external,
        "internal": dag.elements.paddedInner(padding, external)
    };
}

/**
 * Create a padded frame inside another one.
 */
dag.elements.paddedInner = function (padding, containingFrame) {
    var paddingUnit = dag.wrap(padding);
    var doublePadding = dag.multiply(paddingUnit, 2);
    var frame = dag.frame({
        top: paddingUnit,
        left: paddingUnit,
        width: dag.subtract(containingFrame.width, doublePadding),
        height: dag.subtract(containingFrame.height, doublePadding),
    }, containingFrame);
    frame.padding = paddingUnit;
    return frame;
}
