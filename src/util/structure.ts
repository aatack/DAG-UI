class Structure<T> {

    keyed: { [index: string]: T } | null = null;
    ordered: T[] | null = null;
    unit: T | null = null;

    /**
     * Create a type-strict variant of a JavaScript object.
     */
    constructor(
        keyed: { [index: string]: T } | null, ordered: T[] | null, unit: T | null
    ) {
        this.keyed = keyed;
        this.ordered = ordered;
        this.unit = unit;
        this.check();
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

}