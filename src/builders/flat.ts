import { buildImportPath } from "../builder";
import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";

export function buildFlatBarrel(
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  logger: Logger,
  baseUrl: BaseUrl
): string {
  return modules.reduce((previous: string, current: Location) => {
    const importPath = buildImportPath(directory, current, baseUrl);
    logger(`Including path ${importPath}`);
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter};
`);
  }, "");
}
