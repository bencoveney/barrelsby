import fs from "fs";
import path from "path";

import { Options } from "./options";
import {
  convertPathSeparator,
  Directory,
  Location,
  thisDirectory
} from "./utilities";

import { buildFileSystemBarrel } from "./builders/fileSystem";
import { buildFlatBarrel } from "./builders/flat";
import { addHeaderPrefix } from "./builders/header";
import { loadDirectoryModules } from "./modules";

export function buildBarrels(
  destinations: Directory[],
  options: Options
): void {
  let builder: BarrelBuilder;
  switch (options.structure) {
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
    buildBarrel(destination, builder, options)
  );
}

// Build a barrel for the specified directory.
function buildBarrel(
  directory: Directory,
  builder: BarrelBuilder,
  options: Options
) {
  options.logger(`Building barrel @ ${directory.path}`);
  const content = builder(
    directory,
    loadDirectoryModules(directory, options),
    options
  );
  const destination = path.join(directory.path, options.barrelName);
  if (content.length === 0) {
    // Skip empty barrels.
    return;
  }
  // Add the header
  const contentWithHeader = addHeaderPrefix(content);
  fs.writeFileSync(destination, contentWithHeader);
  // Update the file tree model with the new barrel.
  if (
    !directory.files.some((file: Location) => file.name === options.barrelName)
  ) {
    const convertedPath = convertPathSeparator(destination);
    const barrel = {
      name: options.barrelName,
      path: convertedPath
    };
    options.logger(`Updating model barrel @ ${convertedPath}`);
    directory.files.push(barrel);
    directory.barrel = barrel;
  }
}

export type BarrelBuilder = (
  directory: Directory,
  modules: Location[],
  options: Options
) => string;

/** Builds the TypeScript */
export function buildImportPath(
  directory: Directory,
  target: Location,
  options: Options
): string {
  // If the base URL option is set then imports should be relative to there.
  const startLocation = options.combinedBaseUrl
    ? options.combinedBaseUrl
    : directory.path;
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
  return stripThisDirectory(convertedLocation, options);
}

function stripThisDirectory(location: string, options: Options) {
  return options.combinedBaseUrl
    ? location.replace(thisDirectory, "")
    : location;
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
