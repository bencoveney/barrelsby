"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../utilities");
function getBarrelName(name, logger) {
    // Resolve barrel name.
    const nameArgument = name;
    const barrelName = nameArgument.match(utilities_1.isTypeScriptFile)
        ? nameArgument
        : `${nameArgument}.ts`;
    logger(`Using name ${barrelName}`);
    return barrelName;
}
exports.getBarrelName = getBarrelName;
//# sourceMappingURL=barrelName.js.map