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
     * @param {array} jsonData 
     */
    static schema(jsonData) {
        // TODO: break into smaller functions
        if (jsonData instanceof Array) {
            var output = {};
            for (var i = 0; i < jsonData.length; i++) {
                var data = jsonData[i];
                switch (data.type) {
                    case "templateApplication":
                        if (data.arity == 1 && data.argument0 instanceof Object) {
                            var subschema = BuildTemplate.schema(
                                data.argument0);
                            if (subschema !== null) {
                                output[data.variableName] = subschema;
                            }
                        }
                        break;
                    case "region":
                        var subschema = BuildTemplate.schema(data.regionValues);
                        if (subschema !== null) {
                            output[data.regionName] = subschema;
                        }
                        break;
                    case "inputDeclaration":
                        if (dagui.schema[data.inputType] === undefined) {
                            output[data.inputName] = data.inputType;
                        } else {
                            output[data.inputName] = dagui.schema[data.inputType];
                        }
                        break;
                    default:
                        console.error("Unknown data type.");
                        break;
                }
            }
            return countObjectFields(output) > 0 ? output : null;
        }
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
