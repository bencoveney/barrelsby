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
const BaseUrl = __importStar(require("./options/baseUrl"));
const Logger = __importStar(require("./options/logger"));
const NoSemicolon = __importStar(require("./options/noSemicolon"));
const QuoteCharacter = __importStar(require("./options/quoteCharacter"));
const RootPath = __importStar(require("./options/rootPath"));
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
        const args = {
            baseUrl: "https://base-url.com",
            delete: true,
            directory: "testRootPath",
            exclude: ["directory4"],
            exportDefault: false,
            include: ["directory2"],
            local: true,
            location: "top",
            name: "inputBarrelName",
            noSemicolon: true,
            singleQuotes: true,
            structure: "flat",
            verbose: true
        };
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
        const semicolonCharacter = ";";
        const getSemicolonCharacterSpy = spySandbox
            .stub(NoSemicolon, "getSemicolonCharacter")
            .returns(semicolonCharacter);
        const logger = spySandbox.spy();
        const getLoggerSpy = spySandbox.stub(Logger, "getLogger").returns(logger);
        const barrelName = "barrel.ts";
        const getBarrelNameSpy = spySandbox
            .stub(BarrelName, "getBarrelName")
            .returns(barrelName);
        const rootPath = "./directory";
        const resolveRootPathSpy = spySandbox
            .stub(RootPath, "resolveRootPath")
            .returns(rootPath);
        const baseUrl = "https://base-url.com/src/directory";
        const getCombinedBaseUrlSpy = spySandbox
            .stub(BaseUrl, "getCombinedBaseUrl")
            .returns(baseUrl);
        index_1.default(args);
        chai_1.assert(getQuoteCharacterSpy.calledOnceWithExactly(true));
        chai_1.assert(getSemicolonCharacterSpy.calledOnceWithExactly(true));
        chai_1.assert(getLoggerSpy.calledOnceWithExactly(true));
        chai_1.assert(getBarrelNameSpy.calledOnceWithExactly(args.name, logger));
        chai_1.assert(resolveRootPathSpy.calledWithExactly(args.directory));
        chai_1.assert(getCombinedBaseUrlSpy.calledOnceWithExactly(rootPath, args.baseUrl));
        chai_1.assert(buildTreeSpy.calledOnceWithExactly(rootPath, barrelName, logger));
        chai_1.assert(getDestinationsSpy.calledOnceWithExactly(builtTree, args.location, barrelName, logger));
        chai_1.assert(purgeSpy.calledOnceWithExactly(builtTree, args.delete, barrelName, logger));
        chai_1.assert(buildBarrelsSpy.calledOnceWithExactly(destinations, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, args.exportDefault, args.structure, args.local, args.include, args.exclude));
    });
});
//# sourceMappingURL=index.test.js.map