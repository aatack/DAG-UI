/**
 * Count the number of immediate properties
 * an object has.
 * @param {object} object 
 */
function countObjectFields(object) {
    var i = 0;
    for (var property in object) {
        i += 1;
    }
    return i;
}

/**
 * Map the immediate properties of an object
 * according to some transfer function.
 * @param {function} f 
 * @param {object} object 
 */
function mapObject(f, object) {
    var output = {};
    for (var property in object) {
        output[property] = f(object[property]);
    }
    return output;
}

/**
 * Apply a function to each member of an object.
 * @param {function} f 
 * @param {object} object 
 */
function forObject(f, object) {
    for (var property in object) {
        f(object[property]);
    }
}
