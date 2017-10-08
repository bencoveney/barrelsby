#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("./builder");
const destinations_1 = require("./destinations");
const fileTree_1 = require("./fileTree");
const options_1 = require("./options");
const purge_1 = require("./purge");
// Get the launch options/arguments.
const options = options_1.getOptions();
// Build the directory tree.
const rootTree = fileTree_1.buildTree(options.rootPath, options);
// Work out which directories should have barrels.
const destinations = destinations_1.getDestinations(rootTree, options);
// Potentially there are some existing barrels that need removing.
purge_1.purge(rootTree, options);
// Create the barrels.
builder_1.buildBarrels(destinations, options);
//# sourceMappingURL=index.js.map