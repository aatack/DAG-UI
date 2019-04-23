class BaseUnit extends Unit {

    /**
     * Create a new base unit, an input for a certain kind of value.
     * @param {any} value 
     */
    constructor(value) {
        super({});
        this.doTypeCheck(value);
        this.value = value;
    }

    /**
     * Check that a candidate value conforms to any type constraints.
     * Return true if so, or false if not.
     * @param {any} value
     */
    typeCheck(value) {
        throw "BaseUnit.typeCheck not implemented";
    }

    /**
     * Check that a candidate value conforms to any type constraints
     * and throw an error if it does not.
     * @param {any} value 
     */
    doTypeCheck(value) {
        if (!this.typeCheck(value)) {
            throw "type check failed"
        }
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.  For a base unit, this does nothing.
     */
    recalculateValue() { }

    /**
     * Set the value of the unit to an entirely new value.
     * @param {any} newValue 
     * @param {boolean} typeCheck 
     */
    set(newValue, typeCheck = true) {
        if (typeCheck) this.doTypeCheck(newValue);
        this.value = newValue;
        this.update();
    }

}

class DAGFloat extends BaseUnit {

    /**
     * Check that a candidate value conforms to any type constraints.
     * Return true if so, or false if not.
     */
    typeCheck(value) {
        return !Number.isNaN(value);
    }

    /**
     * Increment the unit's value.
     */
    increment() {
        this.add(1);
    }

    /**
     * Decrement the unit's value.
     */
    decrement() {
        this.subtract(1);
    }

    /**
     * Add a number to this unit's value.
     * @param {float} x 
     */
    add(x) {
        this.set(this.value + x);
    }

    /**
     * Subtract a number from this unit's value.
     * @param {float} x 
     */
    subtract(x) {
        this.set(this.value - x);
    }

}

dag.float = x => new DAGFloat(x);

class DAGInt extends DAGFloat {

    /**
     * Check that a candidate value conforms to any type constraints.
     * Return true if so, or false if not.
     */
    typeCheck(value) {
        return Number.isInteger(value);
    }

}

dag.int = i => new DAGInt(i);

class DAGBoolean extends BaseUnit {

    /**
     * Check that a candidate value conforms to any type constraints.
     * Return true if so, or false if not.
     */
    typeCheck(value) {
        return typeof value === "boolean";
    }

    /**
     * Change the value of the unit from true to false or vice versa.
     */
    toggle() {
        this.set(!this.value);
    }

    /**
     * Set the unit's value to false.
     */
    falsify() {
        this.set(false);
    }

    /**
     * Set the unit's value to true.
     */
    verify() {
        this.set(true);
    }

}

dag.boolean = b => new DAGBoolean(b);

class DAGString extends BaseUnit {

    /**
     * Check that a candidate value conforms to any type constraints.
     * Return true if so, or false if not.
     */
    typeCheck(value) {
        return typeof value === "string";
    }

}

dag.string = s => new DAGString(s);

class DAGPixel extends DAGFloat {

    /**
     * Create a new base unit, an input for a certain kind of value.
     * @param {any} value 
     */
    constructor(value) {
        super({});
        this.doTypeCheck(value);
        this.value = this.numberToPixel(value);

        var cancelledFunctions = ["add", "subtract", "increment", "decrement"];
        for (var i in cancelledFunctions) {
            this[cancelledFunctions[i]] = undefined;
        }
    }

    /**
     * Set the value of the unit to an entirely new value.
     * @param {any} newValue 
     * @param {boolean} typeCheck 
     */
    set(newValue, typeCheck = true) {
        if (typeCheck) this.doTypeCheck(newValue);
        this.value = this.numberToPixel(newValue);
        this.update();
    }

    numberToPixel(x) {
        return Math.floor(x).toString() + "px";
    }

}

dag.pixel = p => new DAGPixel(p);
