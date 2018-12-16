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

    /**
     * Flag the given node as inaccurate.  If the node is not
     * already flagged as inaccurate, all nodes that depend on it
     * will also be flagged, and so on.
     * @param {Node} node 
     */
    static flagAsInaccurate(node) {
        if (node.valueAccurate) {
            node.valueAccurate = false;
            node.dependents.forEach(n => Graph.flagAsInaccurate(n));
        }
    }

    /**
     * Apply all the deltas for the node after applying all deltas
     * for any children of the node which are currently inaccurate.
     * @param {Node or [Node]} node 
     */
    static applyDeltas(node) {
        if (node instanceof Node) {
            var pendingUpdate = Graph.inaccurateInputs(node);
            for (var i = pendingUpdate.length - 1; i >= 0; i--) {
                if (!pendingUpdate[i].valueAccurate) {
                    Graph.applyDeltasLocal(pendingUpdate[i]);
                }
            }
        } else if (node instanceof Array) {
            node.forEach(n => Graph.applyDeltas(n));
        } else {
            forObject(n => Graph.applyDeltas(n), node);
        }
    }

    /**
     * Match an object containing deltas to a graph on their keys,
     * and enqueue the deltas for each node.  If a delta is given in
     * the form of a list, they will all be enqueued in order.
     * @param {object} graph 
     * @param {object} deltas 
     */
    static queueDeltas(graph, deltas) {
        for (var property in deltas) {
            if (!(property in graph)) {
                continue;
            }

            if (graph[property] instanceof Node) {
                Graph.queueNodeDeltas(graph[property], deltas[property]);
            } else {
                Graph.queueDeltas(graph[property], deltas[property]);
            }
        }
    }

    /**
     * Queue the deltas for the given node.  If the deltas form a
     * list, they will be queued in order; otherwise the object will
     * be added to the end of the queue.
     * @param {Node} node 
     * @param {object} deltas 
     */
    static queueNodeDeltas(node, deltas) {
        if (deltas instanceof Array) {
            if (deltas.length > 0) {
                Graph.flagAsInaccurate(node);
            }
            for (var i = 0; i < deltas.length; i++) {
                node.queuedDeltas.push(deltas[i]);
            }
        } else {
            Graph.flagAsInaccurate(node);
            node.queuedDeltas.push(deltas);
        }
    }

    /**
     * Apply all queued deltas to the node, and pass the new deltas
     * on to each of its outputs.  Assumes that all the inputs of the
     * node are accurate.
     * @param {Node} node 
     */
    static applyDeltasLocal(node) {
        var deltas = node.update();
        node.dependents.forEach(function(d) {
            for (var i = 0; i < deltas.length; i++) {
                d.queuedDeltas.push(new Delta(node, deltas[i]));
            }
        });
    }

    /**
     * Return an object whose structure copies that of the graph,
     * but contains the value of each node instead of the node itself.
     * @param {object} graph 
     */
    static extractValues(graph) {
        var output = {};
        for (var property in graph) {
            if (graph[property] instanceof Node) {
                output[property] = graph[property].value;
            } else {
                output[property] = Graph.extractValues(graph[property]);
            }
        }
        return output;
    }

    /**
     * Return only the nodes of the graph that satisfy
     * the predicate.
     * @param {function} predicate 
     * @param {object} graph 
     */
    static filterNodes(predicate, graph) {
        var output = {};
        var hasOutput = false;
        for (var property in graph) {
            if (graph[property] instanceof Node) {
                if (predicate(graph[property])) {
                    hasOutput = true;
                    output[property] = graph[property];
                }
            } else {
                var subgraphNodes = Graph.filterNodes(predicate, graph[property]);
                if (subgraphNodes !== null) {
                    hasOutput = true;
                    output[property] = subgraphNodes;
                }
            }
        }
        return hasOutput ? output : null;
    }

    /**
     * Return only those nodes that have no inputs.
     * @param {object} graph 
     */
    static getPublicNodes(graph) {
        return Graph.filterNodes(n => n.hasNoInputs(), graph);
    }
}
