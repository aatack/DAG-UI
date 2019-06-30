export namespace SetFunctions {

    /**
     * Find the set of objects which are contained in at least
     * one of the input sets.
     */
    export function union<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set<T>();
        a.forEach(o => c.add(o));
        b.forEach(o => c.add(o));
        return c;
    }

    /**
     * Find the set of objects which are contained in both of
     * the two input sets.
     */
    export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set<T>();
        a.forEach(o => { if (b.has(o)) { c.add(o) } });
        return c;
    }

    /**
     * Find the set of objects which are in the first input set
     * but not the second input set.
     */
    export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set(a);
        b.forEach(c.delete);
        return c;
    }

}
