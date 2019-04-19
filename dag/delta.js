class Delta {

    /**
     * Create a new Delta of a specific type.
     * @param {string} type
     * @param {Delta -> Delta} cast
     */
    constructor(source, type, cast) {
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
     * @param {any} newValue 
     */
    static changed(newValue) {
        var delta = new Delta("changed", function (d) {
            throw "cannot cast a changed Delta";
        });
        delta.newValue = newValue;
        return delta;
    }

    /**
     * A Delta denoting that, while a Unit's value was updated, it
     * remained unchanged.
     */
    static unchanged() {
        return new Delta("unchanged", function (d) {
            throw "cannot cast an unchanged Delta";
        });
    }

}
