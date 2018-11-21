/** A location in the file tree. */
export interface Location {
    /** The full path of the location including the name. */
    path: string;
    /** The local name of the location. */
    name: string;
}
/** A directory in the file tree. */
export interface Directory extends Location {
    /** The directories within the directory. */
    directories: Directory[];
    /** The files within the directory. */
    files: Location[];
    /** The barrel within the directory if one exists. */
    barrel?: Location;
}
/** Convert path separator from windows to unix */
export declare function convertPathSeparator(path: string): string;
export declare const isTypeScriptFile: RegExp;
export declare const nonAlphaNumeric: RegExp;
export declare const thisDirectory: RegExp;
export declare const indentation = "  ";
