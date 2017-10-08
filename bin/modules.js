"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
// Get any typescript modules contained at any depth in the current directory.
function getModules(directory, options) {
    options.logger(`Getting modules @ ${directory.path}`);
    if (directory.barrel) {
        // If theres a barrel then use that as it *should* contain descendant modules.
        options.logger(`Found existing barrel @ ${directory.barrel.path}`);
        return [directory.barrel];
    }
    const files = [].concat(directory.files);
    directory.directories.forEach((childDirectory) => {
        // Recurse.
        files.push(...getModules(childDirectory, options));
    });
    // Only return files that look like TypeScript modules.
    return files.filter((file) => file.name.match(utilities_1.isTypeScriptFile));
}
function buildFilters(options) {
    // Filter a set of modules down to those matching the include/exclude rules.
    function buildRegexList(patterns) {
        if (!Array.isArray(patterns)) {
            return [];
        }
        return patterns.map((pattern) => new RegExp(pattern));
    }
    return {
        blacklists: buildRegexList(options.exclude),
        whitelists: buildRegexList(options.include),
    };
}
function filterModules(filters, locations, options) {
    let result = locations;
    if (filters.whitelists.length > 0) {
        result = result.filter((location) => {
            return filters.whitelists.some((test) => {
                const isMatch = !!location.path.match(test);
                if (isMatch) {
                    options.logger(`${location.path} is included by ${test}`);
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
                    options.logger(`${location.path} is excluded by ${test}`);
                }
                return isMatch;
            });
        });
    }
    return result;
}
function loadDirectoryModules(directory, options) {
    const modules = getModules(directory, options);
    const filters = buildFilters(options);
    return filterModules(filters, modules, options);
}
exports.loadDirectoryModules = loadDirectoryModules;
//# sourceMappingURL=modules.js.map