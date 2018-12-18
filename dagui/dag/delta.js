class Delta {
    /**
     * Carries information about a change in a node's value.
     * @param {Node} source
     */
    constructor(source) {
        this.source = source;
    }
}

class Initialised extends Delta {
    /**
     * A delta denoting that the source node was initialised.
     * @param {Node} source 
     */
    constructor(source) {
        super(source);
    }
}

class ValueChanged extends Delta {
    /**
     * A delta denoting that the value of the source node has changed,
     * along with information about its old and new values.
     * @param {Node} source 
     * @param {any} oldValue 
     * @param {any} newValue 
     */
    constructor(source, oldValue, newValue) {
        super(source);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}

class ValueUnchanged extends Delta {
    /**
     * A delta denoting that the source node's value was
     * updated but did not ultimately change.
     * @param {Node} source 
     */
    constructor(source) {
        super(source);
    }
}

class ElementUpdated extends Delta {
    /**
     * A delta denoting that a list element was changed, including
     * information about its values before and after the change.
     * @param {Node} source 
     * @param {int} index 
     * @param {any} oldValue 
     * @param {any} newValue 
     */
    constructor(source, index, oldValue, newValue) {
        super(source);
        this.index = index;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}

class ElementInserted extends Delta {
    /**
     * A delta denoting that an element was inserted into a list
     * such that its index equals the index stored in the delta
     * after it was added.
     * @param {Node} source 
     * @param {int} index 
     * @param {any} value 
     */
    constructor(source, index, value) {
        super(source);
        this.index = index;
        this.value = value;
    }
}

class ElementRemoved extends Delta {
    /**
     * A delta denoting that the element at the given index
     * was removed from a list.
     * @param {Node} source 
     * @param {int} index 
     */
    constructor(source, index) {
        super(source);
        this.index = index;
    }
}
