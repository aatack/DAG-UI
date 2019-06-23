type Reference = string | number;

export class Pointer {

    references: Reference[];

    /**
     * Construct a pointer to a location within a JSON object.
     */
    constructor(references: Reference[]) {
        if (references.length < 1) {
            throw new Error("pointers must have at least one reference");
        }
        this.references = references;
    }

    /**
     * Produce a pointer from a single string, where each reference is
     * separated by a point.  Strings which can be converted to integers are
     * converted automatically.
     */
    static from(dotReference: string) {
        return new Pointer(dotReference.split(".").map(segment => {
            var asNumeric = parseInt(segment);
            return isNaN(asNumeric) ? asNumeric : segment;
        }));
    }

}