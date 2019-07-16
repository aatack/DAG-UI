import { Constraint } from "./constraint";
import { BasicConstraint } from "./basic";
import { Maths as MathsTemplates } from "../computation/common";

export namespace Maths {

    /**
     * Constrain the sum of two numbers to be equal to a particular value.
     */
    export function sum(addend: string, augend: string, sum: string): Constraint {
        return new BasicConstraint([
            MathsTemplates.sum(addend, augend, sum),
            MathsTemplates.difference(sum, addend, augend),
            MathsTemplates.difference(sum, augend, addend)
        ]);
    }

    /**
     * Constrain the difference of two numbers to be equal to a particular value.
     */
    export function difference(
        minuend: string, subtrahend: string, difference: string
    ): Constraint {
        return sum(difference, subtrahend, minuend);
    }

    /**
     * Constrain the product of two numbers to be equal to a particular value.
     */
    export function product(
        multiplicand: string, multiplier: string, product: string
    ): Constraint {
        return new BasicConstraint([
            MathsTemplates.product(multiplicand, multiplier, product),
            MathsTemplates.ratio(product, multiplicand, multiplier),
            MathsTemplates.ratio(product, multiplier, multiplicand)
        ]);
    }

    /**
     * Constrain the ratio of two numbers to be equal to a particular value.
     */
    export function ratio(
        dividend: string, divisor: string, quotient: string
    ): Constraint {
        return product(quotient, divisor, dividend);
    }

}
