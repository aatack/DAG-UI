class VariableNode extends Node {
    /**
     * Create a Node whose value can be changed at any time
     * by queueing a ValueSet delta.  This node should not be
     * used for arrays or objects.
     * @param {any} defaultValue 
     */
    constructor(defaultValue) {
        super({}, []);
        this.defaultValue = defaultValue;
    }

    /**
     * Apply the most recent value change.  If the node is
     * initialised or re-initialised, it will take on its
     * default value.
     */
    applyDeltas() {
        if (this.queuedDeltas.length === 0) {
            return [];
        }

        var lastDelta = this.queuedDeltas[this.queuedDeltas.length - 1];
        var oldValue = this.value;
        var newValue;

        if (lastDelta instanceof Initialised) {
            newValue = this.defaultValue;
        } else if (lastDelta instanceof ValueSet) {
            newValue = lastDelta.value;
        } else {
            return [];
        }

        this.value = newValue;

        if (newValue === oldValue) {
            return [new ValueUnchanged(this)];
        } else {
            return [new ValueChanged(this, oldValue, newValue)];
        }
    }
}
