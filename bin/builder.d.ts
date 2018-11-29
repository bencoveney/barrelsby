import { Options } from "./options";
import { Directory, Location } from "./utilities";
export declare function buildBarrels(destinations: Directory[], options: Options): void;
export declare type BarrelBuilder = (directory: Directory, modules: Location[], options: Options) => string;
/** Builds the TypeScript */
export declare function buildImportPath(directory: Directory, target: Location, options: Options): string;
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export declare function getBasename(relativePath: string): string;
