class Value implements Template {

    inputs;
    outputs;

    value: any;

    /**
     * Create a new Value.
     */
    constructor(value: any) {
        this.value = this.cast(value);
        this.inputs = [];
        this.outputs = [];
    }

    /*
    Check the value's type and cast it if necessary.
    */
    cast(value: any): any {
        return value;
    }

    /*
    Put the objects in the template into a JSON object.
    */
    toJson(unwrapValues: boolean): object {
        return unwrapValues ? this : this.value;
    }

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    fromJson(json: object): void {
        this.value = this.cast(json);
    }

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    recalculate(): void { }

}

class Int extends Value {

}

class Float extends Value {

}

class Bool extends Value {

}

class Str extends Value {

}

class List extends Value {

}
