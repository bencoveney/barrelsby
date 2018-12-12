#! /usr/bin/env node
"use strict";
const builder_1 = require("./builder");
const destinations_1 = require("./destinations");
const fileTree_1 = require("./fileTree");
const barrelName_1 = require("./options/barrelName");
const logger_1 = require("./options/logger");
const options_1 = require("./options/options");
const quoteCharacter_1 = require("./options/quoteCharacter");
const purge_1 = require("./purge");
// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args) {
    // Get the launch options/arguments.
    // TODO: These casts could be fixed if all the options weren't ?optional.
    const options = options_1.getOptions(args);
    const logger = logger_1.getLogger(options.verbose);
    const barrelName = barrelName_1.getBarrelName(options.name, logger);
    // Build the directory tree.
    const rootTree = fileTree_1.buildTree(options.rootPath, options, barrelName, logger);
    // Work out which directories should have barrels.
    const destinations = destinations_1.getDestinations(rootTree, options, barrelName, logger);
    // Potentially there are some existing barrels that need removing.
    purge_1.purge(rootTree, options, barrelName, logger);
    // Create the barrels.
    const quoteCharacter = quoteCharacter_1.getQuoteCharacter(args.singleQuotes);
    builder_1.buildBarrels(destinations, options, quoteCharacter, barrelName, logger);
}
module.exports = main;
//# sourceMappingURL=index.js.map