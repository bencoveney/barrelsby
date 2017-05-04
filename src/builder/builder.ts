import * as fs from "fs";
import * as path from "path";

import {Options} from "../options";
import {convertPathSeparator, Directory, Location} from "../utilities";

import {buildFileSystemBarrel} from "./fileSystem";
import {buildFlatBarrel} from "./flat";
import {loadDirectoryModules} from "./modules";
import {BarrelBuilder} from "./utilities";

export function buildBarrels(destinations: Directory[], options: Options): void {
    let builder: BarrelBuilder;
    switch (options.structure) {
        default:
        case "flat":
            builder = buildFlatBarrel;
            break;
        case "filesystem":
            builder = buildFileSystemBarrel;
            break;
    }
    // Build the barrels.
    destinations.forEach((destination: Directory) => buildBarrel(destination, builder, options));
}

// Build a barrel for the specified directory.
function buildBarrel(directory: Directory, builder: BarrelBuilder, options: Options) {
    options.logger(`Building barrel @ ${directory.path}`);
    const content = builder(directory, loadDirectoryModules(directory, options), options);
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);
    // Update the file tree model with the new barrel.
    if (!directory.files.some((file: Location) => file.name === options.barrelName)) {
        const convertedPath = convertPathSeparator(destination);
        const barrel = {
            name: options.barrelName,
            path: convertedPath,
        };
        options.logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}
