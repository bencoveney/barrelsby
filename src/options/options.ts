import { Options } from 'yargs';

export type LocationOption = 'top' | 'below' | 'all' | 'replace' | 'branch';

export enum StructureOption {
  FLAT = 'flat',
  FILESYSTEM = 'filesystem',
}

// Options provided by yargs.
export interface Arguments {
  [x: string]: unknown;
  baseUrl?: string;
  config?: string;
  directory?: string[] | string;
  delete?: boolean;
  exclude?: string[];
  exportDefault?: boolean;
  noHeader?: boolean;
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

export function getOptionsConfig(configParser: any): {
  [key: string]: Options;
} {
  return {
    b: {
      type: 'string',
      alias: 'baseUrl',
      nargs: 1,
      description: "The base url relative to 'directory' for non-relative imports (with tsconfig's baseUrl).",
    },
    c: {
      config: true,
      configParser,
      alias: 'config',
      description: 'The location of the config file.',
    },
    d: {
      type: 'array',
      alias: 'directory',
      description: 'A list of directories to create barrels for.',
      default: ['./'],
    },
    D: {
      type: 'boolean',
      alias: 'delete',
      description: 'Delete existing barrel files.',
      default: false,
    },
    e: {
      type: 'array',
      alias: 'exclude',
      description: 'Excludes any files whose paths match any of the regular expressions.',
    },
    E: {
      type: 'array',
      alias: 'exportDefault',
      description: 'Also export the default export of the file. Currently works only with the `flat` mode.',
    },
    H: {
      type: 'boolean',
      alias: 'noHeader',
      description: 'Do not add a header comment to the top of the barrel file.',
      default: false,
    },
    i: {
      type: 'array',
      alias: 'include',
      description: 'Only include files whose paths match any of the regular expressions.',
    },
    l: {
      type: 'string',
      alias: 'location',
      description: 'The mode for picking barrel file locations',
      choices: ['top', 'below', 'all', 'replace', 'branch'],
      default: 'top',
    },
    L: {
      type: 'boolean',
      alias: 'local',
      description: 'Barrels only include files from same directory.',
      default: false,
    },
    n: {
      type: 'string',
      alias: 'name',
      description: 'The name to give barrel files',
      default: 'index',
    },
    s: {
      type: 'string',
      alias: 'structure',
      description: 'The mode for structuring barrel file exports',
      choices: ['flat', 'filesystem'],
      default: 'flat',
    },
    q: {
      type: 'boolean',
      alias: 'singleQuotes',
      description: 'Use single quotes for paths instead of the default double quotes',
      default: false,
    },
    S: {
      type: 'boolean',
      alias: 'noSemicolon',
      description: 'Omit semicolons from the end of lines in the generated barrel files.',
      default: false,
    },
    V: {
      type: 'boolean',
      alias: 'verbose',
      description: 'Display additional logging information',
      default: false,
    },
  };
}
