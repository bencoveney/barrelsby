"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgs = void 0;
const fs_1 = __importDefault(require("fs"));
const yargs_1 = __importDefault(require("yargs"));
const options_1 = require("./options/options");
const configParser = (configPath) => {
    const config = JSON.parse(fs_1.default.readFileSync(configPath, "utf-8"));
    // Backwards compatibility for directory string, as opposed to an array
    if (config.directory && typeof config.directory === "string") {
        config.directory = [config.directory];
    }
    return config;
};
function getArgs() {
    // @ts-ignore Work around deep types.
    return yargs_1.default.usage("Usage: barrelsby [options]")
        .example("barrelsby", "Run barrelsby")
        .options((0, options_1.getOptionsConfig)(configParser))
        .version()
        .alias("v", "version")
        .default("v", false)
        .help("h")
        .alias("h", "help")
        .default("h", false);
}
exports.getArgs = getArgs;
//# sourceMappingURL=args.js.map