import { Directory } from "../fileTree/directory";
import { Logger } from "../options/logger";
/** Build directory information recursively. */
export declare function buildTree(directory: string, barrelName: string, logger: Logger): Directory;
