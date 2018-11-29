"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utilities_1 = require("./utilities");
function getOptions(options) {
    // TODO: A lot of these options would be better passed only to the places they are needed, rather than as one
    // huge blob.
    // tslint:disable-next-line:no-console
    options.logger = options.verbose ? console.log : new Function("return void(0);");
    options.rootPath = path_1.default.resolve(options.directory);
    options.quoteCharacter = options.singleQuotes ? "'" : "\"";
    // Resolve barrel name.
    const nameArgument = options.name;
    options.barrelName = nameArgument.match(utilities_1.isTypeScriptFile) ? nameArgument : `${nameArgument}.ts`;
    options.logger(`Using name ${options.barrelName}`);
    // Resolve base url.
    if (options.baseUrl) {
        options.combinedBaseUrl = path_1.default.join(options.rootPath, options.baseUrl);
    }
    return options;
}
exports.getOptions = getOptions;
//# sourceMappingURL=options.js.map