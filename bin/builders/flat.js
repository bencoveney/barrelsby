"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = require("../builder");
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