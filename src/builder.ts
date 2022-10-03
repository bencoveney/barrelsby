import path from 'path';
import { BaseUrl } from './options/baseUrl';
import { Logger } from './options/logger';
import { SemicolonCharacter } from './options/noSemicolon';
import { StructureOption } from './options/options';
import { QuoteCharacter } from './options/quoteCharacter';
import { convertPathSeparator, thisDirectory } from './utilities';
import { buildBarrel } from './tasks/BuildBarrel';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';

export const build = (params: {
  addHeader: boolean;
  destinations: Directory[];
  quoteCharacter: QuoteCharacter;
  semicolonCharacter: SemicolonCharacter;
  barrelName: string;
  logger: Logger;
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
        addHeader: params.addHeader,
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
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean
) => string;

/** Builds the TypeScript */
export function buildImportPath(directory: Directory, target: FileTreeLocation, baseUrl: BaseUrl): string {
  // If the base URL option is set then imports should be relative to there.
  const startLocation = baseUrl ? baseUrl : directory.path;
  const relativePath = path.relative(startLocation, target.path);
  // Get the route and ensure it's relative
  let directoryPath = path.dirname(relativePath);
  if (directoryPath !== '.') {
    directoryPath = `.${path.sep}${directoryPath}`;
  }
  // Strip off the .ts or .tsx from the file name.
  const fileName = getBasename(relativePath);
  // Build the final path string. Use posix-style seperators.
  const location = `${directoryPath}${path.sep}${fileName}`;
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
    const tmpPath = path.basename(relativePath, suffix);
    if (tmpPath.length < mayBePath.length) {
      mayBePath = tmpPath;
    }
  });
  // Return whichever path is shorter. If they're the same length then nothing was stripped.
  return mayBePath;
}
