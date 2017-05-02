#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder/builder");
var destinations_1 = require("./destinations");
var fileTree_1 = require("./fileTree");
var options_1 = require("./options");
var purge_1 = require("./purge");
// Get the launch options/arguments.
var options = options_1.getOptions();
// Build the directory tree.
var rootTree = fileTree_1.buildTree(options.rootPath, options);
// Work out which directories should have barrels.
var destinations = destinations_1.getDestinations(rootTree, options);
// Potentially there are some existing barrels that need removing.
purge_1.purge(rootTree, options);
// Create the barrels.
builder_1.buildBarrels(destinations, options);
//# sourceMappingURL=index.js.map