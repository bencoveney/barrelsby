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
    /** The index within the directory if one exists. */
    index?: Location;
}

export const isTypeScriptFile = /\.ts$/m;
export const nonAlphaNumeric = /\W+/g;
export const indentation = "  ";
