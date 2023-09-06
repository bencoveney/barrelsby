import { buildImportPath, getBasename } from '../builder';
import { BaseUrl } from '../options/baseUrl';
import { Logger } from '../options/logger';
import { SemicolonCharacter } from '../options/noSemicolon';
import { QuoteCharacter } from '../options/quoteCharacter';
import { Directory } from '../interfaces/directory.interface';
import { FileTreeLocation } from '../interfaces/location.interface';

function dotOrDashStrToCamelCase(str: string): string {
  // massage any `example.file.name` to `exampleFileName`
  return str.replace(/[-_.]([a-z0-9])/g, (_, group) => group.toUpperCase());
}

function arrayToCamelCase(arr: string[]) {
  let camelCaseStr = arr[0].toLowerCase();
  for (let i = 1; i < arr.length; i++) {
    camelCaseStr += arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return camelCaseStr;
}

export function buildFlatBarrel(
  directory: Directory,
  modules: FileTreeLocation[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean,
  fullPathname: boolean
): string {
  return modules.reduce((previous: string, current: FileTreeLocation) => {
    const importPath = buildImportPath(directory, current, baseUrl);
    logger.debug(`Including path ${importPath}`);
    if (exportDefault) {
      const filename = getBasename(current.path);

      // expect if `importPath` is './example/of/path/file.full-name' and split to ['example', 'of', 'path', 'fileFullName']
      const arryPath = importPath
        .split('/')
        .slice(1)
        .map(x => dotOrDashStrToCamelCase(x));
      // expect ['example', 'of', 'path', 'name'] transform to exampleOfPathName
      const camelCaseFullPathname = arrayToCamelCase(arryPath);

      const defaultName = fullPathname ? camelCaseFullPathname : dotOrDashStrToCamelCase(filename);

      logger.debug(`camelCaseFullPathname: ${camelCaseFullPathname}`);
      logger.debug(`Default Name ${defaultName}`);

      previous += `export { default as ${defaultName} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
    }
    return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
  }, '');
}
