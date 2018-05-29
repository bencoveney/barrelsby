"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildFilters(include, exclude) {
    // Filter a set of modules down to those matching the include/exclude rules.
    function buildRegexList(patterns) {
        if (!Array.isArray(patterns)) {
            return [];
        }
        return patterns.map((pattern) => new RegExp(pattern));
    }
    return {
        blacklists: buildRegexList(exclude),
        whitelists: buildRegexList(include),
    };
}
function testLocation(filters, locationToTest, logger) {
    // let result = locations;
    // if (filters.whitelists.length > 0) {
    //     result = filters.whitelists.some((test: RegExp) => {
    //         const isMatch = !!location.path.match(test);
    //         if (isMatch) {
    //             logger(`${location.path} is included by ${test}`);
    //         }
    //         return isMatch;
    //     });
    // }
    // if (filters.blacklists.length > 0) {
    //     result =return !filters.blacklists.some((test: RegExp) => {
    //         const isMatch = !!location.path.match(test);
    //         if (isMatch) {
    //             logger(`${location.path} is excluded by ${test}`);
    //         }
    //         return isMatch;
    //     });
    // }
    // return true;
    let result = [locationToTest];
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
    const [found] = result;
    return !!found;
}
function createLocationTest(include, exclude, logger) {
    const filters = buildFilters(include, exclude);
    return (location) => testLocation(filters, location, logger);
}
exports.createLocationTest = createLocationTest;
//# sourceMappingURL=filters.js.map