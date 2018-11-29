import { Options } from "./options";
import { Directory } from "./utilities";
/** Assess which directories in the tree should contain barrels. */
export declare function getDestinations(rootTree: Directory, options: Options): Directory[];
