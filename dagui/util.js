/**
 * Wrap a value in a unit.
 * @param {any} value 
 */
function wrap(value) {
    if (value instanceof Unit) {
        return value;
    } else if (value instanceof Array) {
        var wrapped = [];
        for (var i in value) {
            wrapped.push(wrap(value[i]));
        }
        return wrapped;
    } else if (value instanceof Object) {
        var wrapped = {};
        for (var key in value) {
            wrapped[key] = wrap(value[key]);
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