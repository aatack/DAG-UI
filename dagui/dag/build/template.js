class BuildTemplate {
    /**
     * Modify the dagui.schema and dagui.template objects according
     * to the declaration of the template described by the given
     * JSON folder.
     * @param {object} json 
     */
    static build(json) {
        dagui.schema[json.templateName] = BuildTemplate.schema(json.data);
        dagui.template[json.templateName] = BuildTemplate.template(json.data);
    }

    /**
     * Return an object representing the schema of the given template.
     * @param {object} jsonData 
     */
    static schema(jsonData) {
        console.error('BuildTemplate.schema not implemented');
    }

    /**
     * Return a function which, given a set of inputs, builds a graph
     * whose structure is described by the JSON object.
     * @param {object} jsonData 
     */
    static template(jsonData) {
        console.error('BuildTemplate.template not implemented');
    }
}
