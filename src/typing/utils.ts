import { Kind, Kinds } from "./kind";
import { Pointer } from "../util/pointer";
import { Structure } from "../util/structure";

export namespace KindUtils {

    /**
     * Display the kind structure in a human-legible format.
     */
    export function print(kinds: Structure<Kind>): void {
        console.log(kinds.map(k => k.display()).unwrap());
    }

    /**
     * Get a kind from a structure of kinds.  If the given kind does not exist,
     * return the unknown kind.
     */
    export function getKindOrUnknown(kinds: Structure<Kind>, pointer: Pointer): Kind {
        return pointer.isDefined(kinds) ? pointer.get(kinds) : Kinds.unknown;
    }

    /**
     * Dereference a pointer and set its value within a kinds dictionary.
     * Specifically, if the value to which to set the kind is unknown while the
     * value currently in the structure is not unknown, it will not be overridden.
     * If the pointer is not currently contained in the structure, it will be created.
     */
    export function setKindIfNotUnknown(
        kinds: Structure<Kind>, pointer: Pointer, value: Kind
    ): void {
        if (!pointer.isDefined(kinds)) {
            pointer.set(kinds, Kinds.unknown);
        }
        var currentKind = getKindOrUnknown(kinds, pointer);
        if (currentKind.containsKind(value)) {
            pointer.set(kinds, value);
        }
    }

}
