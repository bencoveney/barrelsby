import { Directory } from "../../fileTree/directory";
import { Location } from "../../fileTree/location";
import { BaseUrl } from "../../options/baseUrl";
import { Logger } from "../../options/logger";
import { QuoteCharacter } from "../../options/quoteCharacter";
export declare function buildFileSystemBarrel(directory: Directory, modules: Location[], quoteCharacter: QuoteCharacter, _: Logger, // Not used
baseUrl: BaseUrl): string;
