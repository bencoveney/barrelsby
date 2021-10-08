import { buildImportPath, getBaseNameWithoutExtension } from "../builder";
import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { SemicolonCharacter } from "../options/noSemicolon";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";

export function buildFlatBarrel(
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean,
  extension: boolean
): string {
  return modules.reduce((previous: string, current: Location) => {
    const importPath = buildImportPath(directory, current, baseUrl, extension);
    logger(`Including path ${importPath}`);
    if (exportDefault) {
      const filename = getBaseNameWithoutExtension(current.path);
      previous += `export { default as ${filename} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
    }
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
  }, "");
}
