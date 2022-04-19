import {Directory} from "../interfaces/directory.interface.mjs";
import {Signale} from "signale";
import {FileTreeLocation} from "../interfaces/location.interface.mjs";
import {isTypeScriptFile} from "./constants.mjs";

interface Filters {
  blacklists: RegExp[];
  whitelists: RegExp[];
}

// Get any typescript modules contained at any depth in the current directory.
function getModules(directory: Directory, logger: Signale, local: boolean): FileTreeLocation[] {
  logger.debug(`Getting modules @ ${directory.path}`);
  if (directory.barrel) {
    // If theres a barrel then use that as it *should* contain descendant modules.
    logger.debug(`Found existing barrel @ ${directory.barrel.path}`);
    return [directory.barrel];
  }
  const files: FileTreeLocation[] = ([] as FileTreeLocation[]).concat(directory.files);
  if (!local) {
    directory.directories.forEach((childDirectory: Directory) => {
      // Recurse.
      files.push(...getModules(childDirectory, logger, local));
    });
  }
  // Only return files that look like TypeScript modules.
  return files.filter((file: FileTreeLocation) => file.name.match(isTypeScriptFile));
}

function buildFilters(include: string[], exclude: string[]): Filters {
  // Filter a set of modules down to those matching the include/exclude rules.
  function buildRegexList(patterns: string[]): RegExp[] {
    return patterns.map((pattern: string) => new RegExp(pattern));
  }
  return {
    blacklists: buildRegexList(exclude),
    whitelists: buildRegexList(include),
  };
}

function filterModules(filters: Filters, locations: FileTreeLocation[], logger: Signale): FileTreeLocation[] {
  let result = locations;
  if (filters.whitelists.length > 0) {
    result = result.filter((location: FileTreeLocation) => {
      return filters.whitelists.some((test: RegExp) => {
        const isMatch = !!location.path.match(test);
        if (isMatch) {
          logger.debug(`${location.path} is included by ${test}`);
        }
        return isMatch;
      });
    });
  }
  if (filters.blacklists.length > 0) {
    result = result.filter((location: FileTreeLocation) => {
      return !filters.blacklists.some((test: RegExp) => {
        const isMatch = !!location.path.match(test);
        if (isMatch) {
          logger.debug(`${location.path} is excluded by ${test}`);
        }
        return isMatch;
      });
    });
  }
  return result;
}

export function loadDirectoryModules(
  directory: Directory,
  logger: Signale,
  include: string[],
  exclude: string[],
  local: boolean
): FileTreeLocation[] {
  const modules = getModules(directory, logger, local);

  const filters = buildFilters(include, exclude);

  return filterModules(filters, modules, logger);
}