import {readdirSync, statSync, unlinkSync} from 'node:fs';
import {basename, join} from 'node:path';
import {Signale} from 'signale';
import {Directory} from '../interfaces/directory.interface.mjs';
import {FileTreeLocation} from '../interfaces/location.interface.mjs';
import {LocationOption} from './args.mjs';

/**
 * Convert from windows to unix style paths
 * @param path
 */
export function convertPathSeparator(path: string): string {
  return path.replace(/\\+/g, '/');
}

export async function buildTree(directory: string, barrelName: string, logger?: Signale): Promise<Directory> {
  console.time('buildTree ' + directory);
  logger?.debug(`Building directory tree for ${convertPathSeparator(directory)}`);
  const names = readdirSync(directory);
  const result: Directory = {
    directories: [],
    files: [],
    name: basename(directory),
    path: convertPathSeparator(directory)
  };

  await Promise.all(names.map(async (name) => {
    const fullPath = join(directory, name);
    if (statSync(fullPath).isDirectory()) {
      result.directories.push(await buildTree(fullPath, barrelName, logger));
    } else {
      const convertedPath = convertPathSeparator(fullPath);
      const file = {
        name,
        path: convertedPath
      };
      if (file.name === barrelName) {
        logger?.debug(`Found existing barrel @ ${convertedPath}`);
        result.barrel = file;
      } else {
        result.files.push(file);
      }
    }
  }));

  console.timeEnd('buildTree ' + directory);
  return result;
}

/** Walk an entire directory tree recursively. */
export function walkTree(directory: Directory, callback: (directory: Directory) => void) {
  callback(directory);
  directory.directories.forEach(childDirectory => walkTree(childDirectory, callback));
}

/** Assess which directories in the tree should contain barrels. */
export function getDestinations(
        rootTree: Directory,
        locationOption: LocationOption,
        barrelName: string,
        logger: Signale
): Directory[] {
  let destinations: Directory[];
  switch (locationOption) {
    case 'top':
    default:
      destinations = [rootTree];
      break;
    case 'below':
      destinations = rootTree.directories;
      break;
    case 'all':
      destinations = [];
      walkTree(rootTree, (directory: Directory) => {
        destinations.push(directory);
      });
      break;
    case 'replace':
      destinations = [];
      walkTree(rootTree, (directory: Directory) => {
        if (directory.files.some((location: FileTreeLocation) => location.name === barrelName)) {
          destinations.push(directory);
        }
      });
      break;
    case 'branch':
      destinations = [];
      walkTree(rootTree, (directory: Directory) => {
        if (directory.directories.length > 0) {
          destinations.push(directory);
        }
      });
      break;
  }

  // Sort by length. This means barrels will be created deepest first.
  destinations = destinations.sort((a: Directory, b: Directory) => {
    return b.path.length - a.path.length;
  });

  logger.debug('Destinations:');
  destinations.forEach(destination => logger.debug(destination.path));

  return destinations;
}

export function purge(rootTree: Directory, shouldPurge: boolean, barrelName: string, logger: Signale) {
  // Delete any existing barrels.
  if (shouldPurge) {
    logger.debug(`Purging barrels for ${rootTree}`);
    walkTree(rootTree, (directory: Directory) => {
      directory.files.filter((file: FileTreeLocation) => {
        return file.name === barrelName;
      })
      .forEach((file: FileTreeLocation) => {
        logger.debug(`Deleting existing barrel @ ${file.path}`);
        // Delete barrel file and clean up tree model.
        unlinkSync(file.path);
        directory.files.splice(directory.files.indexOf(file), 1);
        directory.barrel = undefined;
      });
    });
  }
}