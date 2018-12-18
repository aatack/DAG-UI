class Node {
    /**
     * Create a Node object, whose value is a function of the its dependent
     * nodes.  The inputs should be either a Node, an object whose leaves
     * are Node objects, or a list of Node objects.  The value of the node
     * is calculated by calling applyDeltas() whenever its value is requested. 
     * @param {object} inputs 
     * @param {[function]} events
     */
    constructor(inputs, events = []) {
        this.value = null;
        this.valueAccurate = false;

        this.inputs = inputs;
        this.dependents = [];
        this.graphStack = [];

        this.events = events;

        this.queuedDeltas = [];
    }

    /**
     * Applies all pending deltas.  This is used instead of simply
     * calling applyDeltas publicly so that events and responses to
     * being updated can be added later on.  This will also set
     * valueAccurate to true and clear any queued deltas.
     */
    update() {
        var deltas = this.applyDeltas();
        this.valueAccurate = true;
        this.queuedDeltas = [];
        this.events.forEach(e => e(deltas));
        return deltas;
    }

    /**
     * Returns true iff the node does not take input from any nodes.
     */
    hasNoInputs() {
        return countObjectFields(this.inputs) === 0;
    }

    /**
     * Map each of the nodes in the input dictionary to its value.
     * Does not check that the nodes are up to date.
     */
    getInputValues() {
        var mapToInputValues = function (nodes) {
            if (nodes instanceof Node) {
                return nodes.value;
            } else if (nodes instanceof Array) {
                return nodes.map(n => mapToInputValues(n));
            } else {
                return mapObject(mapToInputValues, nodes);
            }
        }
        return mapToInputValues(this.inputs);
    }

    /**
     * Update the value of the node according to all the deltas
     * which have been queued for it.  This function is not required
     * to clear the queued deltas or to set valueAccurate to true.
     * It may be assumed that all inputs are up to date when this
     * function is called.
     */
    applyDeltas() {
        console.error("Node.applyDeltas not implemented.");
    }
}
