import {Directory} from '../interfaces/directory.interface.mjs';
import {Signale} from 'signale';
import {StructureOption} from './args.mjs';
import {BaseUrl, QuoteCharacter, SemicolonCharacter} from '../interfaces/helper.types.mjs';
import {buildFileSystemBarrel} from "./builders/filesystem.mjs";
import {FileTreeLocation} from "../interfaces/location.interface.mjs";
import {basename, dirname, join, relative, sep} from 'node:path';
import {convertPathSeparator} from "./directory.mjs";
import {thisDirectory} from "./constants.mjs";
import {buildFlatBarrel} from "./builders/flat.mjs";
import {writeFileSync} from 'node:fs';
import {loadDirectoryModules} from "./modules.mjs";

export const build = (params: {
  destinations: Directory[];
  quoteCharacter: QuoteCharacter;
  semicolonCharacter: SemicolonCharacter;
  barrelName: string;
  logger: Signale;
  baseUrl: BaseUrl;
  exportDefault: boolean;
  structure: StructureOption | undefined;
  local: boolean;
  include: string[];
  exclude: string[];
}): void => {
  try {
    // Build the barrels.
    params?.destinations?.forEach((destination: Directory) =>
      buildBarrel({
        directory: destination,
        barrelType: params.structure ?? StructureOption.FLAT,
        quoteCharacter: params.quoteCharacter,
        semicolonCharacter: params.semicolonCharacter,
        barrelName: params.barrelName,
        logger: params.logger,
        baseUrl: params.baseUrl,
        exportDefault: params.exportDefault,
        local: params.local,
        include: params.include,
        exclude: params.exclude,
      })
    );
  } catch (e) {
    // tslint:disable-next-line:no-console
    params.logger.error(e);
  }
};

export type BarrelBuilder = (
  directory: Directory,
  modules: FileTreeLocation[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Signale,
  baseUrl: BaseUrl,
  exportDefault: boolean
) => string;

/** Builds the TypeScript */
export function buildImportPath(directory: Directory, target: FileTreeLocation, baseUrl: BaseUrl): string {
  // If the base URL option is set then imports should be relative to there.
  const startLocation = baseUrl ? baseUrl : directory.path;
  const relativePath = relative(startLocation, target.path);
  // Get the route and ensure it's relative
  let directoryPath = dirname(relativePath);
  if (directoryPath !== '.') {
    directoryPath = `.${sep}${directoryPath}`;
  }
  // Strip off the .ts or .tsx from the file name.
  const fileName = getBasename(relativePath);
  // Build the final path string. Use posix-style seperators.
  const location = `${directoryPath}${sep}${fileName}`;
  const convertedLocation = convertPathSeparator(location);
  return stripThisDirectory(convertedLocation, baseUrl);
}

function stripThisDirectory(location: string, baseUrl: BaseUrl) {
  return baseUrl ? location.replace(thisDirectory, '') : location;
}

/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export function getBasename(relativePath: string) {
  const mayBeSuffix = ['.ts', '.tsx', '.d.ts'];
  let mayBePath = relativePath;
  mayBeSuffix.map(suffix => {
    const tmpPath = basename(relativePath, suffix);
    if (tmpPath.length < mayBePath.length) {
      mayBePath = tmpPath;
    }
  });
  // Return whichever path is shorter. If they're the same length then nothing was stripped.
  return mayBePath;
}

export const buildBarrel = ({
  directory,
  barrelType,
  quoteCharacter,
  semicolonCharacter,
  barrelName,
  logger,
  baseUrl,
  exportDefault,
  local,
  include,
  exclude,
}: {
  directory: Directory;
  barrelType: StructureOption;
  quoteCharacter: QuoteCharacter;
  semicolonCharacter: SemicolonCharacter;
  barrelName: string;
  logger: Signale;
  baseUrl: BaseUrl;
  exportDefault: boolean;
  local: boolean;
  include: string[];
  exclude: string[];
}) => {
  logger.debug(`Building barrel @ ${directory.path}`);
  let content = '';
  if (barrelType === StructureOption.FILESYSTEM) {
    content = buildFileSystemBarrel(
      directory,
      loadDirectoryModules(directory, logger, include, exclude, local),
      quoteCharacter,
      semicolonCharacter,
      logger,
      baseUrl
    );
  } else if (barrelType === StructureOption.FLAT) {
    content = buildFlatBarrel(
      directory,
      loadDirectoryModules(directory, logger, include, exclude, local),
      quoteCharacter,
      semicolonCharacter,
      logger,
      baseUrl,
      exportDefault
    );
  } else {
    throw new Error('No barrel type provided... this is likely a code error');
  }

  const destination = join(directory.path, barrelName);
  if (content.length === 0) {
    // Skip empty barrels.
    return;
  }
  // Add the header
  const contentWithHeader = addHeaderPrefix(content);
  writeFileSync(destination, contentWithHeader);
  // Update the file tree model with the new barrel.
  if (!directory.files.some(file => file.name === barrelName)) {
    const convertedPath = convertPathSeparator(destination);
    const barrel = {
      name: barrelName,
      path: convertedPath,
    };
    logger.debug(`Updating model barrel @ ${convertedPath}`);
    directory.files.push(barrel);
    directory.barrel = barrel;
  }
};

export function addHeaderPrefix(content: string): string {
  return `/**
 * @file Automatically generated by barrelsby.
 */
${content}`;
}