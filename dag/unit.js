class Unit {

    /**
     * Create a new Unit with an optional default value.
     * @param {any} value 
     */
    constructor(value = null) {
        this.inputs = {};
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
     * Apply all queued updates to the Unit's value.
     */
    apply() {
        throw "Unit.apply is not defined";
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
            this.apply();
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
}