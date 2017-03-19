import * as fs from "fs";
import * as path from "path";

import {Options} from "./options";
import {Directory} from "./utilities";

/** Build directory information recursively. */
export function buildTree(directory: string, options: Options): Directory {
    options.logger(`Building directory tree for ${directory}`);
    const names = fs.readdirSync(directory);
    const result: Directory = {
        directories: [],
        files: [],
        name: path.basename(directory),
        path: directory,
    };
    names.forEach((name: string) => {
        const fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath, options));
        } else {
            const file = {
                name,
                path: fullPath,
            };
            result.files.push(file);
            if (file.name === options.indexName) {
                options.logger(`Found existing index @ ${fullPath}`);
                result.index = file;
            }
        }
    });
    return result;
}

/** Walk an entire directory tree recursively. */
export function walkTree(directory: Directory, callback: (directory: Directory) => void) {
    callback(directory);
    for (const name of Object.keys(directory.directories)) {
        walkTree(directory.directories[name], callback);
    }
}
