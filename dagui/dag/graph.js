class Graph {
    /**
     * Add a node to the given graph, adding it to the list of
     * dependents of all of its inputs.
     * @param {object} graph 
     * @param {string} name
     * @param {Node} node 
     */
    static addNode(graph, name, node) {
        if (graph[name] !== undefined) {
            console.error("A node named " + name + " already exists.");
            return;
        }
        graph[name] = node;

        var notifyInputs = function(input) {
            if (input instanceof Array) {
                input.forEach(i => notifyInputs(i));
            } else if (input instanceof Node) {
                input.dependents.push(node);
            } else {
                forObject(notifyInputs, input)
            }
        }

        notifyInputs(node.inputs);
    }
}
