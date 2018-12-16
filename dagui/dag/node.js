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
     * @param {[function]} events
     */
    constructor(inputs, recalculate, applyDelta = null, applyDeltas = null,
            events = []) {
        this.value = null;
        this.valueAccurate = false;

        this.inputs = inputs;
        this.dependents = [];
        this.graphStack = [];

        this.recalculate = recalculate;
        this.applyDelta = applyDelta;
        this.applyDeltas = applyDeltas !== null ? applyDeltas : this.defaultApplyDeltas();

        this.events = events;

        this.queuedDeltas = [];
    }

    /**
     * Applies all pending deltas.  This is used instead of simply
     * calling applyDeltas publicly so that events and responses to
     * being updated can be added later on.
     */
    update() {
        var deltas = this.applyDeltas(this);
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

/**
 * Create a node whose value cannot be changed over time.
 * @param {value} value 
 */
function constantNode(value) {
    var n = new Node([], _ => value, null, function(node) {
        node.value = value;
        node.valueAccurate = true;
        if (node.queuedDeltas.length > 0) {
            console.error("Cannot apply deltas to a constant node.");
            node.queuedDeltas = [];
        }
        return [];
    }, events = []);
    n.value = value;
    n.valueAccurate = true;
    return n;
}

/**
 * Create a node whose value can be changed by queueing a delta
 * which equals that value.
 * @param {value} defaultValue 
 */
function variableNode(defaultValue = null) {
    var n = new Node([], _ => defaultValue, null, function(node) {
        if (node.queuedDeltas.length === 0) {
            return [];
        } else {
            var newValue = node.queuedDeltas[node.queuedDeltas.length - 1];
            var oldValue = node.value;
            node.value = newValue;
            node.valueAccurate = true;
            node.recalculate = _ => newValue;
            node.queuedDeltas = [];
            return [{ oldValue: oldValue, newValue: newValue }];
        }
    }, events = []);
    n.value = defaultValue;
    n.valueAccurate = true;
    return n;
}

/**
 * Return a node which applies a monadic function to the value
 * of another node.
 * @param {function} f 
 * @param {Node} argumentNode 
 */
function monadicNode(f, argumentNode) {
    n = new Node(argumentNode, x => f(x), null, function(node) {
        if (node.queuedDeltas.length > 0) {
            node.queuedDeltas = [];
            node.valueAccurate = true;
            var oldValue = node.value;
            var newValue = node.recalculate(node.getInputValues());
            if (newValue != oldValue) {
                node.value = newValue;
                return [{ newValue: newValue, oldValue: oldValue }];
            } else {
                return [];
            }
        }
    }, events = []);
    n.queuedDeltas.push("initialise");
    return n;
}

/**
 * Return a node which applies a diadic function to the values
 * of two other nodes.
 * @param {function} f 
 * @param {string} firstArgumentName 
 * @param {string} secondArgumentName 
 * @param {Node} firstArgumentNode 
 * @param {Node} secondArgumentNode 
 */
function diadicNode(f, firstArgumentName, secondArgumentName,
        firstArgumentNode, secondArgumentNode) {
    var inputValues = {};
    inputValues[firstArgumentName] = firstArgumentNode;
    inputValues[secondArgumentName] = secondArgumentNode;
    n = new Node(inputValues,
        d => f(d[firstArgumentName], d[secondArgumentName]));
    n.queuedDeltas.push("initialise");
    return n;
}
