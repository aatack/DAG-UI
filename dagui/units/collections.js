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

}