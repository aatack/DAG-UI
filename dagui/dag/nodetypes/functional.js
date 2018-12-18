class MonadicFunction extends Node {

}

class DiadicFunction extends Node {
    /**
     * Create a node which takes inputs from two other nodes
     * and computes a function of their values.  Should not
     * be used for arrays or objects.
     * @param {function} transferFunction 
     * @param {string} firstArgumentName 
     * @param {string} secondArgumentName 
     * @param {Node} firstArgumentNode 
     * @param {Node} secondArgumentNode 
     */
    constructor(
        transferFunction,
        firstArgumentName,
        secondArgumentName,
        firstArgumentNode,
        secondArgumentNode
    ) {
        super(buildDiadicInputObject(
            firstArgumentName, firstArgumentNode,
            secondArgumentName, secondArgumentNode
        ), []);

        this.transferFunction = function (inputValues) {
            return transferFunction(
                inputValues[firstArgumentName],
                inputValues[secondArgumentName]);
        };
    }

    /**
     * Update the value of this node if either of the inputs'
     * values have changed.
     */
    applyDeltas() {
        for (var i = 0; i < this.queuedDeltas.length; i++) {
            if (this.queuedDeltas[i] instanceof ValueChanged ||
                this.queuedDeltas[i] instanceof Initialised) {
                var oldValue = this.value;
                var newValue = this.transferFunction(this.getInputValues());

                this.value = newValue;

                return oldValue === newValue ? []
                    : [new ValueChanged(this, oldValue, newValue)];
            }
        }
        return [];
    }
}

/**
 * Build an input object to be passed to the Node
 * constructor for a diadic function node.
 * @param {string} firstArgumentName 
 * @param {Node} firstArgumentNode 
 * @param {string} secondArgumentName 
 * @param {node} secondArgumentNode 
 */
function buildDiadicInputObject(
    firstArgumentName, firstArgumentNode,
    secondArgumentName, secondArgumentNode
) {
    var inputs = {};
    inputs[firstArgumentName] = firstArgumentNode;
    inputs[secondArgumentName] = secondArgumentNode;
    return inputs;
}
