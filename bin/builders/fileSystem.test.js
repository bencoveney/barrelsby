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
const path_1 = __importDefault(require("path"));
const TestUtilities = __importStar(require("../testUtilities"));
const FileSystem = __importStar(require("./fileSystem"));
describe("builder/fileSystem module has a", () => {
    describe("buildFileSystemBarrel function that", () => {
        describe("when using double quotes", () => {
            let output;
            const options = {
                barrelName: "index.ts",
                locationTest: TestUtilities.mockLocationTest(),
                logger: () => void 0,
                quoteCharacter: "\"",
                rootPath: path_1.default.resolve("./"),
            };
            beforeEach(() => {
                const rootDirectory = TestUtilities.mockDirectoryTree();
                output = FileSystem.buildFileSystemBarrel(rootDirectory, TestUtilities.mockModules(rootDirectory), options);
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(output, `import * as barrelts from "./barrel";
import * as directory2directory4deeplyNestedts from "./directory2/directory4/deeplyNested";
import * as directory2scriptts from "./directory2/script";
import * as directory3programts from "./directory3/program";
import * as indexts from "./index";
export {barrelts as barrel};
export const directory2 = {
  directory4: {
    deeplyNested: directory2directory4deeplyNestedts,
  },
  script: directory2scriptts,
};
export const directory3 = {
  program: directory3programts,
};
export {indexts as index};
`);
            });
            it("should produce output compatible with the recommended tslint ruleset", function () {
                TestUtilities.tslint.call(this, output, options);
            });
        });
    });
    describe("when using single quotes", () => {
        let output;
        const options = {
            barrelName: "index.ts",
            locationTest: TestUtilities.mockLocationTest(),
            logger: () => void 0,
            quoteCharacter: "'",
            rootPath: path_1.default.resolve("./"),
        };
        beforeEach(() => {
            const rootDirectory = TestUtilities.mockDirectoryTree();
            output = FileSystem.buildFileSystemBarrel(rootDirectory, TestUtilities.mockModules(rootDirectory), options);
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(output, `import * as barrelts from './barrel';
import * as directory2directory4deeplyNestedts from './directory2/directory4/deeplyNested';
import * as directory2scriptts from './directory2/script';
import * as directory3programts from './directory3/program';
import * as indexts from './index';
export {barrelts as barrel};
export const directory2 = {
  directory4: {
    deeplyNested: directory2directory4deeplyNestedts,
  },
  script: directory2scriptts,
};
export const directory3 = {
  program: directory3programts,
};
export {indexts as index};
`);
        });
        it("should produce output compatible with the recommended tslint ruleset", function () {
            TestUtilities.tslint.call(this, output, options);
        });
    });
});
//# sourceMappingURL=fileSystem.test.js.map