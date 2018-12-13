import { Directory } from "../fileTree/directory";
import { Logger } from "../options/logger";
import { LocationOption } from "../options/options";
/** Assess which directories in the tree should contain barrels. */
export declare function getDestinations(rootTree: Directory, locationOption: LocationOption, barrelName: string, logger: Logger): Directory[];
