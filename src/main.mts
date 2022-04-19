import {Arguments, getArgs, LocationOption} from './utils/args.mjs';
import {getLogger} from './utils/logger.mjs';
import {join, resolve} from 'node:path';
import {buildTree, getDestinations, purge} from './utils/directory.mjs';
import {Directory} from './interfaces/directory.interface.mjs';
import {build} from "./utils/build-barrel.mjs";

async function createBarrels(options: Arguments) {
  const logger = getLogger({isVerbose: options.verbose ?? false});

  const barrelName = options.barrelName ?? "index"

  const directories = !Array.isArray(options.directory) ? [options.directory ?? './'] : options.directory ?? ['./'];

  logger.debug(`Directories passed`, directories);

  const resolvedDirectories = directories.map(directory => {
    const rootPath = resolve(directory);
    logger.debug('Resolved root path %s', rootPath);
    return {
      dir: directory,
      rootPath,
      baseUrl: options.baseUrl ? join(rootPath, options.baseUrl) : undefined
    };
  });

  for (const { dir, rootPath, baseUrl } of resolvedDirectories) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rootTree = await buildTree(dir, barrelName, logger)
    logger.debug(`root tree for path: ${rootPath}`, rootTree);

    // Work out which directories should have barrels.
    const destinations: Directory[] = getDestinations(rootTree, options.location as LocationOption, barrelName, logger);

    logger.debug('Destinations', destinations);

    // Potentially there are some existing barrels that need removing.
    purge(rootTree, options.delete ?? false, barrelName, logger);

    // Create the barrels.
    const quoteCharacter = options.singleQuotes ? "'" : '"';
    const semicolonCharacter = options.noSemicolon ? "" : ";";
    await build({
      destinations,
      quoteCharacter,
      semicolonCharacter,
      barrelName,
      logger,
      baseUrl,
      exportDefault: !!options.exportDefault,
      structure: options.structure,
      local: !!options.local,
      include: ([] as string[]).concat(options.include || []),
      exclude: ([] as string[]).concat(options.exclude || [], ['node_modules']),
    });
  }
}

await createBarrels(await getArgs().argv)