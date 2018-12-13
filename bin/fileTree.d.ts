import { Logger } from "./options/logger";
import { Directory } from "./utilities";
/** Build directory information recursively. */
export declare function buildTree(directory: string, barrelName: string, logger: Logger): Directory;
/** Walk an entire directory tree recursively. */
export declare function walkTree(directory: Directory, callback: (directory: Directory) => void): void;
