import { BaseUrl } from "./options/baseUrl";
import { Logger } from "./options/logger";
import { SemicolonCharacter } from "./options/noSemicolon";
import { StructureOption } from "./options/options";
import { QuoteCharacter } from "./options/quoteCharacter";
import { Directory, Location } from "./utilities";
export declare function buildBarrels(destinations: Directory[], quoteCharacter: QuoteCharacter, semicolonCharacter: SemicolonCharacter, barrelName: string, logger: Logger, baseUrl: BaseUrl, exportDefault: boolean, structure: StructureOption | undefined, local: boolean, include: string[], exclude: string[]): void;
export declare type BarrelBuilder = (directory: Directory, modules: Location[], quoteCharacter: QuoteCharacter, semicolonCharacter: SemicolonCharacter, logger: Logger, baseUrl: BaseUrl, exportDefault: boolean) => string;
/** Builds the TypeScript */
export declare function buildImportPath(directory: Directory, target: Location, baseUrl: BaseUrl): string;
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export declare function getBasename(relativePath: string): string;
