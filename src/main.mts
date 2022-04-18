import { Arguments } from './utils/args.mjs';
import { getLogger } from './utils/logger.mjs';
import { join, resolve } from 'node:path';

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
    const rootTree = 
  }
}