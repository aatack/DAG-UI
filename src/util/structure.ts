import { SetFunctions } from "./set";

export class Structure<T> {

    keyed: { [index: string]: Structure<T> } | null = null;
    ordered: Structure<T>[] | null = null;
    unit: T | null = null;

    /**
     * Create a type-strict variant of a JavaScript object.
     */
    private constructor(
        keyed: { [index: string]: Structure<T> } | null,
        ordered: Structure<T>[] | null,
        unit: T | null
    ) {
        this.keyed = keyed;
        this.ordered = ordered;
        this.unit = unit;
        this.check();
    }

    /**
     * Map each root value through a transfer function.
     */
    map<T, U>(f: (input: T) => U): Structure<U> {
        if (this.keyed !== null) {
            var newInner: { [index: string]: Structure<U> } = {};
            for (let key in this.keyed) {
                newInner[key] = this.keyed[key].map(f);
            }
            return new Structure(newInner, null, null);
        } else if (this.ordered !== null) {
            return new Structure(null, this.ordered.map(x => x.map(f)), null);
        } else {
            var value = <T><any>this.unit;
            return new Structure<U>(null, null, f(value));
        }
    }

    /**
     * Call a function for each root item in the structure.
     */
    forEach(f: (input: T) => void): void {
        if (this.keyed !== null) {
            for (let key in this.keyed) {
                this.keyed[key].forEach(f);
            }
        } else if (this.ordered !== null) {
            this.ordered.forEach(i => i.forEach(f));
        } else {
            f(<T>this.unit);
        }
    }

    /**
     * Zip two structures together, assuming they have the same layout.
     */
    static zip<A, B>(first: Structure<A>, second: Structure<B>): Structure<[A, B]> {
        if (first.keyed !== null && second.keyed !== null) {
            var o: { [index: string]: Structure<[A, B]> } = {};
            for (let key in first.keyed) {
                o[key] = Structure.zip(first.keyed[key], second.keyed[key])
            }
            return new Structure<[A, B]>(o, null, null);
        } else if (first.ordered !== null && second.ordered !== null) {
            var a: Structure<[A, B]>[] = [];
            for (var i = 0; i < first.ordered.length; i++) {
                a.push(Structure.zip(first.ordered[i], second.ordered[i]));
            }
            return new Structure<[A, B]>(null, a, null);
        } else if (first.unit !== null && second.unit !== null) {
            return new Structure<[A, B]>(null, null, [first.unit, second.unit]);
        } else {
            throw new Error("cannot zip structures with different layouts");
        }
    }

    /**
     * Check that the structure has only one type defined.
     */
    private check(): void {
        var areDefined = [
            this.keyed === null ? 0 : 1,
            this.ordered === null ? 0 : 1,
            this.unit === null ? 0 : 1
        ];
        var sum = 0;
        areDefined.forEach(i => sum += i);
        if (sum != 1) {
            throw new Error("structure must specify exactly one value");
        }
    }

    /**
     * Attempt to wrap a value in a structure.
     */
    static wrap<T>(value: any): Structure<T> {
        if (value instanceof Structure) {
            return value;
        }

        if (value.constructor == Object) {
            var asObject = <{ [index: string]: any }>value;
            var wrapped: { [index: string]: Structure<T> } = {};
            for (let key in asObject) {
                wrapped[key] = Structure.wrap<T>(asObject[key]);
            }
            return new Structure(wrapped, null, null);
        } else if (value.constructor == Array) {
            var asArray = <any[]>value;
            return new Structure(null, asArray.map(x => Structure.wrap<T>(x)), null);
        } else {
            return new Structure(null, null, <T>value);
        }
    }

    /**
     * Unwrap the structure into a dictionary, array, or value.
     */
    unwrap(): any {
        if (this.keyed !== null) {
            var result: { [index: string]: any } = {};
            for (let key in this.keyed) {
                result[key] = this.keyed[key].unwrap();
            }
            return result;
        } else if (this.ordered !== null) {
            return this.ordered.map(x => x.unwrap());
        } else {
            return this.unit;
        }
    }

    /**
     * Copy the structure.
     */
    copy(): Structure<T> {
        if (this.keyed !== null) {
            var inner: { [index: string]: Structure<T> } = {};
            for (let key in this.keyed) {
                inner[key] = this.keyed[key].copy();
            }
            return new Structure(inner, null, null);
        } else if (this.ordered !== null) {
            return new Structure(null, this.ordered.map(s => s.copy()), null);
        } else {
            return new Structure(null, null, this.unit);
        }
    }

    /**
     * Get a set of all unique units in the structure.
     */
    unique(): Set<T> {
        if (this.keyed !== null) {
            var result = new Set<T>();
            for (let key in this.keyed) {
                result = SetFunctions.union(result, this.keyed[key].unique());
            }
            return result;
        } else if (this.ordered !== null) {
            var result = new Set<T>();
            this.ordered.forEach(s => {
                result = SetFunctions.union(result, s.unique())
            });
            return result;
        } else {
            return new Set([<T>this.unit]);
        }
    }

}
