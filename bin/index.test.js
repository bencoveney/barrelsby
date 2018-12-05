"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const Builder = __importStar(require("./builder"));
const Destinations = __importStar(require("./destinations"));
const FileTree = __importStar(require("./fileTree"));
const index_1 = __importDefault(require("./index"));
const BarrelName = __importStar(require("./options/barrelName"));
const Options = __importStar(require("./options/options"));
const QuoteCharacter = __importStar(require("./options/quoteCharacter"));
const Purge = __importStar(require("./purge"));
describe("main module", () => {
    let spySandbox;
    beforeEach(() => {
        spySandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        spySandbox.restore();
    });
    it("should co-ordinate the main stages of the application", () => {
        const processedOptions = {
            logger: () => void 0,
            mock: "processedOptions",
            name: "inputBarrelName",
            rootPath: "testRootPath"
        };
        const getOptionsSpy = spySandbox
            .stub(Options, "getOptions")
            .returns(processedOptions);
        const builtTree = { mock: "built tree" };
        const buildTreeSpy = spySandbox
            .stub(FileTree, "buildTree")
            .returns(builtTree);
        const destinations = { mock: "destinations" };
        const getDestinationsSpy = spySandbox
            .stub(Destinations, "getDestinations")
            .returns(destinations);
        const purgeSpy = spySandbox.stub(Purge, "purge");
        const buildBarrelsSpy = spySandbox.stub(Builder, "buildBarrels");
        const quoteCharacter = "'";
        const getQuoteCharacterSpy = spySandbox
            .stub(QuoteCharacter, "getQuoteCharacter")
            .returns(quoteCharacter);
        const barrelName = "barrel.ts";
        const getBarrelNameSpy = spySandbox
            .stub(BarrelName, "getBarrelName")
            .returns(barrelName);
        const options = { mock: "Options", singleQuotes: true };
        index_1.default(options);
        chai_1.assert(getOptionsSpy.calledOnceWithExactly(options));
        chai_1.assert(getQuoteCharacterSpy.calledOnceWithExactly(true));
        chai_1.assert(getBarrelNameSpy.calledOnceWithExactly(processedOptions.name, processedOptions.logger));
        chai_1.assert(buildTreeSpy.calledOnceWithExactly("testRootPath", processedOptions, barrelName));
        chai_1.assert(getDestinationsSpy.calledOnceWithExactly(builtTree, processedOptions, barrelName));
        chai_1.assert(purgeSpy.calledOnceWithExactly(builtTree, processedOptions, barrelName));
        chai_1.assert(buildBarrelsSpy.calledOnceWithExactly(destinations, processedOptions, quoteCharacter, barrelName));
    });
});
//# sourceMappingURL=index.test.js.map