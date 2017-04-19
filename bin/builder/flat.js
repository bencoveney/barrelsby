"use strict";
const utilities_1 = require("./utilities");
function buildFlatBarrel(directory, modules, options) {
    return modules.reduce((previous, current) => {
        const importPath = utilities_1.buildImportPath(directory, current);
        options.logger(`Including path ${importPath}`);
        return previous += `export * from "${importPath}";
`;
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map