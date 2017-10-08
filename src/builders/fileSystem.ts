import * as path from "path";

import {Directory, indentation, Location, nonAlphaNumeric} from "../utilities";

import {buildImportPath} from "../builder";
import {Options} from "../options";

function stringify(structure: ExportStructure, previousIndentation: string): string {
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

function buildStructureSubsection(structure: ExportStructure, pathParts: string[], name: string, reference: string) {
    const pathPart = pathParts.shift() as string;
    let subsection: ExportStructure = pathPart === "." ? structure : structure[pathPart] as ExportStructure;
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

export function buildFileSystemBarrel(directory: Directory, modules: Location[], options: Options): string {
    const structure: ExportStructure = {};
    let content = "";
    modules
        .map((module: Location): Import => ({ module, path: buildImportPath(directory, module) }))
        .sort(compareImports)
        .forEach((imported: Import): void => {
            const relativePath = path.relative(directory.path, imported.module.path);
            const directoryPath = path.dirname(relativePath);
            const parts = directoryPath.split(path.sep);
            const alias = relativePath.replace(nonAlphaNumeric, "");
            content += `import * as ${alias} from ${options.quoteCharacter}${imported.path}${options.quoteCharacter};
`;
            const fileName = path.basename(imported.module.name, ".ts");
            buildStructureSubsection(structure, parts, fileName, alias);
        });
    for (const key of Object.keys(structure).sort()) {
        const exported = structure[key];
        if (typeof exported === "string") {
            content += `export {${exported} as ${key}};
`;
        } else {
            content += `export const ${key} = ${stringify(exported, "")};
`;
        }
    }
    return content;
}
