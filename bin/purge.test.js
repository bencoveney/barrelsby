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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const Purge = __importStar(require("./purge"));
const TestUtilities = __importStar(require("./testUtilities"));
describe("purge module has a", () => {
    describe("purge function that", () => {
        let directory;
        let logged;
        let logger;
        const barrelName = "barrel.ts";
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            logger = TestUtilities.mockLogger(logged);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
        });
        it("should delete existing barrels if the delete flag is enabled", () => {
            Purge.purge(directory, true, barrelName, logger);
            // Check directory has been manipulated.
            expect(directory.files.length).toBe(2);
            expect(directory.files.filter((file) => file.name === "barrel.ts").length).toBe(0);
            // Check FS has been manipulated.
            expect(fs_1.default.existsSync("directory1/barrel.ts")).toBeFalsy();
        });
        it("should do nothing if the delete flag is disabled", () => {
            Purge.purge(directory, false, barrelName, logger);
            // Check directory has not been manipulated.
            expect(directory.files.length).toBe(3);
            expect(directory.files.filter((file) => file.name === "barrel.ts").length).toBe(1);
            // Check FS has not been manipulated.
            expect(fs_1.default.existsSync("directory1/barrel.ts")).toBeTruthy();
        });
        it("should log useful information to the logger", () => {
            Purge.purge(directory, true, barrelName, logger);
            expect(logged).toEqual([
                "Deleting existing barrel @ directory1/barrel.ts",
            ]);
        });
    });
});
//# sourceMappingURL=purge.test.js.map