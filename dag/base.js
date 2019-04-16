class Int extends Unit {

    /**
     * Create a new Int unit.
     * @param {int} value 
     */
    constructor(value = null) {
        super({}, value = value);
        this.currentChange = null;
    }

    /**
     * Queue an update to the Unit but do not apply it.
     * @param {object} delta 
     */
    queue(delta) {
        super.queue(delta);
        var castDelta = delta.castTo([
            "changed",
            "unchanged"
        ]);
        switch (castDelta.type) {
            case "changed":
                this.currentChange = castDelta;
                break;
            case "unchanged":
                break;
            default:
                throw "unexpected delta type";
        }
    }

    /**
     * Apply all queued updates to the Unit's value.  Return a delta describing
     * any changes that took place.
     */
    apply() {
        if (this.currentChange === null) {
            Delta.unchanged(this);
        } else {
            this.value = this.currentChange.value;
        }
    }

}