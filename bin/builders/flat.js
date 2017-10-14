"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("../builder");
/**
 * Builds a barrel that has a flat structure.
 * @param directory The directory the module is being created for.
 * @param modules The modules the barrel should contain.
 * @param options Barrelsby options.
 * @returns The built barrel output.
 */
function buildFlatBarrel(directory, modules, options) {
    return modules.reduce((previous, current) => {
        const importPath = builder_1.buildImportPath(directory, current, options);
        options.logger(`Including path ${importPath}`);
        return previous += `export * from ${options.quoteCharacter}${importPath}${options.quoteCharacter};
`;
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map