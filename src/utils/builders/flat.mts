import {Directory} from "../../interfaces/directory.interface.mjs";
import {FileTreeLocation} from "../../interfaces/location.interface.mjs";
import {BaseUrl, QuoteCharacter, SemicolonCharacter} from "../../interfaces/helper.types.mjs";
import {Signale} from "signale";
import {buildImportPath, getBasename} from "../build-barrel.mjs";

export function buildFlatBarrel(
  directory: Directory,
  modules: FileTreeLocation[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Signale,
  baseUrl: BaseUrl,
  exportDefault: boolean
): string {
  return modules.reduce((previous: string, current: FileTreeLocation) => {
    const importPath = buildImportPath(directory, current, baseUrl);
    logger.debug(`Including path ${importPath}`);
    if (exportDefault) {
      const filename = getBasename(current.path);
      previous += `export { default as ${filename} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
    }
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
  }, '');
}