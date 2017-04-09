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
    const barrelContent = builder(directory, loadDirectoryModules(directory, options), options);
    const indexPath = path.join(directory.path, options.indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some((file: Location) => file.name === options.indexName)) {
        const convertedPath = convertPathSeparator(indexPath);
        const index = {
            name: options.indexName,
            path: convertedPath,
        };
        options.logger(`Updating model index @ ${convertedPath}`);
        directory.files.push(index);
        directory.index = index;
    }
}
