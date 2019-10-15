import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { SemicolonCharacter } from "../options/noSemicolon";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";
export declare function buildFlatBarrel(directory: Directory, modules: Location[], quoteCharacter: QuoteCharacter, semicolonCharacter: SemicolonCharacter, logger: Logger, baseUrl: BaseUrl, exportDefault: boolean): string;
