import path from "path";

import { isTypeScriptFile } from "./utilities";

export type LocationOption = "top" | "below" | "all" | "replace" | "branch";

export type StructureOption = "flat" | "filesystem";

export type QuoteCharacter = '"' | "'";

// Options provided by yargs.
export interface Arguments {
  baseUrl?: string;
  config?: string;
  directory?: string;
  delete?: boolean;
  exclude?: string[];
  help?: boolean;
  include?: string[];
  location?: LocationOption;
  name?: string;
  structure?: StructureOption;
  version?: boolean;
  verbose?: boolean;
}

// Calculated options.
interface CalculatedOptions {
  barrelName: string;
  logger: (message: string) => void;
  rootPath: string;
  quoteCharacter: QuoteCharacter;
  combinedBaseUrl?: string;
}

export type Options = Arguments & CalculatedOptions;

export function getOptions(options: any): Options {
  // TODO: A lot of these options would be better passed only to the places they are needed, rather than as one
  // huge blob.

  options.logger = options.verbose
    ? // tslint:disable-next-line:no-console
      console.log
    : new Function("return void(0);");

  options.rootPath = path.resolve(options.directory);

  options.quoteCharacter = options.singleQuotes ? "'" : '"';

  // Resolve barrel name.
  const nameArgument: string = options.name;
  options.barrelName = nameArgument.match(isTypeScriptFile)
    ? nameArgument
    : `${nameArgument}.ts`;
  options.logger(`Using name ${options.barrelName}`);

  // Resolve base url.
  if (options.baseUrl) {
    options.combinedBaseUrl = path.join(options.rootPath, options.baseUrl);
  }

  return options;
}
