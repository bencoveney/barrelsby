import { Logger } from "./options";
import { Location } from "./utilities";
/**
 * Determines whether a location should be included or excluded in the barrel creation process.
 * @param location: The location to test.
 * @returns True if the location should be included, otherwise false.
 */
export declare type LocationTest = (location: Location) => boolean;
export declare function createLocationTest(include: string[], exclude: string[], logger: Logger): LocationTest;
