import {Options} from "../options";
import {Directory, Location} from "../utilities";

import {buildImportPath} from "../builder";

/**
 * Builds a barrel that has a flat structure.
 * @param directory The directory the module is being created for.
 * @param modules The modules the barrel should contain.
 * @param options Barrelsby options.
 * @returns The built barrel output.
 */
export function buildFlatBarrel(directory: Directory, modules: Location[], options: Options): string {
    return modules.reduce(
        (previous: string, current: Location) => {
            const importPath = buildImportPath(directory, current, options);
            options.logger(`Including path ${importPath}`);
            return previous += `export * from ${options.quoteCharacter}${importPath}${options.quoteCharacter};
`;
        },
        "",
    );
}
