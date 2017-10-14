import * as path from "path";

import {buildImportPath} from "../builder";
import {Options} from "../options";
import {Directory, indentation, Location, nonAlphaNumeric} from "../utilities";

/**
 * Builds nested output for the specified structure subsection.
 * @param structure The structure of the directory to build output for.
 * @param previousIndentation The indentation at the previous level.
 * @returns The compiled output.
 */
function stringify(structure: ExportStructure, previousIndentation: string): string {
    // Determine the new indentation level.
    const nextIndentation = previousIndentation + indentation;

    // Loop through the directory and build an object literal.
    let content = "";
    for (const key of Object.keys(structure).sort()) {
        // Create the object key.
        content += `
${nextIndentation}${key}: `;

        // Create the object value
        const exported = structure[key];
        if (typeof exported === "string") {
            // Its an identifier.
            content += exported;
        } else {
            // Its a further structure.
            content += stringify(exported, nextIndentation);
        }
        content += ",";
    }

    return `{${content}
${previousIndentation}}`;
}

/** The structure of the exports from the barrel. */
interface ExportStructure {
    /**
     * Maps the directory name (could be "." to signify this directory) to the content, either
     * another directory structure or a module.
     */
    [directoryName: string]: ExportStructure | string;
}

/**
 * Compiles the module path into the export structure.
 * @param structure The export structure being compiled.
 * @param pathParts The parts of the path to the module.
 * @param name The file name for the module.
 * @param reference An idenfier that can be used to refer to the module.
 */
function buildStructureSubsection(structure: ExportStructure, pathParts: string[], name: string, reference: string) {
    // Move on to the next part of the path.
    const pathPart = pathParts.shift() as string;

    // Work out where the module should live.
    let subsection: ExportStructure = pathPart === "." ? structure : structure[pathPart] as ExportStructure;

    // If we are targeting a part of the structure that doesn't exist yet, create it.
    if (!subsection) {
        subsection = {};
        structure[pathPart] = subsection;
    }

    if (pathParts.length === 0) {
        // If we have reached the end of the path, insert the identifier.
        subsection[name] = reference;
    } else {
        // If we aren't at the bottom yet, keep on building.
        buildStructureSubsection(subsection, pathParts, name, reference);
    }
}

/** An imported module into the barrel. */
interface Import {
    /** The module being imported. */
    module: Location;
    /** The path from the barrel to the module. */
    path: string;
}

// Comparator for alphabetically sorting imports by path.
// Does not need to check for equality, will only be used on distinct paths.
function compareImports(a: Import, b: Import): number {
    return a.path < b.path ? -1 : 1;
}

/**
 * Builds a barrel that matches the filesystem structure.
 * @param directory The directory the module is being created for.
 * @param modules The modules the barrel should contain.
 * @param options Barrelsby options.
 * @returns The built barrel output.
 */
export function buildFileSystemBarrel(directory: Directory, modules: Location[], options: Options): string {
    const structure: ExportStructure = {};
    let content = "";

    // Build the import block at the top of the barrel.
    modules
        .map((module: Location): Import => ({ module, path: buildImportPath(directory, module, options) }))
        .sort(compareImports)
        .forEach((imported: Import): void => {
            // Resolve the path from barrel to module to use for importing.
            const relativePath = path.relative(directory.path, imported.module.path);

            // Split up the path to the module to use in nesting.
            const parts = path.dirname(relativePath).split(path.sep);

            // Create a safe identifier the module can be referred to by.
            const alias = relativePath.replace(nonAlphaNumeric, "");

            content += `import * as ${alias} from ${options.quoteCharacter}${imported.path}${options.quoteCharacter};
`;

            // Use this opportunity to insert the module into the nested output structure.
            const fileName = path.basename(imported.module.name, ".ts");
            buildStructureSubsection(structure, parts, fileName, alias);
        });

    // Build the exports.
    for (const key of Object.keys(structure).sort()) {
        const exported = structure[key];
        if (typeof exported === "string") {
            // The export is a module within "this" directory. Export it directly.
            content += `export {${exported} as ${key}};
`;
        } else {
            // The export is a directory. Export the nested structure.
            content += `export const ${key} = ${stringify(exported, "")};
`;
        }
    }
    return content;
}
