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
     * Add a number of relationships to the group at once.
     * @param {[Relationship]} relationships 
     */
    addRelationships(relationships) {
        for (var i in relationships) {
            this.addRelationship(relationships[i]);
        }
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
            if (inputDict[key] !== null) {
                copy[key] = dag.wrap(inputDict[key]);
            }
        }

        var applicableRelationships = this.getApplicableRelationships(copy);
        while (applicableRelationships.length > 0) {
            for (var i in applicableRelationships) {
                this.applyGraph(copy, applicableRelationships[i], copy);
            }
            applicableRelationships = this.getApplicableRelationships(copy);
        }

        return copy;
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
            if (inputDict[relationship.mappings[key]] !== undefined) {
                copy[key] = inputDict[relationship.mappings[key]];
            }
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
            if (outputDict[key] !== undefined) {
                target[relationship.mappings[key]] = outputDict[key];
            }
        }
    }

    /**
     * Return those relationships which have inputs defined in the given
     * dictionary of units but outputs undefined, such that that relationship
     * can be used to determine the value of unknown units.
     * @param {Object} units 
     */
    getApplicableRelationships(units) {
        var applicable = [];
        for (var i in this.relationships) {
            var relationship = this.relationships[i];
            if (this.countDefinedVariables(units, relationship)
                === relationship.graph.independentVariables) {
                applicable.push(relationship);
            }
        }
        return applicable;
    }

    /**
     * Count the number of units relevant to the given relationship which are
     * defined in the input dictionary.
     * @param {Object} units 
     * @param {Relationship} relationship 
     */
    countDefinedVariables(units, relationship) {
        var count = 0;
        for (var key in this.extractInputs(units, relationship)) {
            if (relationship.graph.variables.includes(key)) {
                count++;
            }
        }
        return count;
    }

}