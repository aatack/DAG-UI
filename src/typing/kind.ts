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

    /**
     * Return a string representation of the kind.
     */
    abstract display(): any;

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

    /**
     * Return a string representation of the kind.
     */
    display(): any {
        return "int";
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

    /**
     * Return a string representation of the kind.
     */
    display(): any {
        return "float";
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

    /**
     * Return a string representation of the kind.
     */
    display(): any {
        return "str";
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

    /**
     * Return a string representation of the kind.
     */
    display(): any {
        return "bool";
    }

}

class Keyed extends Kind {

    subKinds: { [index: string]: Kind };

    /**
     * Create a kind which consists of an object whose keys each have
     * a kind of their own.
     */
    constructor(subKinds: { [index: string]: Kind }) {
        super();
        this.subKinds = subKinds;
    }

    /**
     * Determine whether the given value is a member of this kind.
     */
    containsValue(value: any): boolean {
        if (value.constructor != Object) {
            return false;
        }

        for (let key in this.subKinds) {
            if (value[key] === undefined) {
                return false;
            } else {
                if (!this.subKinds[key].containsValue(value[key])) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Determine whether any member of the given kind is necessarily
     * a member of this kind.
     */
    containsKind(kind: any): boolean {
        if (!(kind instanceof Keyed)) {
            return false;
        }

        var other = <Keyed>kind;

        for (let key in this.subKinds) {
            if (other.subKinds[key] === undefined) {
                return false;
            } else {
                if (!this.subKinds[key].containsKind(other.subKinds[key])) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Determine the kind of a value, which is assumed to be derived
     * from the Object constructor, in a keyed kind.
     */
    static getKind(value: { [index: string]: any }): Keyed {
        var subKinds: { [index: string]: Kind } = {};
        for (let key in value) {
            subKinds[key] = Kinds.getKind(value[key]);
        }
        return new Keyed(subKinds);
    }

    /**
     * Return a string representation of the kind.
     */
    display(): any {
        var output: { [index: string]: any } = {};
        for (let key in this.subKinds) {
            output[key] = this.subKinds[key].display();
        }
        return output;
    }

}

export namespace Kinds {

    export var int = new Int();
    export var float = new Float();
    export var str = new Str();
    export var bool = new Bool();
    export var elementaries = [int, float, str, bool];

    /**
     * Determine the kind of a value which is assumed to be neither
     * an object nor an array.
     */
    function getElementaryKind(value: any): Kind {
        for (var i = 0; i < elementaries.length; i++) {
            if (elementaries[i].containsValue(value)) {
                return elementaries[i];
            }
        }
        throw new Error("cannot determine type of value " + value);
    }

    /**
     * Determine the kind of a value.
     */
    export function getKind(value: any): Kind {
        if (value.constructor == Object) {
            return Keyed.getKind(value);
        } else if (value.constructor == Array) {
            throw new Error("NYI");
        } else {
            return getElementaryKind(value);
        }
    }
}
