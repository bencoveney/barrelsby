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
            const normalizedFilename = filename.includes("-")
                ? filename
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.substr(1))
                    .join("")
                : filename;
            previous += `export { default as ${normalizedFilename} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
        }
        return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map