"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Destinations = __importStar(require("./destinations"));
const TestUtilities = __importStar(require("./testUtilities"));
describe("destinations module has a", () => {
    describe("getDestinations function that", () => {
        let directory;
        let destinations;
        const barrelName = "barrel.ts";
        const testMode = (mode, getExpectedDestinations, expectedLogs) => {
            describe(`when in '${mode}' mode`, () => {
                let logged;
                let logger = () => void 0;
                beforeEach(() => {
                    logged = [];
                    logger = TestUtilities.mockLogger(logged);
                    destinations = Destinations.getDestinations(directory, mode, barrelName, logger);
                });
                it("should select the correct destinations", () => {
                    chai_1.assert.deepEqual(destinations, getExpectedDestinations());
                });
                it("should log useful information to the logger", () => {
                    chai_1.assert.deepEqual(logged, expectedLogs);
                });
            });
        };
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        testMode("top", () => [directory], ["Destinations:", "./directory1"]);
        testMode("below", () => directory.directories, [
            "Destinations:",
            "directory1/directory2",
            "directory1/directory3",
        ]);
        testMode("all", () => [
            directory.directories[0].directories[0],
            directory.directories[0],
            directory.directories[1],
            directory,
        ], [
            "Destinations:",
            "directory1/directory2/directory4",
            "directory1/directory2",
            "directory1/directory3",
            "./directory1",
        ]);
        testMode("replace", () => [directory], ["Destinations:", "./directory1"]);
        testMode("branch", () => [directory.directories[0], directory], [
            "Destinations:",
            "directory1/directory2",
            "./directory1",
        ]);
    });
});
//# sourceMappingURL=destinations.test.js.map