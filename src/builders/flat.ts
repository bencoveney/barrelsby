import {Options} from "../options";
import {Directory, Location} from "../utilities";

import {buildImportPath} from "../builder";

export function buildFlatBarrel(directory: Directory, modules: Location[], options: Options): string {
    return modules.reduce(
        (previous: string, current: Location) => {
            const importPath = buildImportPath(directory, current);
            options.logger(`Including path ${importPath}`);
            return previous += `export * from ${options.quoteCharacter}${importPath}${options.quoteCharacter};
`;
        },
        "",
    );
}
