import { Logger } from "./options/logger";
import { Directory, isTypeScriptFile, Location } from "./utilities";

interface Filters {
  blacklists: RegExp[];
  whitelists: RegExp[];
}

// Get any typescript modules contained at any depth in the current directory.
function getModules(
  directory: Directory,
  logger: Logger,
  local: boolean
): Location[] {
  logger(`Getting modules @ ${directory.path}`);
  if (directory.barrel) {
    // If theres a barrel then use that as it *should* contain descendant modules.
    logger(`Found existing barrel @ ${directory.barrel.path}`);
    return [directory.barrel];
  }
  const files: Location[] = ([] as Location[]).concat(directory.files);
  if (!local) {
    directory.directories.forEach((childDirectory: Directory) => {
      // Recurse.
      files.push(...getModules(childDirectory, logger, local));
    });
  }
  // Only return files that look like TypeScript modules.
  return files.filter((file: Location) => file.name.match(isTypeScriptFile));
}

function buildFilters(include: string[], exclude: string[]): Filters {
  // Filter a set of modules down to those matching the include/exclude rules.
  function buildRegexList(patterns: string[]): RegExp[] {
    return patterns.map((pattern: string) => new RegExp(pattern));
  }
  return {
    blacklists: buildRegexList(exclude),
    whitelists: buildRegexList(include)
  };
}

function filterModules(
  filters: Filters,
  locations: Location[],
  logger: Logger
): Location[] {
  let result = locations;
  if (filters.whitelists.length > 0) {
    result = result.filter((location: Location) => {
      return filters.whitelists.some((test: RegExp) => {
        const isMatch = !!location.path.match(test);
        if (isMatch) {
          logger(`${location.path} is included by ${test}`);
        }
        return isMatch;
      });
    });
  }
  if (filters.blacklists.length > 0) {
    result = result.filter((location: Location) => {
      return !filters.blacklists.some((test: RegExp) => {
        const isMatch = !!location.path.match(test);
        if (isMatch) {
          logger(`${location.path} is excluded by ${test}`);
        }
        return isMatch;
      });
    });
  }
  return result;
}

export function loadDirectoryModules(
  directory: Directory,
  logger: Logger,
  include: string[],
  exclude: string[],
  local: boolean
): Location[] {
  const modules = getModules(directory, logger, local);

  const filters = buildFilters(include, exclude);

  return filterModules(filters, modules, logger);
}
