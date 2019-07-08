class Structure<T> {

    keyed: { [index: string]: Structure<T> } | null = null;
    ordered: Structure<T>[] | null = null;
    unit: T | null = null;

    /**
     * Create a type-strict variant of a JavaScript object.
     */
    constructor(
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
    static wrap<T>(value: any) {
        if (value.constructor == Object) {
            var asObject = <{ [index: string]: any }>value;
            return new Structure(value, null, null);
        } else if (value.constructor == Array) {
            var asArray = <any[]>value;
            return new Structure(null, value, null);
        } else {
            return new Structure(null, null, <T>value);
        }
    }

}