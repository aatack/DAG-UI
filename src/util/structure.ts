type Keyed<T> = { [index: string]: Structure<T> };
type Ordered<T> = Structure<T>[];

export class Structure<T> {

    private keyed: { [index: string]: Structure<T> } | null = null;
    private ordered: Structure<T>[] | null = null;
    private unit: T | null = null;

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
        return this.patternMap(
            s => {
                var result: Keyed<U> = {};
                var values = <Keyed<T>>s.keyed;
                for (let key in values) {
                    result[key] = values[key].map(f);
                }
                return Structure.wrap(result);
            },
            s => Structure.wrap((<Ordered<T>>s.ordered).map(i => i.map(f))),
            s => Structure.wrap(f(<T>s.unit)),
            _ => Structure.empty()
        );
    }

    /**
     * Call a function for each root item in the structure.
     */
    forEach(f: (input: T) => void): void {
        this.patternMatch(
            s => {
                var values = <Keyed<T>>s.keyed;
                for (let key in values) {
                    values[key].forEach(f);
                }
            },
            s => (<Ordered<T>>s.ordered).forEach(i => i.forEach(f)),
            s => f(<T>s.unit),
            _ => { }
        );
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
        return this.patternMap<any>(
            s => {
                var result: { [index: string]: any } = {};
                var values = <Keyed<T>>s.keyed;
                for (let key in values) {
                    result[key] = values[key].unwrap();
                }
                return result;
            },
            s => (<Ordered<T>>s.ordered).map(i => i.unwrap()),
            s => <T>s.unit,
            _ => null
        );
    }

    /**
     * Copy the structure.
     */
    copy(): Structure<T> {
        return this.map(i => i);
    }

    /**
     * Copy the structure's values from another, maintaining the top-level
     * object (and hence any references to it).
     */
    copyFrom(other: Structure<T>): void {
        this.patternMatch(
            _ => this.keyed = null,
            _ => this.ordered = null,
            _ => this.unit = null,
            _ => { }
        );

        other.patternMatch(
            _ => {
                this.keyed = {};
                var values = <Keyed<T>>other.keyed;
                for (let key in values) {
                    this.keyed[key] = values[key].copy();
                }
            },
            _ => this.ordered = (<Ordered<T>>other.ordered).map(i => i.copy()),
            _ => this.unit = other.unit,
            _ => { }
        );
    }

    /**
     * Get a set of all unique units in the structure.
     */
    unique(): Set<T> {
        var output = new Set<T>();
        this.forEach(i => output.add(i));
        return output;
    }

    /**
     * Return the type of the structure in a legible format.
     */
    structureType(): string {
        return this.patternMap(
            _ => "keyed", _ => "ordered", _ => "unit", _ => "empty"
        );
    }

    /**
     * Filter a structure's units based on a predicate, maintaining the
     * layout of the structure where possible.
     */
    filter(p: (item: T) => boolean): Structure<T> {
        return this.patternMap(
            s => {
                var values = <Keyed<T>>s.keyed;
                var results: Keyed<T> = {};
                var positiveResults: number = 0;

                for (let key in values) {
                    var inner = values[key].filter(p);
                    if (inner.structureType() !== "empty") {
                        positiveResults++;
                        results[key] = inner;
                    }
                }

                return positiveResults > 0 ? Structure.wrap(results) : Structure.empty();
            },
            s => {
                var inners = (<Ordered<T>>s.ordered).map(i => i.filter(p));
                var results: Ordered<T> = [];
                for (var i = 0; i < inners.length; i++) {
                    if (inners[i].structureType() !== "empty") {
                        results.push(inners[i]);
                    }
                }
                return results.length > 0 ? Structure.wrap(results) : Structure.empty();
            },
            s => p(<T>s.unit) ? s.copy() : Structure.empty(),
            _ => Structure.empty()
        );
    }

    /**
     * Count the number of unit elements in the structure.
     */
    count(): number {
        var i = 0;
        this.forEach(_ => i++);
        return i;
    }

    /**
     * Extract the keyed portion of the structure, throwing an error if it is
     * not a keyed structure.
     */
    extractKeyed(): Keyed<T> {
        if (this.keyed === null) {
            throw new Error("structure is not a keyed structure");
        }
        return <Keyed<T>>this.keyed;
    }

    /**
     * Extract the ordered portion of the structure, throwing an error if it
     * is not an ordered structure.
     */
    extractOrdered(): Ordered<T> {
        if (this.ordered === null) {
            throw new Error("structure is not an ordered structure");
        }
        return <Ordered<T>>this.ordered;
    }

    /**
     * Extract the unit portion of the structure, throwing an error if it
     * is not a unit structure.
     */
    extractUnit(): T {
        if (this.unit === null) {
            throw new Error("structure is not a unit structure");
        }
        return <T>this.unit;
    }

}
