"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Handlebars = require("handlebars");
const path = require("path");
const builderInput_1 = require("./builderInput");
const modules_1 = require("./modules");
const utilities_1 = require("./utilities");
/**
 * Builds barrels in the specified destinations.
 * @param destinations The locations to build barrels in.
 * @param options Barrelsby options.
 */
function buildBarrels(destinations, options) {
    // Build the barrels.
    destinations.forEach((destination) => buildBarrel(destination, options));
}
exports.buildBarrels = buildBarrels;
/**
 * Builds a barrel in the specified directory.
 * @param directory The directory to build a barrel for.
 * @param builder The builder to use to create barrel content.
 * @param options Barrelsby options.
 */
function buildBarrel(directory, options) {
    options.logger(`Building barrel @ ${directory.path}`);
    // TODO: Observe options
    const template = loadTemplate(options.structure);
    const builderInput = builderInput_1.createBuilderInput(directory, modules_1.loadDirectoryModules(directory, options), options);
    const content = template(builderInput);
    // Write the barrel to disk.
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);
    // We might need to update the file tree model with the new barrel.
    if (!directory.files.some((file) => file.name === options.barrelName)) {
        // Build the location model.
        const convertedPath = utilities_1.convertPathSeparator(destination);
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
function loadTemplate(name) {
    // TODO: Will this break if running from different directories?
    return Handlebars.compile(fs.readFileSync(path.join(__dirname, `builders/${name}.hbs`), "utf8"));
}
//# sourceMappingURL=builder.js.map