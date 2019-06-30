export class SetFunctions {

    /**
     * Find the set of objects which are contained in at least
     * one of the input sets.
     */
    static union<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set<T>();
        a.forEach(c.add);
        b.forEach(c.add);
        return c;
    }

    /**
     * Find the set of objects which are contained in both of
     * the two input sets.
     */
    static intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set<T>();
        a.forEach(o => { if (b.has(o)) { c.add(o) } });
        return c;
    }

    /**
     * Find the set of objects which are in the first input set
     * but not the second input set.
     */
    static difference<T>(a: Set<T>, b: Set<T>): Set<T> {
        var c = new Set(a);
        b.forEach(c.delete);
        return c;
    }

}
