import { indentation, nonAlphaNumeric } from '../constants.mjs';
import { FileTreeLocation } from '../../interfaces/location.interface.mjs';
import { Directory } from '../../interfaces/directory.interface.mjs';
import { Signale } from 'signale';
import { BaseUrl, QuoteCharacter, SemicolonCharacter } from '../../interfaces/helper.types.mjs';
import { buildImportPath } from '../build-barrel.mjs';
import { basename, dirname, relative, sep } from 'node:path';

function stringify(structure: ExportStructure, previousIndentation: string): string {
  const nextIndentation = previousIndentation + indentation;
  let content = '';
  for (const key of Object.keys(structure).sort()) {
    content += `
${nextIndentation}${key}: `;
    const exported = structure[key];
    if (typeof exported === 'string') {
      content += exported;
    } else {
      content += stringify(exported, nextIndentation);
    }
    content += ',';
  }
  return `{${content}
${previousIndentation}}`;
}

interface ExportStructure {
  [directoryName: string]: ExportStructure | string;
}

function buildStructureSubsection(structure: ExportStructure, pathParts: string[], name: string, reference: string) {
  const pathPart = pathParts.shift() as string;
  let subsection: ExportStructure = pathPart === '.' ? structure : (structure[pathPart] as ExportStructure);
  if (!subsection) {
    subsection = {};
    structure[pathPart] = subsection;
  }
  if (pathParts.length === 0) {
    subsection[name] = reference;
  } else {
    buildStructureSubsection(subsection, pathParts, name, reference);
  }
}

interface Import {
  module: FileTreeLocation;
  path: string;
}

// Comparator for alphabetically sorting imports by path.
// Does not need to check for equality, will only be used on distinct paths.
function compareImports(a: Import, b: Import): number {
  return a.path < b.path ? -1 : 1;
}

export function buildFileSystemBarrel(
        directory: Directory,
        modules: FileTreeLocation[],
        quoteCharacter: QuoteCharacter,
        semicolonCharacter: SemicolonCharacter,
        _: Signale, // Not used
        baseUrl: BaseUrl
): string {
  const structure: ExportStructure = {};
  let content = '';
  modules
          .map(
                  (module: FileTreeLocation): Import => ({
                    module,
                    path: buildImportPath(directory, module, baseUrl),
                  })
          )
          .sort(compareImports)
          .forEach((imported: Import): void => {
            const relativePath = relative(directory.path, imported.module.path);
            const directoryPath = dirname(relativePath);
            const parts = directoryPath.split(sep);
            const alias = relativePath.replace(nonAlphaNumeric, '');
            content += `import * as ${alias} from ${quoteCharacter}${imported.path}${quoteCharacter}${semicolonCharacter}
`;
            const fileName = basename(imported.module.name, '.ts');
            buildStructureSubsection(structure, parts, fileName, alias);
          });
  for (const key of Object.keys(structure).sort()) {
    const exported = structure[key];
    if (typeof exported === 'string') {
      content += `export {${exported} as ${key}}${semicolonCharacter}
`;
    } else {
      content += `export const ${key} = ${stringify(exported, '')}${semicolonCharacter}
`;
    }
  }
  return content;
}