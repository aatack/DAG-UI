abstract class Kind {

    /**
     * Determine whether the given value is a member of this kind.
     */
    abstract containsValue(value: any): boolean;

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    abstract containsKind(kind: Kind): boolean;

}

class Int extends Kind {

    /**
     * Determine whether the given value is a member of this kind.
     */
    containsValue(value: any): boolean {
        return typeof value == "number" && value % 1 == 0;
    }

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    containsKind(kind: any): boolean {
        return kind instanceof Int;
    }

}

class Float extends Kind {

    /**
     * Determine whether the given value is a member of this kind.
     */
    containsValue(value: any): boolean {
        return typeof value == "number";
    }

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    containsKind(kind: any): boolean {
        return kind instanceof Int || kind instanceof Float;
    }

}

class Str extends Kind {

    /**
     * Determine whether the given value is a member of this kind.
     */
    containsValue(value: any): boolean {
        return typeof value == "string";
    }

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    containsKind(kind: any): boolean {
        return kind instanceof Str;
    }

}

class Bool extends Kind {

    /**
     * Determine whether the given value is a member of this kind.
     */
    containsValue(value: any): boolean {
        return typeof value == "boolean";
    }

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    containsKind(kind: any): boolean {
        return kind instanceof Bool;
    }

}

export namespace Kinds {

    export var int = new Int();
    export var float = new Float();
    export var str = new Str();
    export var bool = new Bool();

    /**
     * Determine the kind of a value.
     */
    export function getKind(value: any): Kind {
        throw new Error("NYI");
    }
}
