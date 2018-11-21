import fs from "fs";

import {walkTree} from "./fileTree";
import {Options} from "./options";
import {Directory, Location} from "./utilities";

export function purge(rootTree: Directory, options: Options) {
    // Delete any existing barrels.
    if (options.delete) {
        walkTree(rootTree, (directory: Directory) => {
            directory.files
                .filter((file: Location) => {
                    return file.name === options.barrelName;
                })
                .forEach((file: Location) => {
                    options.logger(`Deleting existing barrel @ ${file.path}`);
                    // Delete barrel file and clean up tree model.
                    fs.unlinkSync(file.path);
                    directory.files.splice(directory.files.indexOf(file), 1);
                    directory.barrel = undefined;
                });
        });
    }
}
