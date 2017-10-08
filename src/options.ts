import * as path from "path";
import * as Yargs from "yargs";

import {isTypeScriptFile} from "./utilities";

export type LocationOption = "top" | "below" | "all" | "replace" | "branch";

export type StructureOption = "flat" | "filesystem";

export type QuoteCharacter = "\"" | "'";

// Options provided by yargs.
interface Arguments {
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
}

export type Options = Arguments & CalculatedOptions;

function setUpArguments(): { argv: any } {
    return Yargs
        .usage("Usage: barrelsby [options]")
        .example("barrelsby", "Run barrelsby")

        .config("c")
        .alias("c", "config")
        .describe("c", "The location of the config file.")

        .string("d")
        .alias("d", "directory")
        .nargs("d", 1)
        .describe("d", "The directory to create barrels for.")
        .default("d", "./")

        .boolean("D")
        .alias("D", "delete")
        .describe("D", "Delete existing barrel files.")
        .default("D", false)

        .array("e")
        .alias("e", "exclude")
        .describe("e", "Excludes any files whose paths match any of the regular expressions.")

        .help("h")
        .alias("h", "help")
        .default("h", false)

        .array("i")
        .alias("i", "include")
        .describe("i", "Only include files whose paths match any of the regular expressions.")

        .string("l")
        .alias("l", "location")
        .describe("l", "The mode for picking barrel file locations")
        .choices("l", ["top", "below", "all", "replace", "branch"])
        .default("l", "top")

        .string("n")
        .alias("n", "name")
        .describe("n", "The name to give barrel files")
        .default("n", "index")

        .string("s")
        .alias("s", "structure")
        .describe("s", "The mode for structuring barrel file exports")
        .choices("s", ["flat", "filesystem"])
        .default("s", "flat")

        .boolean("q")
        .alias("q", "singleQuotes")
        .describe("q", "Use single quotes for paths instead of the default double quotes")
        .default("q", false)

        .version()
        .alias("v", "version")
        .default("v", false)

        .boolean("V")
        .alias("V", "verbose")
        .describe("V", "Display additional logging information")
        .default("V", false);
}

export function getOptions(): Options {
    const options = setUpArguments().argv;

    options.logger = options.verbose ? console.log : new Function("return void(0);");

    options.rootPath = path.resolve(options.directory);

    options.quoteCharacter = options.singleQuotes ? "'" : "\"";

    // Resolve barrel name.
    const nameArgument: string = options.name;
    options.barrelName = nameArgument.match(isTypeScriptFile) ? nameArgument : `${nameArgument}.ts`;
    options.logger(`Using name ${options.barrelName}`);

    return options;
}
