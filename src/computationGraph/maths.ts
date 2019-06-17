abstract class DyadicFunction extends Template {

    inputs;
    outputs;

    firstInput: Template;
    secondInput: Template;
    output: Template;

    firstInputName: string;
    secondInputName: string;
    outputName: string;

    /**
     * Construct a dyadic function, which takes two arguments and
     * produces a single output.
     */
    constructor(firstInput: Value, secondInput: Value) {
        super();
        [
            this.firstInputName,
            this.secondInputName,
            this.outputName
        ] = this.getNodeNames();
        this.inputs = [
            [this.firstInputName, firstInput],
            [this.secondInputName, secondInput]
        ];
        this.outputs = [[this.outputName, new Value(undefined)]];
    }

    /**
     * Calculate the value of the output given the two inputs.
     */
    abstract getOutputValue(firstInput: any, secondInput: any): any;

    /**
     * Return the names of the inputs to the function.
     */
    getNodeNames(): [string, string, string] {
        return ["input0", "input1", "output"];
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

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput + secondInput;
    }

}

class Difference extends DyadicFunction {

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput - secondInput;
    }

}

class Product extends DyadicFunction {

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput * secondInput;
    }

}

class Ratio extends DyadicFunction {

    /**
     * Calculate the value of the output given the two inputs.
     */
    getOutputValue(firstInput: any, secondInput: any): any {
        return firstInput / secondInput;
    }

}

class Square extends Value {

}
