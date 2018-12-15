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
        node.graphStack = [graph];
    }

    /**
     * Notify each of the inputs of a Node that they
     * are outputting their value to that node if they are part
     * of the specified graph.
     * @param {Node} node 
     */
    static notifyInputs(node) {
        Graph.iterateInputs(function (i) {
            if (i.dependents.indexOf(node) === -1) {
                i.dependents.push(node);
            }
        }, node);
    }

    /**
     * Iterate over the inputs of a node, applying a function to each.
     * @param {function} f 
     * @param {Node} node 
     */
    static iterateInputs(f, node) {
        var iterateInputsInner = function(input) {
            if (input instanceof Array) {
                input.forEach(i => iterateInputsInner(i));
            } else if (input instanceof Node) {
                f(input);
            } else {
                forObject(iterateInputsInner, input)
            }
        }
        iterateInputsInner(node.inputs);
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
        Graph.iterateNodes(function (n) {
            Graph.notifyInputs(n);
            n.graphStack.push(graph);
        }, subgraph);
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

    /**
     * Determine whether or not the node is part of the graph.
     * @param {Node} node 
     * @param {object} graph 
     */
    static isMember(node, graph) {
        return node.graphStack.indexOf(graph) !== -1;
    }

    /**
     * Return all the nodes upon which the given node's value depends
     * - either directly or indirectly - in an order such that if they
     * are updated in reverse, each node's inputs will be accurate
     * at the time it is updated.  The result will include the node
     * itself.
     * @param {Node} node 
     */
    static inaccurateInputs(node) {
        var inputs = [];
        var collectInaccurateInputs = function(node) {
            if (!node.valueAccurate) {
                inputs.push(node);
                Graph.iterateInputs(collectInaccurateInputs, node);
            }
        }
        collectInaccurateInputs(node);
        return inputs;
    }
}

a = new Node([], i => 5);
b = new Node({r: a}, i => i.r * 2);
c = new Node({r: a}, i => i.r * 3);
d = new Node({l: b, r: c}, i => i.l * i.r);

g = {}
Graph.addNode(g, "a", a);
Graph.addNode(g, "b", b);
Graph.addNode(g, "c", c);
Graph.addNode(g, "d", d);

G = {}
Graph.addGraph(G, "g", g);
