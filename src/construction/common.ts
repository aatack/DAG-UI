import { Relation } from "./relation";
import { Template } from "../computation/template";
import { Pointer } from "../util/pointer";

export abstract class DyadicRelation extends Relation {

    a: string;
    b: string;
    c: string;

    aPointer: Pointer;
    bPointer: Pointer;
    cPointer: Pointer;

    /**
     * Create a class representing a relation characterised by
     * two values which, if both are known, can be used to find
     * a third.
     */
    constructor(a: string, b: string, c: string) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;

        this.aPointer = Pointer.wrap(this.a);
        this.bPointer = Pointer.wrap(this.b);
        this.cPointer = Pointer.wrap(this.c);
    }

    /**
     * Resolve a sum of two values.
     */
    resolve(knownTypes: any): Template[] {
        var aType = this.aPointer.get(knownTypes);
        var bType = this.bPointer.get(knownTypes);
        var cType = this.cPointer.get(knownTypes);

        if (aType !== undefined && bType !== undefined && cType === undefined) {
            return this.resolveAB(knownTypes, aType, bType);
        } else if (aType !== undefined && bType === undefined && cType !== undefined) {
            return this.resolveAC(knownTypes, aType, cType);
        } else if (aType === undefined && bType !== undefined && cType !== undefined) {
            return this.resolveBC(knownTypes, bType, cType);
        } else {
            return [];
        }
    }

    /**
     * Resolve the type of c given that a and b are known.
     */
    abstract resolveAB(knownTypes: any, aType: any, bType: any): Template[];

    /**
     * Resolve the type of b given that a and c are known.
     */
    abstract resolveAC(knownTypes: any, aType: any, cType: any): Template[];

    /**
     * Resolve the type of a given that b and c are known.
     */
    abstract resolveBC(knownTypes: any, bType: any, cType: any): Template[];

}
