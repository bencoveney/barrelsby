import {Options} from "./options";
import {Directory, isTypeScriptFile, Location} from "./utilities";

// Get any typescript modules contained at any depth in the current directory.
function getModules(directory: Directory, options: Options): Location[] {
    options.logger(`Getting modules @ ${directory.path}`);
    if (directory.barrel) {
        // If theres a barrel then use that as it *should* contain descendant modules.
        options.logger(`Found existing barrel @ ${directory.barrel.path}`);
        return [directory.barrel];
    }
    const files: Location[] = ([] as Location[]).concat(directory.files);
    directory.directories.forEach((childDirectory: Directory) => {
        // Recurse.
        files.push(...getModules(childDirectory, options));
    });
    // Only return files that look like TypeScript modules.
    return files.filter((file: Location) => file.name.match(isTypeScriptFile));
}

export function loadDirectoryModules(directory: Directory, options: Options): Location[] {
    const modules = getModules(directory, options);

    return modules.filter(options.locationTest);
}
