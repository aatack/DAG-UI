class Graph {

    /**
     * Create a new graph template, declaring which variables it uses
     * and how many degrees of freedom it allows.
     * @param {[string]} variables 
     * @param {int} independentVariables 
     */
    constructor(variables, independentVariables) {
        this.variables = variables;

        this.independentVariables = independentVariables;
        this.dependentVariables = this.variables.length - this.independentVariables;

        this.responses = [];
    }

    /**
     * Return a filtered version of the input object, where any value
     * which is null is removed and all other values are wrapped in DAG-UI units.
     * @param {Object} inputDict 
     */
    getInputUnits(inputDict) {
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
        if (response.variables.length !== this.independentVariables) {
            throw "wrong number of independent variables";
        }
        this.responses.push(response);
    }

    /**
     * Get a new object by completing the graph as fully as possible with
     * the given inputs.
     * @param {Object} inputDict 
     * @param {bool} errorOnUnderdefined
     */
    complete(inputDict, errorOnUnderdefined = false) {
        var inputUnits = this.getInputUnits(inputDict);
        var independentVariables = this.getIndependentVariables(inputUnits);
        var response = this.findMatchingResponse(independentVariables);
        if (response === null) {
            if (errorOnUnderdefined) {
                throw "underdefined input";
            } else {
                return inputUnits;
            }
        } else {
            var output = response.response(inputUnits);
            for (var key in inputUnits) {
                output[key] = inputUnits[key];
            }
            return output;
        }
    }

    /**
     * Return an array of the variables defined by an input dictionary.
     * @param {Object} inputDict 
     */
    getIndependentVariables(inputDict) {
        var independentVariables = [];
        for (var key in inputDict) {
            independentVariables.push(key);
        }
        return independentVariables;
    }

    /**
     * Find the response, if any, that matches the given array of fixed
     * input variables.
     * @param {[string]} independentVariables 
     */
    findMatchingResponse(independentVariables) {
        for (var i in this.responses) {
            var response = this.responses[i];
            if (this.responseMatches(independentVariables, response)) {
                return response;
            }
        }
        return null;
    }

    /**
     * Determine whether the given response is a function of exactly the
     * variables fixed by an input dictionary.
     * @param {[string]} independentVariables 
     * @param {Response} response 
     */
    responseMatches(independentVariables, response) {
        for (var i in independentVariables) {
            if (!response.variables.includes(independentVariables[i])) {
                return false;
            }
        }
        return true;
    }

}