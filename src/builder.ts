import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as path from "path";

import {createBuilderInput} from "./builderInput";
import {loadDirectoryModules} from "./modules";
import {Options} from "./options";
import {convertPathSeparator, Directory, Location} from "./utilities";

/**
 * Builds barrels in the specified destinations.
 * @param destinations The locations to build barrels in.
 * @param options Barrelsby options.
 */
export function buildBarrels(destinations: Directory[], options: Options): void {
    // Build the barrels.
    destinations.forEach(
        (destination: Directory) => buildBarrel(destination, options),
    );
}

/**
 * Builds a barrel in the specified directory.
 * @param directory The directory to build a barrel for.
 * @param builder The builder to use to create barrel content.
 * @param options Barrelsby options.
 */
function buildBarrel(directory: Directory, options: Options) {
    options.logger(`Building barrel @ ${directory.path}`);

    const template = loadTemplate("fileSystem");

    const builderInput = createBuilderInput(
        directory,
        loadDirectoryModules(directory, options),
        options,
    );

    const content = template(builderInput);

    // Write the barrel to disk.
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);

    // We might need to update the file tree model with the new barrel.
    if (!directory.files.some((file: Location) => file.name === options.barrelName)) {
        // Build the location model.
        const convertedPath = convertPathSeparator(destination);
        const barrel = {
            name: options.barrelName,
            path: convertedPath,
        };
        // Insert it into the tree.
        options.logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}

/**
 * Loads the handlebars template with the specified name.
 * @param name The name of the template to load.
 * @returns The handlebars template.
 */
function loadTemplate(name: string) {
    // Will this break if running from different directories?
    return Handlebars.compile(
        fs.readFileSync(
            path.join(
                __dirname,
                `../src/builders/${name}.hbs`,
            ),
            "utf8",
        ),
    );
}
