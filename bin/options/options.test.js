"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Options = __importStar(require("./options"));
describe("options module has a", () => {
    describe("getOptions function that", () => {
        let defaultOptions;
        beforeEach(() => {
            // Options that we are certain we will get from Yargs.
            // TODO: Enforce this using the type system - remove the anys.
            defaultOptions = {
                delete: false,
                directory: "test",
                location: "top",
                singleQuotes: false,
                structure: "flat",
                verbose: true
            };
        });
        it("should process the given configuration options", () => {
            const options = Object.assign({}, defaultOptions, { verbose: true });
            const processed = Options.getOptions(options);
            chai_1.assert.match(processed.rootPath, /test$/);
        });
        it("should resolve the baseUrl if specified", () => {
            const options = Object.assign({}, defaultOptions, { baseUrl: "/base/url" });
            const processed = Options.getOptions(options);
            chai_1.assert.match(processed.combinedBaseUrl, /base[\\/]url$/);
        });
    });
});
//# sourceMappingURL=options.test.js.map