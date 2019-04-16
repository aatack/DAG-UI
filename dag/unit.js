class Unit {

    /**
     * Create a new Unit with an optional default value.
     * @param {object} inputs
     * @param {any} value 
     */
    constructor(inputs, value = null) {
        this.inputs = inputs;
        for (var inputName in this.inputs) {
            this.inputs[inputName].addOutput(this);
        }

        this.outputs = [];

        this.value = value;
        this.outOfDate = this.value === null;
    }

    /**
     * Queue an update to the Unit but do not apply it.
     * @param {object} delta 
     */
    queue(delta) {
        this.declareOutOfDate();
    }

    /**
     * Apply all queued updates to the Unit's value.  Return a delta describing
     * any changes that took place.
     */
    apply() {
        return Delta.unchanged(this);
    }

    /**
     * Notify the unit that its value has become out of date, and propagate
     * that information forward through the graph.
     */
    declareOutOfDate() {
        if (!this.outOfDate) {
            for (var i in this.outputs) {
                this.outputs[i].declareOutOfDate();
            }
        }
    }

    /**
     * Apply any pending changes, including those of all units this unit
     * depends upon, and update the stored value.
     */
    update() {
        if (this.outOfDate) {
            // Update all inputs
            for (var inputName in this.inputs) {
                this.inputs[inputName].update();
            }
            this.broadcast(this.apply());
            this.outOfDate = false;
        }
    }

    /**
     * Broadcast a change in state to all Units accepting input from this one.
     * @param {object} delta 
     */
    broadcast(delta) {
        for (var i in this.outputs) {
            this.outputs[i].queue(delta);
        }
    }

    /**
     * Add another Unit to the list of this Unit's outputs.
     * @param {Unit} unit 
     */
    addOutput(unit) {
        this.outputs.push(unit);
    }

    /**
     * Determines whether or not this Unit is dependent upon another one.
     * May compute slowly for large graphs.
     * @param {Unit} unit 
     */
    isDependentUpon(unit) {
        for (var inputName in this.inputs) {
            var other = this.inputs[inputName];
            if (other === unit) {
                return true;
            } else if (other.isDependentUpon(unit)) {
                return true;
            }
        }
        return false;
    }

}
