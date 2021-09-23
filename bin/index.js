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
    var _a, _b;
    // Get the launch options/arguments.
    // TODO: These casts could be fixed if all the options weren't ?optional.
    const logger = (0, logger_1.getLogger)(args.verbose);
    const barrelName = (0, barrelName_1.getBarrelName)(args.name, logger);
    const dir = (_b = (Array.isArray(args.directory)
        ? (_a = args.directory) === null || _a === void 0 ? void 0 : _a.shift()
        : args.directory)) !== null && _b !== void 0 ? _b : "";
    // tslint:disable-next-line:no-console
    console.log("dir: ", dir);
    const rootPath = (0, rootPath_1.resolveRootPath)(dir);
    const baseUrl = (0, baseUrl_1.getCombinedBaseUrl)(rootPath, args.baseUrl);
    // Build the directory tree.
    const rootTree = (0, fileTree_1.buildTree)(rootPath, barrelName, logger);
    // Work out which directories should have barrels.
    const destinations = (0, destinations_1.getDestinations)(rootTree, args.location, barrelName, logger);
    // Potentially there are some existing barrels that need removing.
    (0, purge_1.purge)(rootTree, args.delete !== undefined && args.delete, barrelName, logger);
    // Create the barrels.
    const quoteCharacter = (0, quoteCharacter_1.getQuoteCharacter)(args.singleQuotes);
    const semicolonCharacter = (0, noSemicolon_1.getSemicolonCharacter)(args.noSemicolon);
    (0, builder_1.buildBarrels)(destinations, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, !!args.exportDefault, args.structure, !!args.local, [].concat(args.include || []), [].concat(args.exclude || [], ["node_modules"]));
}
module.exports = main;
//# sourceMappingURL=index.js.map