import * as path from "path";

import {Directory, indentation, Location, nonAlphaNumeric} from "../utilities";

import {buildImportPath} from "./utilities";

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

export function buildFileSystemBarrel(directory: Directory, modules: Location[]): string {
    const structure: ExportStructure = {};
    let content = "";
    modules.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    modules.forEach((module: Location) => {
        const relativePath = path.relative(directory.path, module.path);
        const directoryPath = path.dirname(relativePath);
        const parts = directoryPath.split(path.sep);
        const alias = relativePath.replace(nonAlphaNumeric, "");
        const importPath = buildImportPath(directory, module);
        content += `import * as ${alias} from "${importPath}";
`;
        const fileName = path.basename(module.name, ".ts");
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
