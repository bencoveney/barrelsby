import { Directory } from "../fileTree/directory";
/** Walk an entire directory tree recursively. */
export declare function walkTree(directory: Directory, callback: (directory: Directory) => void): void;
