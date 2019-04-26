class UnitArray extends Unit {

    /**
     * Create a new array of units which is itself treated as an array.
     * @param {[any]} units 
     */
    constructor(units = []) {
        super(UnitArray.makeInputDict(units));
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        this.value = [];
        for (var i = 0; i < Object.keys(this.inputs).length; i++) {
            this.value.push(this.inputs[i].value);
        }
    }

    /**
     * Create an input dictionary from a list of units.
     * @param {[any]} units 
     */
    static makeInputDict(units) {
        var dict = {};
        for (var i in units) {
            dict[i.toString()] = dag.wrap(units[i]);
        }
        return dict;
    }

    /**
     * Append a unit to the end of an array.  Automatically updates the array
     * afterwards.
     * @param {Unit} unit 
     * @param {bool} update
     */
    append(unit, update = true) {
        dag.addInput(
            this,
            Object.keys(this.inputs).length.toString(),
            dag.wrap(unit),
            update
        );
    }

    /**
     * Index the array of values.
     * @param {int} i 
     */
    valueAt(i) {
        return this.value[i];
    }

    /**
     * Index the array of units.
     * @param {int} i 
     */
    unitAt(i) {
        return this.inputs[i];
    }

}

dag.array = function (v = []) {
    return new UnitArray(v);
}

class UnitDictionary extends Unit {

    /**
     * Create a dictionary of key-unit pairs, itself treated as a unit.
     * @param {string -> Unit} keyValuePairs 
     */
    constructor(keyValuePairs = {}) {
        super(UnitDictionary.makeInputDict(keyValuePairs));
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        this.value = {};
        for (var key in this.inputs) {
            this.value[key] = this.inputs[key].value;
        }
    }

    /**
     * Create an input dictionary by wrapping all value of an object.
     * @param {string -> Unit} keyValuePairs 
     */
    static makeInputDict(keyValuePairs) {
        var output = {};
        for (var key in keyValuePairs) {
            output[key] = dag.wrap(keyValuePairs[key]);
        }
        return output;
    }

    /**
     * Add a new key-value pair to the dictionary and automatically update it.
     * @param {string} key 
     * @param {Unit} value 
     * @param {bool} update 
     */
    set(key, value, update = true) {
        if (this.inputs[key] !== undefined) {
            throw "key " + key + " already defined; use replace instead";
        }
        dag.addInput(this, key, dag.wrap(value), update);
    }

    /**
     * Replace one key-value pair with another and update the relationships
     * between units accordingly.
     * @param {string} key 
     * @param {Unit} newValue 
     * @param {bool} update 
     */
    replace(key, newValue, update = true) {
        if (this.inputs[key] === undefined) {
            throw "key " + key + "not defined; use set instead";
        }
        dag.replaceInput(this, key, dag.wrap(newValue), update);
    }

}

dag.dictionary = function (kvps) {
    return new UnitDictionary(kvps);
}
