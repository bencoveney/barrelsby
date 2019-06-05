export type LocationOption = "top" | "below" | "all" | "replace" | "branch";

export type StructureOption = "flat" | "filesystem";

// Options provided by yargs.
export interface Arguments {
  baseUrl?: string;
  config?: string;
  directory?: string;
  delete?: boolean;
  exclude?: string[];
  exportDefault?: boolean;
  help?: boolean;
  include?: string[];
  local?: boolean;
  location?: LocationOption;
  name?: string;
  noSemicolon?: boolean;
  singleQuotes?: boolean;
  structure?: StructureOption;
  version?: boolean;
  verbose?: boolean;
}
