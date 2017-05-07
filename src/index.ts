#! /usr/bin/env node

import {buildBarrels} from "./builder";
import {getDestinations} from "./destinations";
import {buildTree} from "./fileTree";
import {getOptions} from "./options";
import {purge} from "./purge";
import {Directory} from "./utilities";

// Get the launch options/arguments.
const options = getOptions();

// Build the directory tree.
const rootTree = buildTree(options.rootPath, options);

// Work out which directories should have barrels.
const destinations: Directory[] = getDestinations(rootTree, options);

// Potentially there are some existing barrels that need removing.
purge(rootTree, options);

// Create the barrels.
buildBarrels(destinations, options);
