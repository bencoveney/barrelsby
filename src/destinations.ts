import { walkTree } from './fileTree';
import { Logger } from './options/logger';
import { LocationOption } from './options/options';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';

/** Assess which directories in the tree should contain barrels. */
export function getDestinations(
  rootTree: Directory,
  locationOption: LocationOption,
  barrelName: string,
  logger: Logger
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
