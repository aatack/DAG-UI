import { SetFunctions } from "./set";

type Keyed<T> = { [index: string]: Structure<T> };
type Ordered<T> = Structure<T>[];

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
     * Perform an action depending on the type of the structure.
     */
    patternMatch(
        ifKeyed: (keyed: Structure<T>) => void,
        ifOrdered: (ordered: Structure<T>) => void,
        ifUnit: (unit: Structure<T>) => void,
        ifEmpty: (empty: Structure<T>) => void
    ): void {
        if (this.keyed !== null) {
            ifKeyed(this);
        } else if (this.ordered !== null) {
            ifOrdered(this);
        } else if (this.unit !== null) {
            ifUnit(this);
        } else {
            ifEmpty(this);
        }
    }

    /**
     * Return a value calculated based on a function which depends on
     * the type of the structure.
     */
    patternMap<U>(
        ifKeyed: (keyed: Structure<T>) => U,
        ifOrdered: (ordered: Structure<T>) => U,
        ifUnit: (unit: Structure<T>) => U,
        ifEmpty: (empty: Structure<T>) => U
    ): U {
        if (this.keyed !== null) {
            return ifKeyed(this);
        } else if (this.ordered !== null) {
            return ifOrdered(this);
        } else if (this.unit !== null) {
            return ifUnit(this);
        } else {
            return ifEmpty(this);
        }
    }

    /**
     * Determine whether the given index is valid for this structure.
     */
    hasIndex(path: string[]): boolean {
        if (path.length == 0) {
            return true;
        }

        return this.patternMap(
            s => (
                ((<Keyed<T>>s.keyed)[path[0]] !== undefined) &&
                (<Keyed<T>>s.keyed)[path[0]].hasIndex(path.slice(1))
            ),
            s => (
                (<Ordered<T>>s.ordered).length > +path[0] &&
                (<Ordered<T>>s.ordered)[+path[0]].hasIndex(path.slice(1))
            ),
            _ => false,
            _ => false
        );
    }

    /**
     * Index the structure.  This operation will fail if the structure is
     * a unit, or if an index is provided for an ordered structure which cannot
     * be interpreted as an integer.
     */
    getIndex(path: string[]): Structure<T> {
        if (path.length == 0) {
            return this;
        }

        if (!this.hasIndex(path)) {
            return Structure.empty();
        }

        return this.patternMap(
            s => (<Keyed<T>>s.keyed)[path[0]].getIndex(path.slice(1)),
            s => (<Ordered<T>>s.ordered)[+path[0]].getIndex(path.slice(1)),
            _ => Structure.empty(),
            _ => Structure.empty()
        );
    }

    /**
     * Set the value of the structure at the given index.  If the index does
     * not exist and it is possible to create the index, that will be done.
     */
    setIndex(path: string[], value: Structure<T>): void {
        if (path.length == 0) {
            this.keyed = value.keyed;
            this.ordered = value.ordered;
            this.unit = value.unit;
            return;
        }

        var head = path[0];
        var tail = path.slice(1);

        var overrideUnit = function (unit: Structure<T>) {
            var isNumeric = !isNaN(Number(head));
            if (isNumeric) {
                unit.ordered = [];
            } else {
                unit.keyed = {};
            }
            // Call again without only using the tail to get the correct
            // pattern match this time
            unit.setIndex(path, value);
        }

        this.patternMatch(
            s => {
                var keyed = <Keyed<T>>s.keyed;
                if (keyed[head] === undefined) {
                    keyed[head] = Structure.empty();
                }
                keyed[head].setIndex(tail, value)
            },
            s => {
                var ordered = <Ordered<T>>s.ordered;
                var i = Number(head)
                while (ordered.length <= i) {
                    ordered.push(Structure.empty());
                }
                ordered[i].setIndex(tail, value);
            },
            s => {
                s.unit = null;
                overrideUnit(s);
            },
            s => overrideUnit(s)
        );
    }

    /**
     * Map each root value through a transfer function.
     */
    map<U>(f: (input: T) => U): Structure<U> {
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
     * Zip two structures together, assuming they have the same layout.  Two empty
     * structures, when zipped, combine into a single empty structure.
     */
    static zip<A, B>(first: Structure<A>, second: Structure<B>): Structure<[A, B]> {
        if (first.structureType() != second.structureType()) {
            throw new Error("cannot zip structures with different layouts");
        }

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
            return Structure.empty();
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
        if (sum > 1) {
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

        if (value === null || value === undefined) {
            return Structure.empty();
        } else if (value.constructor == Object) {
            var wrapped: Keyed<T> = {};
            for (let key in value) {
                wrapped[key] = Structure.wrap<T>(value[key]);
            }
            return new Structure(wrapped, null, null);
        } else if (value.constructor == Array) {
            var asArray = <any[]>value;
            return new Structure(null, asArray.map(
                x => Structure.wrap<T>(x)
            ), null);
        } else {
            return new Structure(null, null, <T>value);
        }
    }

    /**
     * Create an empty structure.
     */
    static empty<T>(): Structure<T> {
        return new Structure<T>(null, null, null);
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

    /**
     * Return the type of the structure in a legible format.
     */
    structureType(): string {
        return this.patternMap(
            _ => "keyed", _ => "ordered", _ => "unit", _ => "empty"
        );
    }

}
