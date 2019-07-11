import { Structure } from "./structure";

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
        } else if (typeof input == "string") {
            var path = <string><any>input;
            var lookup = Pointer.lookup[path];
            return lookup !== undefined ? lookup : new Pointer(path.split("."));
        } else {
            throw new Error("object to wrap must be string or pointer");
        }
    }

    /**
     * Index a JSON object at this pointer's location.
     */
    get<T>(source: Structure<T>): any {
        return source.getIndex(this.references).unwrap();
    }

    /**
     * Index a JSON object at this pointer's location and change the value.
     */
    set<T>(target: Structure<T>, value: T): void {
        target.setIndex(this.references, Structure.wrap(value));
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
