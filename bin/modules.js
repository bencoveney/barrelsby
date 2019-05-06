"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
// Get any typescript modules contained at any depth in the current directory.
function getModules(directory, logger, local) {
    logger(`Getting modules @ ${directory.path}`);
    if (directory.barrel) {
        // If theres a barrel then use that as it *should* contain descendant modules.
        logger(`Found existing barrel @ ${directory.barrel.path}`);
        return [directory.barrel];
    }
    const files = [].concat(directory.files);
    if (!local) {
        directory.directories.forEach((childDirectory) => {
            // Recurse.
            files.push(...getModules(childDirectory, logger, local));
        });
    }
    // Only return files that look like TypeScript modules.
    return files.filter((file) => file.name.match(utilities_1.isTypeScriptFile));
}
function buildFilters(include, exclude) {
    // Filter a set of modules down to those matching the include/exclude rules.
    function buildRegexList(patterns) {
        return patterns.map((pattern) => new RegExp(pattern));
    }
    return {
        blacklists: buildRegexList(exclude),
        whitelists: buildRegexList(include)
    };
}
function filterModules(filters, locations, logger) {
    let result = locations;
    if (filters.whitelists.length > 0) {
        result = result.filter((location) => {
            return filters.whitelists.some((test) => {
                const isMatch = !!location.path.match(test);
                if (isMatch) {
                    logger(`${location.path} is included by ${test}`);
                }
                return isMatch;
            });
        });
    }
    if (filters.blacklists.length > 0) {
        result = result.filter((location) => {
            return !filters.blacklists.some((test) => {
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
function loadDirectoryModules(directory, logger, include, exclude, local) {
    const modules = getModules(directory, logger, local);
    const filters = buildFilters(include, exclude);
    return filterModules(filters, modules, logger);
}
exports.loadDirectoryModules = loadDirectoryModules;
//# sourceMappingURL=modules.js.map