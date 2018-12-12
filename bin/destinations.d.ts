import { Logger } from "./options/logger";
import { Options } from "./options/options";
import { Directory } from "./utilities";
/** Assess which directories in the tree should contain barrels. */
export declare function getDestinations(rootTree: Directory, options: Options, barrelName: string, logger: Logger): Directory[];
