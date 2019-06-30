type Reference = string | number;

export class Pointer {

    private static lookup: { [index: string]: Pointer } = {};

    references: Reference[];
    maximumDepth: number;
    hash: string = "";

    /**
     * Construct a pointer to a location within a JSON object.
     */
    constructor(references: Reference[]) {
        if (references.length < 1) {
            throw new Error("pointers must have at least one reference");
        }
        this.references = references;
        this.maximumDepth = references.length;

        Pointer.lookup[this.getHash()] = this;
    }

    /**
     * Produce a pointer from a single string, where each reference is
     * separated by a point.  Strings which can be converted to integers are
     * converted automatically.
     */
    static wrap(input: string | Pointer) {
        if (input instanceof Pointer) {
            return input;
        }

        var lookup = Pointer.lookup[input];
        if (lookup !== undefined) {
            return lookup;
        }

        var references = <string><any>input;
        return new Pointer(references.split(".").map(segment => {
            var asNumeric = parseInt(segment);
            return isNaN(asNumeric) ? segment : asNumeric;
        }));
    }

    /**
     * Index a JSON object at this pointer's location.
     */
    get(json: { [index: string]: any } | any, depth: number = 0): any {
        if (depth == this.maximumDepth) {
            return json;
        }
        var reference = this.references[depth];
        if (typeof reference === "string") {
            var value = json[reference];
            return value === undefined ?
                undefined : this.get(value, depth + 1);
        } else {
            return json.length <= reference ?
                undefined : this.get(json[reference], depth + 1);
        }
    }

    /**
     * Index a JSON object at this pointer's location and change the value.
     */
    set(json: { [index: string]: any }, value: any, depth: number = 0): void {
        var reference = this.references[depth];
        if (depth == this.maximumDepth - 1) {
            json[reference] = value;
        } else {
            var nextReferenceType = typeof this.references[depth + 1];
            if (typeof reference === "string") {
                if (json[reference] === undefined) {
                    json[reference] = nextReferenceType === "string" ?
                        {} : [];
                }
                this.set(json[reference], value, depth + 1);
            } else {
                if (json.length <= reference) {
                    while (json.length <= reference) {
                        json.push(undefined);
                    }
                    json[reference] = nextReferenceType === "string" ?
                        {} : [];
                }
                this.set(json[reference], value, depth + 1);
            }
        }
    }

    /**
     * Return a unique hash of the pointer.
     */
    getHash(): string {
        if (this.hash.length == 0) {
            this.hash = this.references.join(".");
        }
        return this.hash;
    }

}
