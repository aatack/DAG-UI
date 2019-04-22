class Unit {

    /**
     * Create a new unit, giving a list of those units from which it takes inputs.
     * @param {Object} inputs
     * @param {boolean} recalculateImmediately
     */
    constructor(inputs, recalculateImmediately = true) {
        this.inputs = {};
        for (var key in inputs) {
            this.inputs[key] = dag.wrap(inputs[key]);
            this.inputs[key].addDependent(this);
        }
        this.dependents = [];
        this.active = true;
        this.updateCallbacks = [];

        this.value = null;
        if (recalculateImmediately) this.recalculateValue();
    }

    /**
     * Recalculate the value of the node, assuming at least one of its input
     * units has had its value change.
     */
    recalculateValue() {
        throw "Unit.recalculateValue not implemented";
    }

    /**
     * Register that another unit depends on this one.
     * @param {Unit} dependent 
     */
    addDependent(dependent) {
        this.dependents.push(dependent);
    }

    /**
     * Update the value of the unit, calling its update callbacks if it is active.
     */
    update() {
        if (this.active) {
            this.recalculateValue();
            for (var i in this.updateCallbacks) {
                this.updateCallbacks[i](this);
            }
            for (var i in this.dependents) {
                this.dependents[i].update();
            }
        }
    }

    /**
     * Deactivate the unit, so its values will not be activated automatically.
     */
    deactivate() {
        this.active = false;
    }

    /**
     * Activate the unit, denoting that its value should be updated instantly
     * in the future.
     */
    activate() {
        this.active = true;
        this.update();
    }

    /**
     * Add a callback, as a function of the updated node, to be performed
     * whenever its value is updated.
     * @param {Unit -> ()} f 
     */
    addUpdateCallback(f) {
        this.updateCallbacks.push(f);
    }

    /**
     * Tie the unit to an attribute or style of the element, causing that attribute
     * to be set to the unit's value every time it is updated.  Use the name of
     * the attribute or, to set the style, prepend "/" to the style name.
     * @param {HTMLElement} element 
     * @param {string} attribute 
     */
    tie(element, attribute) {
        var style = attribute[0] === "/";
        if (style) {
            this.addUpdateCallback(function (u) {
                element.style[attribute.substr(1, attribute.length)] = u.value;
            });
        } else {
            this.addUpdateCallback(function (u) {
                element.setAttribute(attribute, u.value);
            });
        }
    }

}
