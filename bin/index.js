#! /usr/bin/env node
"use strict";
const builder_1 = require("./builder");
const destinations_1 = require("./destinations");
const fileTree_1 = require("./fileTree");
const barrelName_1 = require("./options/barrelName");
const baseUrl_1 = require("./options/baseUrl");
const logger_1 = require("./options/logger");
const noSemicolon_1 = require("./options/noSemicolon");
const quoteCharacter_1 = require("./options/quoteCharacter");
const rootPath_1 = require("./options/rootPath");
const purge_1 = require("./purge");
// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args) {
    // Get the launch options/arguments.
    // TODO: These casts could be fixed if all the options weren't ?optional.
    const logger = logger_1.getLogger(args.verbose);
    const barrelName = barrelName_1.getBarrelName(args.name, logger);
    const rootPath = rootPath_1.resolveRootPath(args.directory);
    const baseUrl = baseUrl_1.getCombinedBaseUrl(rootPath, args.baseUrl);
    // Build the directory tree.
    const rootTree = fileTree_1.buildTree(rootPath, barrelName, logger);
    // Work out which directories should have barrels.
    const destinations = destinations_1.getDestinations(rootTree, args.location, barrelName, logger);
    // Potentially there are some existing barrels that need removing.
    purge_1.purge(rootTree, args.delete !== undefined && args.delete, barrelName, logger);
    // Create the barrels.
    const quoteCharacter = quoteCharacter_1.getQuoteCharacter(args.singleQuotes);
    const semicolonCharacter = noSemicolon_1.getSemicolonCharacter(args.noSemicolon);
    builder_1.buildBarrels(destinations, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, !!args.exportDefault, args.structure, !!args.local, [].concat(args.include || []), [].concat(args.exclude || []));
}
module.exports = main;
//# sourceMappingURL=index.js.map