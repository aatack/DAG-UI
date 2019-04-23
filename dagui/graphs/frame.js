class Frame {

    /**
     * Create a DAG frame from an object which defines at least its top,
     * left, height, and width.
     * @param {Object} completedParameters 
     * @param {Object} parent 
     */
    constructor(completedParameters, parent = dag.window) {
        this.parent = parent;

        var wrappedParameters = {};
        for (var key in completedParameters) {
            wrappedParameters[key] = dag.wrap(completedParameters[key]);
        }

        this.build(wrappedParameters);
        this.tieMultiple(dag.graphs.defaultTies);
    }

    /**
     * Create a DAG frame from an object of values describing the aspects of
     * its position.  Valid parameters are top, bottom, left, right, height, and
     * width.  If a number or DAG unit is supplied it will be used directly; if
     * a string value of "parent" is given then it will copy that property of
     * the provided parent element.
     * @param {Object} positionParameters 
     * @param {Object} parent 
     */
    static autocomplete(positionParameters, parent = dag.window) {
        var parsedParameters = Frame.parsePositionParameters(
            positionParameters, parent
        );
        var completedParameters = dag.graphs.div.complete(parsedParameters);
        return new Frame(completedParameters, parent);
    }

    /**
     * Build the frame from a set of parameters describing its position.
     * @param {Object} completedParameters 
     */
    build(completedParameters) {
        var copy = {};
        for (var key in completedParameters) {
            copy[key] = completedParameters[key];
        }

        if (this.parent.top !== undefined) {
            completedParameters.top = dag.add(this.parent.top, completedParameters.top);
        }
        if (this.parent.left !== undefined) {
            completedParameters.left = dag.add(this.parent.left, completedParameters.left);
        }

        copy.element = dag.div(completedParameters, this.parent).element;
        for (var key in copy) {
            this[key] = copy[key];
        }
    }

    /**
     * Parse the position parameters of the frame, removing any empty
     * ones and substituting in those of the parent element where needed.
     * If a function is provided, the function is called with the parent
     * passed as an argument to get the required unit.
     * @param {Object} positionParameters 
     * @param {Object} parent
     */
    static parsePositionParameters(positionParameters, parent) {
        var parsed = {};
        for (var key in positionParameters) {
            parsed[key] = Frame.resolvePositionParameter(
                key, positionParameters, parent
            );
        }
        return parsed;
    }

    static resolvePositionParameter(key, positionParameters, parent) {
        var value = positionParameters[key];
        if (typeof value === "string") {
            if (value === "parent") {
                return parent[key];
            } else {
                return Frame.resolvePositionParameter(
                    value, positionParameters, parent
                );
            }
        } else if (typeof value === "function") {
            return value(parent);
        } else if (value !== undefined && value !== null) {
            return dag.wrap(value);
        }
    }

    /**
     * Set the value of the given parameter of this element to equal a particular
     * value.
     * @param {string} unitName 
     * @param {any} value 
     */
    set(unitName, value) {
        this[unitName].set(value);
    }

    /**
     * Set multiple attribute values.  The dictionary will be iterated, with each
     * key set to the corresponding value.
     * @param {Object} keyValuePairs 
     */
    setMultiple(keyValuePairs) {
        for (var key in keyValuePairs) {
            this.set(key, keyValuePairs[key]);
        }
    }

    /**
     * Decalre that the value of the HTML element's attribute is to be controlled
     * by a unit, creating that unit if necessary.  If no value is given, the unit's
     * value will default to whatever the attribute has at the moment this function
     * is called.  To access style attributes instead of HTML attributes, prepend
     * the attribute string with a forward slash.  Optionally, the unit can be
     * saved within the frame under an alias.
     * @param {string} attribute 
     * @param {any -> {intrinsic: Unit, extrinsic: Unit}} valueFunction
     * @param {string} alias
     */
    tie(attribute, valueFunction = null, alias = null) {
        var style = attribute[0] === "/";
        var attrCopy = style ? attribute.substring(1, attribute.length) : attribute;
        var aliasCopy = alias === null ? attrCopy : alias;
        var originalValue = null;

        if (style) {
            originalValue = this.element.style[attrCopy];
        } else {
            originalValue = this.element.getAttribute(attrCopy);
        }
        var units = this.wrapValueFunction(valueFunction)(originalValue);
        this[aliasCopy] = units.intrinsic;
        units.extrinsic.tie(this.element, attribute);
    }

    /**
     * Create a function for tying a unit to an element attribute.  This function
     * should return an intrinsic value (which is set by the user) and an extrinsic
     * value (a unit whose value is actually used for the attribute).
     * @param {any} f 
     */
    wrapValueFunction(f) {
        if (f === null) {
            return function (x) {
                var u = dag.wrap(x);
                return { intrinsic: u, extrinsic: u };
            }
        } else if (typeof f === "function") {
            return f;
        } else {
            var u = dag.wrap(f);
            return function (_) {
                return { intrinsic: u, extrinsic: u };
            }
        }
    }

    /**
     * Tie the values of multiple attributes to DAG units.
     * @param {[{attribute: string, value?: any, alias?: string}]} ties 
     */
    tieMultiple(ties) {
        for (var i in ties) {
            var tie = ties[i];
            if (tie.value === undefined) tie.value = null;
            if (tie.alias === undefined) tie.alias = null;
            this.tie(tie.attribute, tie.value, tie.alias);
        }
    }

    /**
     * Return a pair of units representing the position of the top left corner
     * of the frame relative to the DAG window.
     */
    globalPosition() {
        var parentPosition = this.parent.globalPosition();
        return {
            x: dag.add(parentPosition.x, this.left),
            y: dag.add(parentPosition.y, this.top)
        }
    }

    /**
     * Create a list of events for a unit that is updated as more are added.
     * @param {string} eventName
     * @param {string} alias 
     */
    setUpEventList(eventName, alias) {
        if (this[alias] === undefined) {
            var frame = this;
            this[alias] = dag.array();
            this[alias].addUpdateCallback(function (u) {
                frame.element[eventName] = function (eventData) {
                    for (var i in u.value) {
                        u.value[i](eventData);
                    }
                }
            });
        }
    }

}

/**
 * A quick function for creating a frame from the generic DAG object.
 */
dag.frame = function (positionParameters, parent = dag.window) {
    return Frame.autocomplete(positionParameters, parent);
}

dag.graphs.defaultTies = [
    {
        attribute: "/background-color",
        alias: "backgroundColour"
    },
    {
        attribute: "/border-radius",
        value: function (_) {
            u = dag.pixel(0);
            return { intrinsic: u, extrinsic: u };
        },
        alias: "cornerRadius"
    }
];

/**
 * Define a graph for a div element such that a div can be created from any
 * combination of its height, width, top, bottom, left, or right coordinates.
 */
dag.graphs.div = new Group(
    ["top", "right", "bottom", "left", "height", "width"]
);
dag.graphs.div.addRelationships([
    {
        graph: dag.graphs.sum,
        mappings: { addend: "top", augend: "height", sum: "bottom" }
    },
    {
        graph: dag.graphs.sum,
        mappings: { addend: "left", augend: "width", sum: "right" }
    },
]);

/**
 * Create an empty div with the given parameters and return an object
 * with each of its properties as well as an HTML element.
 * @param {Object} positionParameters
 * @param {Object} parentElement
 */
dag.div = function (positionParameters, parentElement = dag.window) {
    var output = {};
    ["top", "left", "height", "width"].forEach(function (key) {
        if (positionParameters[key] === undefined || positionParameters[key] === null) {
            throw "position parameter '" + key + "' not defined";
        }
        output[key] = dag.wrap(positionParameters[key]);
    });
    output.element = document.createElement("div");
    output.element.style["position"] = "fixed";
    ["top", "left", "height", "width"].forEach(function (a) {
        output[a].tie(output.element, "/" + a);
        output[a].update();
    });
    parentElement.element.appendChild(output.element);
    return output;
}
