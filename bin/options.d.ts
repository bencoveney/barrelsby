export declare type LocationOption = "top" | "below" | "all" | "replace" | "branch";
export declare type StructureOption = "flat" | "filesystem";
export declare type QuoteCharacter = '"' | "'";
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
interface CalculatedOptions {
    barrelName: string;
    logger: (message: string) => void;
    rootPath: string;
    quoteCharacter: QuoteCharacter;
    combinedBaseUrl?: string;
}
export declare type Options = Arguments & CalculatedOptions;
export declare function getOptions(options: any): Options;
export {};
