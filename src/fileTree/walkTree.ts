import { Directory } from "../fileTree/directory";

/** Walk an entire directory tree recursively. */
export function walkTree(
  directory: Directory,
  callback: (directory: Directory) => void
) {
  callback(directory);
  directory.directories.forEach(childDirectory =>
    walkTree(childDirectory, callback)
  );
}
