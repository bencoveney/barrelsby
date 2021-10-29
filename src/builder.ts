import fs from "fs";
import path from "path";

import { buildFileSystemBarrel } from "./builders/fileSystem";
import { buildFlatBarrel } from "./builders/flat";
import { addHeaderPrefix } from "./builders/header";
import { loadDirectoryModules } from "./modules";
import { BaseUrl } from "./options/baseUrl";
import { Logger } from "./options/logger";
import { SemicolonCharacter } from "./options/noSemicolon";
import { StructureOption } from "./options/options";
import { QuoteCharacter } from "./options/quoteCharacter";
import {
  compiledExtensions,
  convertPathSeparator,
  Directory,
  Location,
  thisDirectory,
} from "./utilities";

export function buildBarrels(
  destinations: Directory[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  barrelName: string,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean,
  structure: StructureOption | undefined,
  local: boolean,
  include: string[],
  exclude: string[],
  extension: boolean
): void {
  let builder: BarrelBuilder;
  switch (structure) {
    default:
    case "flat":
      builder = buildFlatBarrel;
      break;
    case "filesystem":
      builder = buildFileSystemBarrel;
      break;
  }
  // Build the barrels.
  destinations.forEach((destination: Directory) =>
    buildBarrel(
      destination,
      builder,
      quoteCharacter,
      semicolonCharacter,
      barrelName,
      logger,
      baseUrl,
      exportDefault,
      local,
      include,
      exclude,
      extension
    )
  );
}

// Build a barrel for the specified directory.
function buildBarrel(
  directory: Directory,
  builder: BarrelBuilder,
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  barrelName: string,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean,
  local: boolean,
  include: string[],
  exclude: string[],
  extension: boolean
) {
  logger(`Building barrel @ ${directory.path}`);
  const content = builder(
    directory,
    loadDirectoryModules(directory, logger, include, exclude, local),
    quoteCharacter,
    semicolonCharacter,
    logger,
    baseUrl,
    exportDefault,
    extension
  );
  const destination = path.join(directory.path, barrelName);
  if (content.length === 0) {
    // Skip empty barrels.
    return;
  }
  // Add the header
  const contentWithHeader = addHeaderPrefix(content);
  fs.writeFileSync(destination, contentWithHeader);
  // Update the file tree model with the new barrel.
  if (!directory.files.some((file: Location) => file.name === barrelName)) {
    const convertedPath = convertPathSeparator(destination);
    const barrel = {
      name: barrelName,
      path: convertedPath,
    };
    logger(`Updating model barrel @ ${convertedPath}`);
    directory.files.push(barrel);
    directory.barrel = barrel;
  }
}

export type BarrelBuilder = (
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean,
  extension: boolean
) => string;

/** Builds the TypeScript */
export function buildImportPath(
  directory: Directory,
  target: Location,
  baseUrl: BaseUrl,
  extension: boolean
): string {
  // If the base URL option is set then imports should be relative to there.
  const startLocation = baseUrl ? baseUrl : directory.path;
  const relativePath = path.relative(startLocation, target.path);
  // Get the route and ensure it's relative
  let directoryPath = path.dirname(relativePath);
  if (directoryPath !== ".") {
    directoryPath = `.${path.sep}${directoryPath}`;
  }

  let fileName;

  if (extension) {
    // Replace extension with compiled version if possible, or leave extension.
    fileName =
      getBaseNameWithCompiledExtension(relativePath) ??
      path.basename(relativePath);
  } else {
    // Strip off the .ts or .tsx from the file name.
    fileName = getBaseNameWithoutExtension(relativePath);
  }

  // Build the final path string. Use posix-style seperators.
  const location = `${directoryPath}${path.sep}${fileName}`;
  const convertedLocation = convertPathSeparator(location);
  return stripThisDirectory(convertedLocation, baseUrl);
}

function stripThisDirectory(location: string, baseUrl: BaseUrl) {
  return baseUrl ? location.replace(thisDirectory, "") : location;
}

/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export function getBaseNameWithoutExtension(relativePath: string) {
  const mayBeSuffix = [".ts", ".tsx", ".d.ts"];
  let mayBePath = relativePath;
  mayBeSuffix.forEach((suffix) => {
    const tmpPath = path.basename(relativePath, suffix);
    if (tmpPath.length < mayBePath.length) {
      mayBePath = tmpPath;
    }
  });
  // Return whichever path is shorter. If they're the same length then nothing was stripped.
  return mayBePath;
}

/** Keep extension or replace with with js compatible suffix if possible. */
function getBaseNameWithCompiledExtension(
  suffixedPath: string
): string | undefined {
  let fileName;

  Object.keys(compiledExtensions).forEach((suffix) => {
    if (path.basename(suffixedPath, suffix) < path.basename(suffixedPath)) {
      // Remove and append the associated compiled file extension
      fileName =
        path.basename(suffixedPath, suffix) + compiledExtensions[suffix];
    }
  });
  return fileName;
}
