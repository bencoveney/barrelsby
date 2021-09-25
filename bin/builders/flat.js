"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFlatBarrel = void 0;
const builder_1 = require("../builder");
function buildFlatBarrel(directory, modules, quoteCharacter, semicolonCharacter, logger, baseUrl, exportDefault) {
    return modules.reduce((previous, current) => {
        const importPath = (0, builder_1.buildImportPath)(directory, current, baseUrl);
        logger(`Including path ${importPath}`);
        if (exportDefault) {
            const filename = (0, builder_1.getBasename)(current.path);
            previous += `export { default as ${filename} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
        }
        return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map