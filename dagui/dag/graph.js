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

        Graph.notifyInputs(node, node.inputs);
    }

    /**
     * Notify each of the inputs of a Node that they
     * are outputting their value to that node if they are part
     * of the specified graph.
     * @param {Node} node 
     */
    static notifyInputs(node) {
        var notifyInputsInner = function(input) {
            if (input instanceof Array) {
                input.forEach(i => notifyInputsInner(i));
            } else if (input instanceof Node) {
                if (input.dependents.indexOf(node) === -1) {
                    input.dependents.push(node);
                }
            } else {
                forObject(notifyInputsInner, input)
            }
        }
        notifyInputsInner(node.inputs);
    }

    /**
     * Add a subgraph to the given graph, adding each of the subgraph's
     * nodes to the list of descendents of each of their inputs.
     * @param {object} graph 
     * @param {string} name 
     * @param {object} subgraph 
     */
    static addGraph(graph, name, subgraph) {
        if (graph[name] !== undefined) {
            console.error("A subgraph named " + name + " already exists.");
            return;
        }
        graph[name] = subgraph;
        Graph.iterateNodes(n => Graph.notifyInputs(n), subgraph);
    }

    /**
     * Execute a function on each Node of the given graph.
     * @param {function} f 
     * @param {object} graph 
     */
    static iterateNodes(f, graph) {
        for (var property in graph) {
            if (graph[property] instanceof Node) {
                f(graph[property]);
            } else {
                Graph.iterateNodes(f, graph[property]);
            }
        }
    }
}
