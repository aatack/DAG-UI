/**
 * Wrap a value in a unit.
 * @param {any} value 
 */
dag.wrap = function (value) {
    if (value instanceof Unit) {
        return value;
    }

    switch (typeof value) {
        case "function":
            return dag.lambda(value);
        case "boolean":
            return dag.boolean(value);
        case "string":
            return dag.string(value);
        case "number":
            return Number.isInteger(value) ? dag.int(value) : dag.float(value);
        case "object":
            switch (value.constructor.name) {
                case "Array":
                    return dag.array(value);
                case "Object":
                    return dag.dictionary(value);
                default:
                    return dag.object(value);
            }
        default:
            throw "unwrappable type " + (typeof value) + ", " + new String(value);
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
dag.util.removeInput = function (frame, inputName) {
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
dag.util.addInput = function (frame, inputName, inputUnit, update = true) {
    frame.inputs[inputName] = inputUnit;
    inputUnit.dependents.push(frame);
    if (update) {
        frame.update();
    }
}

/**
 * Replace an input of a unit.  By default, updates the unit afterwards.
 */
dag.util.replaceInput = function (frame, inputName, inputUnit, update = true) {
    dag.util.removeInput(frame, inputName);
    dag.util.addInput(frame, inputName, inputUnit, update);
}

/**
 * Search recursively through the inputs of a unit for a unit satisfying
 * a predicate.
 */
dag.util.searchInputs = function (unit, predicate, stack = "") {
    for (var inputName in unit.inputs) {
        if (predicate(unit.inputs[inputName])) {
            return {
                "unit": unit.inputs[inputName],
                "stack": stack + inputName
            };
        } else {
            var childSearchResults = dag.util.searchInputs(
                unit.inputs[inputName],
                predicate,
                stack + inputName + " -> "
            );
            if (childSearchResults !== null) {
                return childSearchResults;
            }
        }
    }
    return null;
}

/**
 * Determine whether one unit depends on another unit.  Returns false if there
 * is no dependency, or a string describing the path if so.
 */
dag.util.dependsOn = function (dependent, unit) {
    var searchResults = dag.util.searchInputs(unit, u => u === dependent);
    return searchResults === null ? false : searchResults.stack;
}

/**
 * Throw an error if creating a directed link between two units would result
 * in a cyclic graph.
 */
dag.util.errorIfDependsOn = function (dependent, unit) {
    var dependency = dag.util.dependsOn(dependent, unit);
    if (dependency !== false) {
        throw "cyclic dependency found: " + dependency;
    }
}
