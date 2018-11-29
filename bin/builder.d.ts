import { Options } from "./options";
import { Directory, Location } from "./utilities";
/**
 * Builds the barrels for the specified directories.
 * @param destinations The directories that will contain the barrels.
 * @param options The options for building barrels.
 */
export declare function buildBarrels(destinations: Directory[], options: Options): void;
export declare type BarrelBuilder = (directory: Directory, modules: Location[], options: Options) => string;
/** Builds the import path from the current directory (or baseUrl) to the target location. */
export declare function buildImportPath(directory: Directory, target: Location, options: Options): string;
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export declare function getBasename(relativePath: string): string;
