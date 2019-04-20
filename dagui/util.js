/**
 * Wrap a value in a unit.
 * @param {any} value 
 */
dag.wrap = function (value) {
    if (value instanceof Unit) {
        return value;
    } else if (value instanceof Array) {
        var wrapped = [];
        for (var i in value) {
            wrapped.push(dag.wrap(value[i]));
        }
        return wrapped;
    } else if (value instanceof Object) {
        var wrapped = {};
        for (var key in value) {
            wrapped[key] = dag.wrap(value[key]);
        }
        return wrapped;
    } else {
        if (typeof value === "boolean") {
            return new Boolean(value);
        } else if (typeof value === "string") {
            return new String(value);
        } else if (Number.isInteger(value)) {
            return new Int(value);
        } else {
            return new Float(value);
        }
    }
}

class Copy extends Unit {

    /**
     * Create a unit which simply copies the value of another unit,
     * normally purely for testing purposes.
     * @param {Unit} source 
     */
    constructor(source) {
        super({ "source": source });
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        this.value = this.inputs.source.value;
    }

}

dag.copy = u => new Copy(u);