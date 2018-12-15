class Node {
    /**
     * Create a Node object.  If applyDelta and/or applyDeltas are not provided,
     * default implementations will be created.
     * 
     * recalculate: given a value, dictionary, or list - created by taking the values
     * of each of the nodes in the input object - calculate the value of this node
     * and return it.
     * 
     * applyDelta: given a node and one delta object, apply the delta to the node
     * and return a new delta describing changes to the node, if any.
     * 
     * applyDeltas: given a node, apply all of the queued deltas to the object,
     * updating its value if needed, clearing all queued deltas, and noting that
     * the node's value is accurate.  This should return a list of deltas desribing
     * the changes made to the node's value, if any.
     * 
     * All of the above values may assume that the node's inputs' values are
     * up to date.
     * 
     * @param {object} inputs 
     * @param {function} recalculate 
     * @param {function} applyDelta 
     * @param {function} applyDeltas 
     */
    constructor(inputs, recalculate, applyDelta = null, applyDeltas = null) {
        this.value = null;
        this.valueAccurate = false;

        this.inputs = inputs;
        this.dependents = [];
        this.graphStack = [];

        this.recalculate = recalculate;
        this.applyDelta = applyDelta;
        this.applyDeltas = applyDeltas !== null ? applyDeltas : this.defaultApplyDeltas();

        this.queuedDeltas = [];
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
     * Return a default implementation of applyDeltas from the definitions
     * of either applyDelta or recalculate.
     */
    defaultApplyDeltas() {
        if (this.applyDelta === null) {
            return function(self) {
                self.value = self.recalculate(self.getInputValues());
                self.queuedDeltas = [];
                self.valueAccurate = true;
                return ["recalculated"];
            }
        } else {
            return function(self) {
                var newDeltas = [];
                for (var i = 0; i < self.queuedDeltas.length; i++) {
                    newDeltas.push(self.applyDelta(self, self.queuedDeltas[i]));
                }
                self.queuedDeltas = [];
                self.valueAccurate = true;
                return newDeltas;
            }
        }
    }
}
