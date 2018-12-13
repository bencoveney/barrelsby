import fs from "fs";
import path from "path";

import { Directory } from "../fileTree/directory";
import { Location } from "../fileTree/location";
import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { StructureOption } from "../options/options";
import { QuoteCharacter } from "../options/quoteCharacter";
import { convertPathSeparator, thisDirectory } from "../utilities";
import { buildFileSystemBarrel } from "./fileSystem/fileSystem";
import { buildFlatBarrel } from "./flat/flat";
import { addHeaderPrefix } from "./header";
import { loadDirectoryModules } from "./modules";

export function buildBarrels(
  destinations: Directory[],
  quoteCharacter: QuoteCharacter,
  barrelName: string,
  logger: Logger,
  baseUrl: BaseUrl,
  structure: StructureOption | undefined,
  include: string[],
  exclude: string[]
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
      barrelName,
      logger,
      baseUrl,
      include,
      exclude
    )
  );
}

// Build a barrel for the specified directory.
function buildBarrel(
  directory: Directory,
  builder: BarrelBuilder,
  quoteCharacter: QuoteCharacter,
  barrelName: string,
  logger: Logger,
  baseUrl: BaseUrl,
  include: string[],
  exclude: string[]
) {
  logger(`Building barrel @ ${directory.path}`);
  const content = builder(
    directory,
    loadDirectoryModules(directory, logger, include, exclude),
    quoteCharacter,
    logger,
    baseUrl
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
      path: convertedPath
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
  logger: Logger,
  baseUrl: BaseUrl
) => string;

/** Builds the TypeScript */
export function buildImportPath(
  directory: Directory,
  target: Location,
  baseUrl: BaseUrl
): string {
  // If the base URL option is set then imports should be relative to there.
  const startLocation = baseUrl ? baseUrl : directory.path;
  const relativePath = path.relative(startLocation, target.path);
  // Get the route and ensure it's relative
  let directoryPath = path.dirname(relativePath);
  if (directoryPath !== ".") {
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
  return baseUrl ? location.replace(thisDirectory, "") : location;
}

/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export function getBasename(relativePath: string) {
  const strippedTsPath = path.basename(relativePath, ".ts");
  const strippedTsxPath = path.basename(relativePath, ".tsx");

  // Return whichever path is shorter. If they're the same length then nothing was stripped.
  return strippedTsPath.length < strippedTsxPath.length
    ? strippedTsPath
    : strippedTsxPath;
}
