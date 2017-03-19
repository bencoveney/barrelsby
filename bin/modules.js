"use strict";
var utilities_1 = require("./utilities");
// Get any typescript modules contained at any depth in the current directory.
function getModules(directory, options) {
    options.logger("Getting modules @ " + directory.path);
    if (directory.index) {
        // If theres an index then use that as it *should* contain descendant modules.
        options.logger("Found existing index @ " + directory.index.path);
        return [directory.index];
    }
    var files = [].concat(directory.files);
    directory.directories.forEach(function (childDirectory) {
        // Recurse.
        files.push.apply(files, getModules(childDirectory, options));
    });
    // Only return files that look like TypeScript modules.
    return files.filter(function (file) { return file.name.match(utilities_1.isTypeScriptFile); });
}
function buildFilters(options) {
    // Filter a set of modules down to those matching the include/exclude rules.
    function buildRegexList(patterns) {
        if (!Array.isArray(patterns)) {
            return null;
        }
        return patterns.map(function (pattern) { return new RegExp(pattern); });
    }
    return {
        blacklists: buildRegexList(options.exclude),
        whitelists: buildRegexList(options.include),
    };
}
function filterModules(filters, locations, options) {
    var result = locations;
    if (filters.whitelists !== null) {
        result = result.filter(function (location) {
            return filters.whitelists.some(function (test) {
                var isMatch = !!location.path.match(test);
                if (isMatch) {
                    options.logger(location.path + " is included by " + test);
                }
                return isMatch;
            });
        });
    }
    if (filters.blacklists !== null) {
        result = result.filter(function (location) {
            return !filters.blacklists.some(function (test) {
                var isMatch = !!location.path.match(test);
                if (isMatch) {
                    options.logger(location.path + " is excluded by " + test);
                }
                return isMatch;
            });
        });
    }
    return result;
}
function loadDirectoryModules(directory, options) {
    var modules = getModules(directory, options);
    var filters = buildFilters(options);
    if (filters.blacklists || filters.whitelists) {
        return filterModules(filters, modules, options);
    }
    else {
        return modules;
    }
}
exports.loadDirectoryModules = loadDirectoryModules;
