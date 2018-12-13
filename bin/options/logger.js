"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLogger(isVerbose) {
    // tslint:disable-next-line:no-console
    return isVerbose ? console.log : () => void 0;
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map