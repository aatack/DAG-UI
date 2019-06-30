export class Pointer {

    private static lookup: { [index: string]: Pointer } = {};

    references: string[];
    maximumDepth: number;
    hash: string = "";

    /**
     * Construct a pointer to a location within a JSON object.
     */
    constructor(references: string[]) {
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

        var path = <string><any>input;
        var lookup = Pointer.lookup[path];
        return lookup !== undefined ? lookup : new Pointer(path.split("."));
    }

    /**
     * Index a JSON object at this pointer's location.
     */
    get(source: any): any {
        return referenceObject(source, this.references);
    }

    /**
     * Index a JSON object at this pointer's location and change the value.
     */
    set(target: any, value: any): void {
        alterObject(target, this.references, value);
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

/**
 * Retrieve a value from a JSON-like object indexed by a path.
 */
function referenceObject(source: any, path: string[]): any {
    if (path.length == 0 || source === undefined) {
        return source;
    } else {
        return referenceObject(source[path[0]], path.slice(1));
    }
}

/**
 * Set the value of a JSON-like object at a particular location.
 */
function alterObject(target: any, path: string[], value: any): void {
    if (target === undefined) {
        throw new Error("cannot alter an undefined object");
    }
    var nextTarget = target[path[0]];
    if (nextTarget === undefined) {
        target[path[0]] = {};
    }
    if (path.length == 1) {
        target[path[0]] = value;
    } else {
        alterObject(target[path[0]], path.slice(1), value);
    }
}
