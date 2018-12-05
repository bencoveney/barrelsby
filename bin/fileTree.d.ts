import { Options } from "./options/options";
import { Directory } from "./utilities";
/** Build directory information recursively. */
export declare function buildTree(directory: string, options: Options, barrelName: string): Directory;
/** Walk an entire directory tree recursively. */
export declare function walkTree(directory: Directory, callback: (directory: Directory) => void): void;
