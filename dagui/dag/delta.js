class Delta {
    /**
     * Carries information about a change in a node's value.
     * @param {Node} source 
     * @param {object} data 
     */
    constructor(source, data) {
        this.source = source;
        this.data = data;
    }
}
