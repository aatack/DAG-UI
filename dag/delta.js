class Delta {

    /**
     * Create a new Delta of a specific type.
     * @param {Unit} source 
     * @param {string} type
     * @param {Delta -> Delta} cast
     */
    constructor(source, type, cast) {
        this.source = source;
        this.type = type;
        this.cast = cast;
    }

    /**
     * Cast the Delta until it fulfills one of the required types.
     * @param {[string]} possibleTypes 
     */
    castTo(possibleTypes) {
        if (possibleTypes.indexOf(this.type) >= 0) {
            return this;
        } else {
            return this.cast().castTo(possibleTypes);
        }
    }

    /**
     * A Delta denoting that a Unit's value has been altered.
     * @param {Unit} unit 
     */
    static changed(unit) {
        delta = new Delta(unit, "changed", function (d) {
            throw "cannot cast a changed Delta";
        });
        delta.newValue = unit.value;
        return delta;
    }

    /**
     * A Delta denoting that, while a Unit's value was updated, it
     * remained unchanged.
     * @param {Unit} unit 
     */
    static unchanged(unit) {
        return new Delta(unit, "unchanged", function (d) {
            throw "cannot cast an unchanged Delta";
        });
    }

}
