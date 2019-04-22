class Graph {

    /**
     * Create a new graph template, declaring which variables it uses
     * and how many degrees of freedom it allows.
     * @param {[string]} variables 
     * @param {int} degreesOfFreedom 
     */
    constructor(variables, degreesOfFreedom) {
        this.variables = variables;
        this.degreesOfFreedom = degreesOfFreedom;
        this.responses = [];
    }

    /**
     * Return a filtered version of the input object, where any value
     * which is null is removed and all other values are wrapped in DAG-UI units.
     * @param {Object} inputDict 
     */
    getInputNodes(inputDict) {
        var filtered = {};
        for (var key in inputDict) {
            if (inputDict[key] !== null) {
                filtered[key] = dag.wrap(inputDict[key]);
            }
        }
        return filtered;
    }

    /**
     * Register a new response for the graph.
     * @param {{variables: [string], response: Object -> Object}} response 
     */
    addResponse(response) {
        this.responses.push(response);
    }

    /**
     * Return an array of the variables defined by an input dictionary.
     * @param {Object} inputDict 
     */
    getFixedVariables(inputDict) {
        var fixedVariables = [];
        for (var key in inputDict) {
            fixedVariables.push(key);
        }
        return fixedVariables;
    }

    /**
     * Find the response, if any, that matches the given array of fixed
     * input variables.
     * @param {[string]} fixedVariables 
     */
    findMatchingResponse(fixedVariables) {
        for (var i in this.responses) {
            var response = this.responses[i];
            if (this.responseMatches(fixedVariables, response)) {
                return response;
            }
        }
        return null;
    }

    /**
     * Determine whether the given response is a function of exactly the
     * variables fixed by an input dictionary.
     * @param {[string]} fixedVariables 
     * @param {Response} response 
     */
    responseMatches(fixedVariables, response) {
        for (var i in fixedVariables) {
            if (!response.variables.includes(fixedVariables[i])) {
                return false;
            }
        }
        return true;
    }

}