import { Options } from "./options";
import { Directory } from "./utilities";
/** Build directory information recursively. */
export declare function buildTree(directory: string, options: Options): Directory;
/** Walk an entire directory tree recursively. */
export declare function walkTree(directory: Directory, callback: (directory: Directory) => void): void;
