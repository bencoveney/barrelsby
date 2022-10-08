#! /usr/bin/env node

import { build } from './builder';
import { getDestinations } from './destinations';
import { buildTree } from './fileTree';
import { getBarrelName } from './options/barrelName';
import { getCombinedBaseUrl } from './options/baseUrl';
import { getLogger } from './options/logger';
import { getSemicolonCharacter } from './options/noSemicolon';
import { Arguments, LocationOption } from './options/options';
import { getQuoteCharacter } from './options/quoteCharacter';
import { resolveRootPath } from './options/rootPath';
import { purge } from './purge';
import { Directory } from './interfaces/directory.interface';

// TODO: Document how users can call this from their own code without using the CLI.
// TODO: We might need to do some parameter validation for that.
export function Barrelsby(args: Arguments) {
  // Get the launch options/arguments.
  const logger = getLogger({ isVerbose: args.verbose ?? false });
  const barrelName = getBarrelName(args.name ?? '', logger);
  const directories = !Array.isArray(args.directory) ? [args.directory ?? './'] : args.directory ?? ['./'];

  logger.debug(`Directories passed`, directories);

  const resolvedDirectories = directories.map(directory => {
    const rootPath = resolveRootPath(directory);
    logger.debug('Resolved root path %s', rootPath);
    return {
      dir: directory,
      rootPath,
      baseUrl: getCombinedBaseUrl(rootPath, args.baseUrl),
    };
  });

  logger.debug('resolved directories list', resolvedDirectories);

  resolvedDirectories.forEach(async ({ rootPath, baseUrl }) => {
    // Build the directory tree.
    const rootTree = buildTree(rootPath, barrelName, logger);
    logger.debug(`root tree for path: ${rootPath}`, rootTree);

    // Work out which directories should have barrels.
    const destinations: Directory[] = getDestinations(rootTree, args.location as LocationOption, barrelName, logger);

    logger.debug('Destinations', destinations);

    // Potentially there are some existing barrels that need removing.
    purge(rootTree, args.delete ?? false, barrelName, logger);

    // Create the barrels.
    const quoteCharacter = getQuoteCharacter(args.singleQuotes as boolean);
    const semicolonCharacter = getSemicolonCharacter(args.noSemicolon as boolean);
    // Add header to each barrel if the `noHeader` option is not true
    const addHeader = args.noHeader === false;

    await build({
      addHeader,
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
      exclude: ([] as string[]).concat(args.exclude || [], ['node_modules']),
    });
  });
}
