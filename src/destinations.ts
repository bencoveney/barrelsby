import {walkTree} from "./fileTree";
import {Options} from "./options";
import {Directory, Location} from "./utilities";

/** Assess which directories in the tree should contain barrels. */
export function getDestinations(rootTree: Directory, options: Options): Directory[] {
    let destinations: Directory[];
    switch (options.location) {
        case "top":
        default:
            destinations = [rootTree];
            break;
        case "below":
            destinations = rootTree.directories;
            break;
        case "all":
            destinations = [];
            walkTree(rootTree, (directory: Directory) => {
                destinations.push(directory);
            });
            break;
        case "replace":
            destinations = [];
            walkTree(rootTree, (directory: Directory) => {
                if (directory.files.some((location: Location) => location.name === options.barrelName)) {
                    destinations.push(directory);
                }
            });
            break;
        case "branch":
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

    options.logger("Destinations:");
    destinations.forEach((destination) => options.logger(destination.path));

    return destinations;
}
