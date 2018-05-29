import {Logger} from "./options";
import {Location} from "./utilities";

interface Filters {
    blacklists: RegExp[];
    whitelists: RegExp[];
}

function buildFilters(include: string[], exclude: string[]): Filters {
    // Filter a set of modules down to those matching the include/exclude rules.
    function buildRegexList(patterns: string[] | undefined): RegExp[] {
        if (!Array.isArray(patterns)) {
            return [];
        }
        return patterns.map((pattern: string) => new RegExp(pattern));
    }
    return {
        blacklists: buildRegexList(exclude),
        whitelists: buildRegexList(include),
    };
}

function testLocation(filters: Filters, locationToTest: Location, logger: Logger): boolean {
    // return locations;
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
    //     return !filters.blacklists.some((test: RegExp) => {
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
    const [found] = result;
    return !!found;
}

/**
 * Determines whether a location should be included or excluded in the barrel creation process.
 * @param location: The location to test.
 * @returns True if the location should be included, otherwise false.
 */
export type LocationTest = (location: Location) => boolean;

export function createLocationTest(include: string[], exclude: string[], logger: Logger): LocationTest {
    const filters = buildFilters(include, exclude);
    return (location: Location) => testLocation(filters, location, logger);
}
