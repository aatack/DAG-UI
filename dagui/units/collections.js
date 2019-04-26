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

dag.dictionary = function (kvps) {
    throw "DAG dictionaries not yet implemented";
}
