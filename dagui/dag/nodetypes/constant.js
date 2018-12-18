class ConstantNode extends Node {
    /**
     * Create a node whose value is constant and unchanging.
     * @param {any} value 
     */
    constructor(value) {
        super({}, []);
        this.constantValue = value;
    }

    /**
     * Set the value of the object if an initialised delta
     * has been queued for the node.  Otherwise, do nothing.
     */
    applyDeltas() {
        for (var i = 0; i < this.queuedDeltas.length; i++) {
            if (this.queuedDeltas[i] instanceof Initialised) {
                this.value = this.constantValue;
                return [new ValueChanged(this, null, this.constantValue)];
            }
        }
        return [];
    }
}
