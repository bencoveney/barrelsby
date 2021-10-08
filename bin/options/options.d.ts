import { Options } from "yargs";
export declare type LocationOption = "top" | "below" | "all" | "replace" | "branch";
export declare type StructureOption = "flat" | "filesystem";
export interface Arguments {
    [x: string]: unknown;
    baseUrl?: string;
    config?: string;
    directory?: string[] | string;
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
    extension?: boolean;
}
export declare function getOptionsConfig(configParser: any): {
    [key: string]: Options;
};
