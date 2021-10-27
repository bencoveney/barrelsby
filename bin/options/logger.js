"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const signale_1 = require("signale");
let logger;
function getLogger({ isVerbose } = { isVerbose: false }) {
    if (!logger) {
        logger = new signale_1.Signale({
            disabled: false,
            interactive: false,
            logLevel: isVerbose ? "info" : "error",
            stream: process.stdout,
            /*types: {
              remind: {
                badge: '**',
                color: 'yellow',
                label: 'reminder',
                logLevel: 'info'
              },
              santa: {
                badge: '🎅',
                color: 'red',
                label: 'santa',
                logLevel: 'info'
              }
            }*/
        });
    }
    return logger;
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map