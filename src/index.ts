#! /usr/bin/env node

import { Builder } from "./builder";
import { getDestinations } from "./destinations";
import { buildTree } from "./fileTree";
import { getBarrelName } from "./options/barrelName";
import { getCombinedBaseUrl } from "./options/baseUrl";
import { getLogger } from "./options/logger";
import { getSemicolonCharacter } from "./options/noSemicolon";
import { Arguments, LocationOption } from "./options/options";
import { getQuoteCharacter } from "./options/quoteCharacter";
import { resolveRootPath } from "./options/rootPath";
import { purge } from "./purge";
import { Directory } from "./utilities";

// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
function main(args: Arguments) {
  // Get the launch options/arguments.
  // TODO: These casts could be fixed if all the options weren't ?optional.
  const logger = getLogger(args.verbose as boolean);
  const barrelName = getBarrelName(args.name as string, logger);
  const directories = !Array.isArray(args.directory)
    ? [args.directory ?? "./"]
    : args.directory ?? ["./"];

  const resolvedDirectories = directories.map(directory => {
    const rootPath = resolveRootPath(directory)
    return {
      dir: directory,
      rootPath,
      baseUrl: getCombinedBaseUrl(rootPath, args.baseUrl)
    };
  });

  resolvedDirectories.forEach(async ({ rootPath, baseUrl }) => {
    // Build the directory tree.
    const rootTree = buildTree(rootPath, barrelName, logger);

    // Work out which directories should have barrels.
    const destinations: Directory[] = getDestinations(
        rootTree,
        args.location as LocationOption,
        barrelName,
        logger
    );

    // Potentially there are some existing barrels that need removing.
    purge(rootTree, args.delete !== undefined && args.delete, barrelName, logger);

    // Create the barrels.
    const quoteCharacter = getQuoteCharacter(args.singleQuotes as boolean);
    const semicolonCharacter = getSemicolonCharacter(args.noSemicolon as boolean);
    const builder = new Builder({
      destinations,
      quoteCharacter,
      semicolonCharacter,
      barrelName,
      logger,
      baseUrl,
      exportDefault: !!args.exportDefault,
      structure: args.structure,
      local: !!args.local,
      include: ([] as string[]).concat(args.include || []),
      exclude: ([] as string[]).concat(args.exclude || [], ["node_modules"])
    })

    await builder.build()
  })
}

export = main;
