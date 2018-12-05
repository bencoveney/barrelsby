#! /usr/bin/env node

import { buildBarrels } from "./builder";
import { getDestinations } from "./destinations";
import { buildTree } from "./fileTree";
import { getBarrelName } from "./options/barrelName";
import { Arguments, getOptions } from "./options/options";
import { getQuoteCharacter } from "./options/quoteCharacter";
import { purge } from "./purge";
import { Directory } from "./utilities";

// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args: Arguments) {
  // Get the launch options/arguments.
  // TODO: These casts could be fixed if all the options weren't ?optional.
  const options = getOptions(args);
  const barrelName = getBarrelName(options.name as string, options.logger);

  // Build the directory tree.
  const rootTree = buildTree(options.rootPath, options, barrelName);

  // Work out which directories should have barrels.
  const destinations: Directory[] = getDestinations(
    rootTree,
    options,
    barrelName
  );

  // Potentially there are some existing barrels that need removing.
  purge(rootTree, options, barrelName);

  // Create the barrels.
  const quoteCharacter = getQuoteCharacter(args.singleQuotes as boolean);
  buildBarrels(destinations, options, quoteCharacter, barrelName);
}

export = main;
