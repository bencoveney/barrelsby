import { Directory } from "../fileTree/directory";
import { Location } from "../fileTree/location";
import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { StructureOption } from "../options/options";
import { QuoteCharacter } from "../options/quoteCharacter";
export declare function buildBarrels(destinations: Directory[], quoteCharacter: QuoteCharacter, barrelName: string, logger: Logger, baseUrl: BaseUrl, structure: StructureOption | undefined, include: string[], exclude: string[]): void;
export declare type BarrelBuilder = (directory: Directory, modules: Location[], quoteCharacter: QuoteCharacter, logger: Logger, baseUrl: BaseUrl) => string;
/** Builds the TypeScript */
export declare function buildImportPath(directory: Directory, target: Location, baseUrl: BaseUrl): string;
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export declare function getBasename(relativePath: string): string;
