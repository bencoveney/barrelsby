"use strict";
const path = require("path");
const utilities_1 = require("../utilities");
const utilities_2 = require("./utilities");
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
function buildFileSystemBarrel(directory, modules) {
    const structure = {};
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
    modules.forEach((module) => {
        const relativePath = path.relative(directory.path, module.path);
        const directoryPath = path.dirname(relativePath);
        const parts = directoryPath.split(path.sep);
        const alias = relativePath.replace(utilities_1.nonAlphaNumeric, "");
        const importPath = utilities_2.buildImportPath(directory, module);
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