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

/**
 * Convert path separator from windows to unix.
 * @param path The path to convert.
 * @returns The converted path.
 */
export function convertPathSeparator(path: string): string {
    return path.replace(/\\+/g, "/");
}

/** Determines whether the path is to a TypeScript module. */
export const isTypeScriptFile = /\.tsx?$/m;

/** Determines whether the value is non-alphanumeric. */
export const nonAlphaNumeric = /\W+/g;

/** Determines whether a path points to "this" directory. */
export const thisDirectory = /^\.[\\\/]/g;

/** The default indentation. */
export const indentation = "  ";
