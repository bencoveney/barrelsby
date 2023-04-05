import { convertPathSeparator } from '../utilities';
import { QuoteCharacter } from '../options/quoteCharacter';
import { SemicolonCharacter } from '../options/noSemicolon';
import { Logger } from '../options/logger';
import { BaseUrl } from '../options/baseUrl';
import { loadDirectoryModules } from '../modules';
import path from 'path';
import { addHeaderPrefix } from '../builders/header';
import fs from 'fs';
import { Directory } from '../interfaces/directory.interface';
import { buildFileSystemBarrel } from '../builders/fileSystem';
import { buildFlatBarrel } from '../builders/flat';
import { StructureOption } from '../options/options';

export const buildBarrel = ({
  addHeader,
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
  addHeader: boolean;
  directory: Directory;
  barrelType: StructureOption;
  quoteCharacter: QuoteCharacter;
  semicolonCharacter: SemicolonCharacter;
  barrelName: string;
  logger: Logger;
  baseUrl: BaseUrl;
  exportDefault: boolean;
  local: boolean;
  include: string[];
  exclude: string[];
}) => {

  logger.debug(`Building barrel @ ${directory.path}`);

  let content: string = '';

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

  const destination = path.join(directory.path, barrelName);

  if (content.length === 0) {

    // Skip empty barrels.
    return;

  }

  // Add the header
  const contentWithHeader = addHeader ? addHeaderPrefix(content) : content;

  fs.writeFileSync(destination, contentWithHeader);

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
