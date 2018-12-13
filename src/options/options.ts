export type LocationOption = "top" | "below" | "all" | "replace" | "branch";

export type StructureOption = "flat" | "filesystem";

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
  singleQuotes?: boolean;
  structure?: StructureOption;
  version?: boolean;
  verbose?: boolean;
}
