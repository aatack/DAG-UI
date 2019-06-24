type Reference = string | number;

export class Pointer {

    references: Reference[];
    maximumDepth: number;

    /**
     * Construct a pointer to a location within a JSON object.
     */
    constructor(references: Reference[]) {
        if (references.length < 1) {
            throw new Error("pointers must have at least one reference");
        }
        this.references = references;
        this.maximumDepth = references.length;
    }

    /**
     * Produce a pointer from a single string, where each reference is
     * separated by a point.  Strings which can be converted to integers are
     * converted automatically.
     */
    static from(dotReference: string) {
        return new Pointer(dotReference.split(".").map(segment => {
            var asNumeric = parseInt(segment);
            return isNaN(asNumeric) ? segment : asNumeric;
        }));
    }

    /**
     * Index a JSON object at this pointer's location.
     */
    get(json: { [index: string]: any } | any, depth: number = 0): any {
        if (depth > this.maximumDepth) {
            throw new Error("cannot index this deep");
        } else if (depth == this.maximumDepth) {
            return json;
        } else {
            return this.get(json[this.references[depth]], depth + 1);
        }
    }

    /**
     * Index a JSON object at this pointer's location and change the value.
     */
    set(json: { [index: string]: any }, value: any, depth: number = 0): void {
        if (depth >= this.maximumDepth) {
            throw new Error("cannot index this deep");
        } else if (depth == this.maximumDepth - 1) {
            json[this.references[depth]] = value;
        } else {
            this.set(json[this.references[depth]], value, depth + 1);
        }
    }

}