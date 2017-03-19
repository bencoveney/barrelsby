import * as path from "path";

import {Options} from "../options";
import {Directory, Location} from "../utilities";

export interface BarrelBuilder {
    (directory: Directory, modules: Location[], options: Options): string;
}

export function buildImportPath(directory: Directory, target: Location): string {
    // Get the route from the current directory to the module.
    const relativePath = path.relative(directory.path, target.path);
    // Get the route and ensure it's relative
    let directoryPath = path.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = `.${path.sep}${directoryPath}`;
    }
    // Strip off the .ts from the file name.
    const fileName = path.basename(relativePath, ".ts");
    // Build the final path string. Use posix-style seperators.
    let location = `${directoryPath}${path.sep}${fileName}`;
    return location.replace(/\\+/g, "/");
}
