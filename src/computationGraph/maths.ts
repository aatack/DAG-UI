class DyadicFunction implements Template {

    inputs;
    outputs;

    /**
     * Construct a dyadic function, which takes two arguments and
     * produces a single output.
     */
    constructor(firstInput: Value, secondInput: Value) {
        var [firstInputName, secondInputName] = this.getInputNames();
        this.inputs = [
            [firstInputName, firstInput], [secondInputName, secondInput]
        ];
        this.outputs = [[this.getOutputName(), new Value(undefined)]];
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        throw new Error("getOutputValue not implemented");
    }

    /**
     * Return the names of the inputs to the function.
     */
    getInputNames(): [string, string] {
        return ["input0", "input1"];
    }

    /**
     * Return the name of the function's output.
     */
    getOutputName(): string {
        return "output";
    }

    /*
    Put the objects in the template into a JSON object.
    */
    toJson(unwrapValues: boolean): object {
        var output = {};
        for (var i = 0; i < this.inputs.length(); i++) {
            output[this.inputs[i][0]] = this.inputs[i][1].toJson(unwrapValues);
        }
        output[this.outputs[0][0]] = this.outputs[0][1].toJson(unwrapValues);
        return output;
    }

    /*
    Overwrite the current sub-template values using those from a
    JSON object.
    */
    fromJson(json: object): void {

    }

    /*
    Calculate the values of all outputs in-place from the inputs.
    */
    recalculate(): void {
        this.outputs[0][1].set(this.getOutputValue(
            this.inputs[0][1].get(), this.inputs[1][1].get()
        ));
    }

}


class Sum extends DyadicFunction {

}

class Difference extends DyadicFunction {

}

class Product extends DyadicFunction {

}

class Ratio extends DyadicFunction {

}

class Square extends Value {

}
