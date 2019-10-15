import path from "path";

import { buildImportPath } from "../builder";
import { BaseUrl } from "../options/baseUrl";
import { Logger } from "../options/logger";
import { SemicolonCharacter } from "../options/noSemicolon";
import { QuoteCharacter } from "../options/quoteCharacter";
import {
  Directory,
  indentation,
  Location,
  nonAlphaNumeric
} from "../utilities";

function stringify(
  structure: ExportStructure,
  previousIndentation: string
): string {
  const nextIndentation = previousIndentation + indentation;
  let content = "";
  for (const key of Object.keys(structure).sort()) {
    content += `
${nextIndentation}${key}: `;
    const exported = structure[key];
    if (typeof exported === "string") {
      content += exported;
    } else {
      content += stringify(exported, nextIndentation);
    }
    content += ",";
  }
  return `{${content}
${previousIndentation}}`;
}

interface ExportStructure {
  [directoryName: string]: ExportStructure | string;
}

function buildStructureSubsection(
  structure: ExportStructure,
  pathParts: string[],
  name: string,
  reference: string
) {
  const pathPart = pathParts.shift() as string;
  let subsection: ExportStructure =
    pathPart === "." ? structure : (structure[pathPart] as ExportStructure);
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
  module: Location;
  path: string;
}

// Comparator for alphabetically sorting imports by path.
// Does not need to check for equality, will only be used on distinct paths.
function compareImports(a: Import, b: Import): number {
  return a.path < b.path ? -1 : 1;
}

export function buildFileSystemBarrel(
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  _: Logger, // Not used
  baseUrl: BaseUrl
): string {
  const structure: ExportStructure = {};
  let content = "";
  modules
    .map(
      (module: Location): Import => ({
        module,
        path: buildImportPath(directory, module, baseUrl)
      })
    )
    .sort(compareImports)
    .forEach((imported: Import): void => {
      const relativePath = path.relative(directory.path, imported.module.path);
      const directoryPath = path.dirname(relativePath);
      const parts = directoryPath.split(path.sep);
      const alias = relativePath.replace(nonAlphaNumeric, "");
      content += `import * as ${alias} from ${quoteCharacter}${imported.path}${quoteCharacter}${semicolonCharacter}
`;
      const fileName = path.basename(imported.module.name, ".ts");
      buildStructureSubsection(structure, parts, fileName, alias);
    });
  for (const key of Object.keys(structure).sort()) {
    const exported = structure[key];
    if (typeof exported === "string") {
      content += `export {${exported} as ${key}}${semicolonCharacter}
`;
    } else {
      content += `export const ${key} = ${stringify(
        exported,
        ""
      )}${semicolonCharacter}
`;
    }
  }
  return content;
}
