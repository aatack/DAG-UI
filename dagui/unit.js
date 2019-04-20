class Unit {

    /**
     * Create a new unit, giving a list of those units from which it takes inputs.
     * @param {Object} inputs
     */
    constructor(inputs) {
        this.inputs = inputs;
        for (var key in inputs) {
            inputs[key].addDependent(this);
        }
        this.dependents = [];
        this.active = true;
        this.updateCallbacks = [];

        this.value = null;
        this.recalculateValue();
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        throw "Unit.recalculateValue not implemented";
    }

    /**
     * Register that another unit depends on this one.
     * @param {Unit} dependent 
     */
    addDependent(dependent) {
        this.dependents.push(dependent);
    }

    /**
     * Update the value of the unit, calling its update callbacks if it is active.
     */
    update() {
        if (this.active) {
            this.recalculateValue();
            for (var i in this.updateCallbacks) {
                this.updateCallbacks[i](this);
            }
            for (var i in this.dependents) {
                this.dependents[i].update();
            }
        }
    }

    /**
     * Deactivate the unit, so its values will not be activated automatically.
     */
    deactivate() {
        this.active = false;
    }

    /**
     * Activate the unit, denoting that its value should be updated instantly
     * in the future.
     */
    activate() {
        this.active = true;
        this.update();
    }

    /**
     * Add a callback, as a function of the updated node, to be performed
     * whenever its value is updated.
     * @param {Unit -> ()} f 
     */
    addUpdateCallback(f) {
        this.updateCallbacks.push(f);
    }

}
