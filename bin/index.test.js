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
            mock: "processedOptions",
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
        const options = { mock: "Options" };
        index_1.default(options);
        chai_1.assert(getOptionsSpy.calledOnceWithExactly(options));
        // tslint:disable-next-line
        console.log(getQuoteCharacterSpy.args);
        chai_1.assert(getQuoteCharacterSpy.calledOnceWithExactly(false));
        chai_1.assert(buildTreeSpy.calledOnceWithExactly("testRootPath", processedOptions));
        chai_1.assert(getDestinationsSpy.calledOnceWithExactly(builtTree, processedOptions));
        chai_1.assert(purgeSpy.calledOnceWithExactly(builtTree, processedOptions));
        chai_1.assert(buildBarrelsSpy.calledOnceWithExactly(destinations, processedOptions, quoteCharacter));
    });
});
//# sourceMappingURL=index.test.js.map