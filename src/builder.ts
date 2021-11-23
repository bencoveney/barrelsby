import path from "path";

import { buildFileSystemBarrel } from "./builders/fileSystem";
import { buildFlatBarrel } from "./builders/flat";
import { BaseUrl } from "./options/baseUrl";
import { Logger } from "./options/logger";
import { SemicolonCharacter } from "./options/noSemicolon";
import { StructureOption } from "./options/options";
import { QuoteCharacter } from "./options/quoteCharacter";
import {
  convertPathSeparator,
  Directory,
  Location,
  thisDirectory,
} from "./utilities";
import { BuildBarrel } from "./tasks/BuildBarrel";

export class Builder {
  private readonly params;
  constructor(params: {
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
  }) {
    this.params = params;
  }

  async build(): Promise<void> {
    let builder: BarrelBuilder;
    switch (this.params.structure) {
      default:
      case "flat":
        builder = buildFlatBarrel;
        break;
      case "filesystem":
        builder = buildFileSystemBarrel;
        break;
    }

    try {
      // Build the barrels.
      this.params?.destinations?.forEach(
        (destination: Directory) =>
          new BuildBarrel(
            destination,
            builder,
            this.params.quoteCharacter,
            this.params.semicolonCharacter,
            this.params.barrelName,
            this.params.logger,
            this.params.baseUrl,
            this.params.exportDefault,
            this.params.local,
            this.params.include,
            this.params.exclude
          )
      );
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
    }
  }
}

export type BarrelBuilder = (
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean
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
  const mayBeSuffix = [".ts", ".tsx", ".d.ts"];
  let mayBePath = relativePath;
  mayBeSuffix.map((suffix) => {
    const tmpPath = path.basename(relativePath, suffix);
    if (tmpPath.length < mayBePath.length) {
      mayBePath = tmpPath;
    }
  });
  // Return whichever path is shorter. If they're the same length then nothing was stripped.
  return mayBePath;
}
