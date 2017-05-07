"use strict";
const TestUtilities = require("../test/utilities");
const FileSystem = require("./fileSystem");
describe("builder/fileSystem module has a", () => {
    describe("buildFileSystemBarrel function that", () => {
        let output;
        beforeEach(() => {
            const directory = TestUtilities.mockDirectoryTree().directories[0];
            const modules = directory.directories.reduce((previous, current) => previous.concat(current.files), directory.files);
            output = FileSystem.buildFileSystemBarrel(directory, modules);
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(output, `import * as directory4deeplyNestedts from "./directory4/deeplyNested";
import * as scriptts from "./script";
export const directory4 = {
  deeplyNested: directory4deeplyNestedts,
};
export {scriptts as script};
`);
        });
        it("should produce output compatible with the recommended tslint ruleset", () => {
            TestUtilities.tslint(output);
        });
    });
});
//# sourceMappingURL=fileSystem.test.js.map