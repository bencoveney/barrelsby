#! /usr/bin/env node

import {buildBarrels} from "./builder";
import {getDestinations} from "./destinations";
import {buildTree} from "./fileTree";
import {Arguments, getOptions} from "./options";
import {purge} from "./purge";
import {Directory} from "./utilities";

// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args: Arguments) {
  // Get the launch options/arguments.
  const options = getOptions(args);

  // Build the directory tree.
  const rootTree = buildTree(options.rootPath, options);

  // Work out which directories should have barrels.
  const destinations: Directory[] = getDestinations(rootTree, options);

  // Potentially there are some existing barrels that need removing.
  purge(rootTree, options);

  // Create the barrels.
  buildBarrels(destinations, options);
}

export = main;
