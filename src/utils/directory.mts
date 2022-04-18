/**
 * Convert from windows to unix style paths
 * @param path
 */
import { readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { Signale } from 'signale';
import { Directory } from '../interfaces/directory.interface.mjs';

export function convertPathSeparator(path: string): string {
  return path.replace(/\\+/g, '/');
}

export function buildTree(directory: string, barrelName: string, logger?: Signale): Directory {
  logger?.debug(`Building directory tree for ${convertPathSeparator(directory)}`);
  const names = readdirSync(directory);
  const result: Directory = {
    directories: [],
    files: [],
    name: basename(directory),
    path: convertPathSeparator(directory),
  };
  for (const name of names) {
    const fullPath = join(directory, name);
    if (statSync(fullPath).isDirectory()) {
      result.directories.push(buildTree(fullPath, barrelName, logger));
    } else {
      const convertedPath = convertPathSeparator(fullPath);
      const file = {
        name,
        path: convertedPath,
      };
      if (file.name === barrelName) {
        logger?.debug(`Found existing barrel @ ${convertedPath}`);
        result.barrel = file;
        continue;
      }
      result.files.push(file);
    }
  }
  return result;
}

/** Walk an entire directory tree recursively. */
export function walkTree(directory: Directory, callback: (directory: Directory) => void) {
  callback(directory);
  directory.directories.forEach(childDirectory => walkTree(childDirectory, callback));
}