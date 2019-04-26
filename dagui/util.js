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
            return new DAGBoolean(value);
        } else if (typeof value === "string") {
            return new DAGString(value);
        } else if (Number.isInteger(value)) {
            return new DAGInt(value);
        } else {
            return new DAGFloat(value);
        }
    }
}

/**
 * A debug function for logging the new value of a unit
 * each time it is updated.
 */
dag.log = function (unit, name = null) {
    if (name !== null) {
        unit.addUpdateCallback(function (u) {
            console.log(name + " updated: " + new String(u.value));
        });
    } else {
        unit.addUpdateCallback(function (u) {
            console.log(u.value);
        });
    }
}

/**
 * Removes an input from the given unit.  Does not update the unit afterwards.
 */
dag.removeInput = function (frame, inputName) {
    var source = frame.inputs[inputName];
    delete frame.inputs[inputName];
    var index = source.dependents.indexOf(frame);
    if (index > -1) {
        source.dependents.splice(index, 1);
    }
}

/**
 * Add a new input to the given unit.  By default, updates the unit afterwards.
 */
dag.addInput = function (frame, inputName, inputUnit, update = true) {
    frame.inputs[inputName] = inputUnit;
    inputUnit.dependents.push(frame);
    if (update) {
        frame.update();
    }
}

/**
 * Replace an input of a unit.  By default, updates the unit afterwards.
 */
dag.replaceInput = function (frame, inputName, inputUnit, update = true) {
    dag.removeInput(frame, inputName);
    dag.addInput(frame, inputName, inputUnit, update);
}
