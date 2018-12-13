#! /usr/bin/env node

import { buildBarrels } from "./builder";
import { getDestinations } from "./destinations";
import { buildTree } from "./fileTree";
import { getBarrelName } from "./options/barrelName";
import { getCombinedBaseUrl } from "./options/baseUrl";
import { getLogger } from "./options/logger";
import { Arguments } from "./options/options";
import { getQuoteCharacter } from "./options/quoteCharacter";
import { resolveRootPath } from "./options/rootPath";
import { purge } from "./purge";
import { Directory } from "./utilities";

// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args: Arguments) {
  // Get the launch options/arguments.
  // TODO: These casts could be fixed if all the options weren't ?optional.
  const options = args;
  const logger = getLogger(options.verbose as boolean);
  const barrelName = getBarrelName(options.name as string, logger);
  const rootPath = resolveRootPath(options.directory as string);
  const baseUrl = getCombinedBaseUrl(rootPath, options.baseUrl);

  // Build the directory tree.
  const rootTree = buildTree(rootPath, options, barrelName, logger);

  // Work out which directories should have barrels.
  const destinations: Directory[] = getDestinations(
    rootTree,
    options,
    barrelName,
    logger
  );

  // Potentially there are some existing barrels that need removing.
  purge(rootTree, options, barrelName, logger);

  // Create the barrels.
  const quoteCharacter = getQuoteCharacter(args.singleQuotes as boolean);
  buildBarrels(
    destinations,
    options,
    quoteCharacter,
    barrelName,
    logger,
    baseUrl
  );
}

export = main;
