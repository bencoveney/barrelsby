import fs from "fs";
import path from "path";

import { Logger } from "./options/logger";
import { convertPathSeparator, Directory } from "./utilities";

/** Build directory information recursively. */
export function buildTree(
  directory: string,
  barrelName: string,
  logger: Logger
): Directory {
  logger(`Building directory tree for ${convertPathSeparator(directory)}`);
  const names = fs.readdirSync(directory);
  const result: Directory = {
    directories: [],
    files: [],
    name: path.basename(directory),
    path: convertPathSeparator(directory)
  };
  names.forEach((name: string) => {
    const fullPath = path.join(directory, name);
    if (fs.statSync(fullPath).isDirectory()) {
      result.directories.push(buildTree(fullPath, barrelName, logger));
    } else {
      const convertedPath = convertPathSeparator(fullPath);
      const file = {
        name,
        path: convertedPath
      };
      result.files.push(file);
      if (file.name === barrelName) {
        logger(`Found existing barrel @ ${convertedPath}`);
        result.barrel = file;
      }
    }
  });
  return result;
}

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
