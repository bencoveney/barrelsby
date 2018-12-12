import { buildImportPath } from "../builder";
import { Logger } from "../options/logger";
import { Options } from "../options/options";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";

export function buildFlatBarrel(
  directory: Directory,
  modules: Location[],
  options: Options,
  quoteCharacter: QuoteCharacter,
  logger: Logger
): string {
  return modules.reduce((previous: string, current: Location) => {
    const importPath = buildImportPath(directory, current, options);
    logger(`Including path ${importPath}`);
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter};
`);
  }, "");
}
