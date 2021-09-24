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
const TestUtilities = __importStar(require("../testUtilities"));
const FileSystem = __importStar(require("./fileSystem"));
describe("builder/fileSystem module has a", () => {
    describe("buildFileSystemBarrel function that", () => {
        describe("when using the default settings", () => {
            let output;
            const logger = () => void 0;
            beforeEach(() => {
                const rootDirectory = TestUtilities.mockDirectoryTree();
                output = FileSystem.buildFileSystemBarrel(rootDirectory, TestUtilities.mockModules(rootDirectory), '"', ";", logger, undefined, false);
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
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, '"');
            });
        });
    });
    describe("when using single quotes", () => {
        let output;
        const logger = () => void 0;
        beforeEach(() => {
            const rootDirectory = TestUtilities.mockDirectoryTree();
            output = FileSystem.buildFileSystemBarrel(rootDirectory, TestUtilities.mockModules(rootDirectory), "'", ";", logger, undefined, false);
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
        it("should produce output compatible with the recommended tslint ruleset", () => {
            TestUtilities.tslint(output, "'");
        });
    });
    describe("when using no semicolon", () => {
        let output;
        const logger = () => void 0;
        beforeEach(() => {
            const rootDirectory = TestUtilities.mockDirectoryTree();
            output = FileSystem.buildFileSystemBarrel(rootDirectory, TestUtilities.mockModules(rootDirectory), '"', "", logger, undefined, false);
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(output, `import * as barrelts from "./barrel"
import * as directory2directory4deeplyNestedts from "./directory2/directory4/deeplyNested"
import * as directory2scriptts from "./directory2/script"
import * as directory3programts from "./directory3/program"
import * as indexts from "./index"
export {barrelts as barrel}
export const directory2 = {
  directory4: {
    deeplyNested: directory2directory4deeplyNestedts,
  },
  script: directory2scriptts,
}
export const directory3 = {
  program: directory3programts,
}
export {indexts as index}
`);
        });
    });
});
//# sourceMappingURL=fileSystem.test.js.map