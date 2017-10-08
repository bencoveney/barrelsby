"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const TestUtilities = require("../testUtilities");
const FileSystem = require("./fileSystem");
describe("builder/fileSystem module has a", () => {
    describe("buildFileSystemBarrel function that", () => {
        describe("when using double quotes", () => {
            let output;
            const options = {
                barrelName: "index.ts",
                logger: () => void 0,
                quoteCharacter: "\"",
                rootPath: path.resolve("./"),
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
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, options);
            });
        });
    });
    describe("when using single quotes", () => {
        let output;
        const options = {
            barrelName: "index.ts",
            logger: () => void 0,
            quoteCharacter: "'",
            rootPath: path.resolve("./"),
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
        it("should produce output compatible with the recommended tslint ruleset", () => {
            TestUtilities.tslint(output, options);
        });
    });
});
//# sourceMappingURL=fileSystem.test.js.map