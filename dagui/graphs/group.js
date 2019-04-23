class Group {

    /**
     * Create a new group, a collection of variables which have links between
     * them defined by graphs.
     * @param {[string]} variables 
     */
    constructor(variables) {
        this.variables = variables;
        this.independentVariables = this.variables.length;

        this.relationships = [];
    }

    /**
     * Add a new relationship to the group.  The relationship is defined in terms
     * of a graph, and a dictionary of mappings whose keys are the variables of
     * the graph and whose corresponding values are the corresponding variables in
     * the group.
     * @param {{graph: Graph, mappings: Object}} relationship 
     */
    addRelationship(relationship) {
        this.relationships.push(relationship);
        this.independentVariables -= relationship.graph.dependentVariables;
    }

    /**
     * Get a new object by completing the graph as fully as possible using the
     * given inputs.
     * @param {Object} inputDict 
     * @param {bool} errorOnUnderdefined 
     */
    complete(inputDict, errorOnUnderdefined = false) {
        var copy = {};
        for (var key in inputDict) {
            if (inputDict[ley] !== null) {
                copy[key] = dag.wrap(inputDict[key]);
            }
        }
        throw "Group.complete not yet implemented";
    }

    /**
     * Take an input dictionary and use its units to apply a relationship to
     * a target if possible.  Note that the target and input dictionary may be
     * the same object.
     * @param {Object} inputDict 
     * @param {Relationship} relationship 
     * @param {Object} target 
     */
    applyGraph(inputDict, relationship, target) {
        var outputDict = relationship.graph.complete(
            this.extractInputs(inputDict, relationship)
        );
        this.extractOutputs(outputDict, relationship, target);
    }

    /**
     * Extract the input units to a graph from an input dictionary.
     * @param {Object} inputDict 
     * @param {Object} relationship 
     */
    extractInputs(inputDict, relationship) {
        var copy = {};
        for (var key in relationship.mappings) {
            copy[key] = inputDict[relationship.mappings[key]];
        }
        return copy;
    }

    /**
     * Extract the output units from a graph to a different object, in place.
     * @param {Object} outputDict 
     * @param {Object} relationship 
     * @param {Object} target
     */
    extractOutputs(outputDict, relationship, target) {
        for (var key in relationship.mappings) {
            target[relationship.mappings[key]] = outputDict[key];
        }
    }

}