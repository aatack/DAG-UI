export namespace Type {

    enum BaseType {
        Int,
        Float,
        Str,
        Bool
    }

    /**
     * Variables describing each base type for convenience.
     */
    export var int = BaseType.Int;
    export var float = BaseType.Float;
    export var str = BaseType.Str;
    export var bool = BaseType.Bool;

    export function checkValue(type: any, value: any): boolean {
        if (isDict(type) && isDict(value)) {
            throw new Error("NYI");
        } else if (isArray(type) && isArray(value)) {
            throw new Error("NYI");
        } else if (
            primitiveTypeEnums.has(type) && primitiveTypes.has(typeof value)
        ) {
            switch (<BaseType>type) {
                case BaseType.Int:
                    return typeof value === "number" && value % 1 === 0;
                case BaseType.Float:
                    return typeof value === "number";
                case BaseType.Str:
                    return typeof value === "string";
                case BaseType.Bool:
                    return typeof value === "boolean";
                default:
                    return false;
            }
        } else {
            return false;
        }
    }

    export function checkType(_supertype: any, _subtype: any): boolean {
        throw new Error("NYI");
    }

    /**
     * Check whether the given value is a string-indexed dictionary.
     */
    function isDict(value: any): boolean {
        return value.constructor == Object;
    }

    /**
     * Check whether the given value is an integer-indexed array.
     */
    function isArray(value: any): boolean {
        return value.constructor == Array;
    }

    var primitiveTypes = new Set(["number", "string", "boolean"]);

    var primitiveTypeEnums = new Set([
        BaseType.Int,
        BaseType.Float,
        BaseType.Str,
        BaseType.Bool
    ]);

}
