"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const utilities_1 = require("../utilities");
const builder_1 = require("../builder");
function stringify(structure, previousIndentation) {
    const nextIndentation = previousIndentation + utilities_1.indentation;
    let content = "";
    for (const key of Object.keys(structure).sort()) {
        content += `
${nextIndentation}${key}: `;
        const exported = structure[key];
        if (typeof exported === "string") {
            content += exported;
        }
        else {
            content += stringify(exported, nextIndentation);
        }
        content += ",";
    }
    return `{${content}
${previousIndentation}}`;
}
function buildStructureSubsection(structure, pathParts, name, reference) {
    const pathPart = pathParts.shift();
    let subsection = pathPart === "." ? structure : structure[pathPart];
    if (!subsection) {
        subsection = {};
        structure[pathPart] = subsection;
    }
    if (pathParts.length === 0) {
        subsection[name] = reference;
    }
    else {
        buildStructureSubsection(subsection, pathParts, name, reference);
    }
}
// Comparator for alphabetically sorting imports by path.
// Does not need to check for equality, will only be used on distinct paths.
function compareImports(a, b) {
    return a.path < b.path ? -1 : 1;
}
function buildFileSystemBarrel(directory, modules, options) {
    const structure = {};
    let content = "";
    modules
        .map((module) => ({ module, path: builder_1.buildImportPath(directory, module) }))
        .sort(compareImports)
        .forEach((imported) => {
        const relativePath = path.relative(directory.path, imported.module.path);
        const directoryPath = path.dirname(relativePath);
        const parts = directoryPath.split(path.sep);
        const alias = relativePath.replace(utilities_1.nonAlphaNumeric, "");
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
        }
        else {
            content += `export const ${key} = ${stringify(exported, "")};
`;
        }
    }
    return content;
}
exports.buildFileSystemBarrel = buildFileSystemBarrel;
//# sourceMappingURL=fileSystem.js.map