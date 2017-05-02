"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestUtilities = require("../test/utilities");
var FileSystem = require("./fileSystem");
describe("builder/fileSystem module has a", function () {
    describe("buildFileSystemBarrel function that", function () {
        var output;
        beforeEach(function () {
            var directory = TestUtilities.mockDirectoryTree().directories[0];
            var modules = directory.directories.reduce(function (previous, current) { return previous.concat(current.files); }, directory.files);
            output = FileSystem.buildFileSystemBarrel(directory, modules);
        });
        it("should produce the correct output", function () {
            TestUtilities.assertMultiLine(output, "import * as directory4deeplyNestedts from \"./directory4/deeplyNested\";\nimport * as scriptts from \"./script\";\nexport const directory4 = {\n  deeplyNested: directory4deeplyNestedts,\n};\nexport {scriptts as script};\n");
        });
        it("should produce output compatible with the recommended tslint ruleset", function () {
            TestUtilities.tslintFile(output);
        });
    });
});
//# sourceMappingURL=fileSystem.test.js.map