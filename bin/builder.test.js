"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
const Handlebars = require("handlebars");
const MockFs = require("mock-fs");
const path = require("path");
const Sinon = require("sinon");
const Builder = require("./builder");
const BuilderInput = require("./builderInput");
const Modules = require("./modules");
const Utilities = require("./utilities");
describe("builder module has a", () => {
    describe("buildBarrels function that", () => {
        let logger;
        let template;
        let directories;
        let options;
        let spySandbox;
        beforeEach(() => {
            spySandbox = Sinon.sandbox.create();
            logger = spySandbox.spy();
            options = {
                barrelName: "files.ts",
                logger,
                structure: "testBuilder",
            };
            const existingBarrel = "existing barrel";
            directories = [
                {
                    barrel: existingBarrel,
                    directories: [],
                    files: [existingBarrel],
                    name: "with barrel",
                    path: "windows\\style\\path",
                },
                {
                    directories: [],
                    files: [],
                    name: "without barrel",
                    path: "unix/style/path",
                },
            ];
            // Intercept access to other modules.
            spySandbox.stub(BuilderInput, "createBuilderInput").returns({
                content: "built input",
            });
            spySandbox.stub(Modules, "loadDirectoryModules").returns("loaded modules");
            spySandbox.stub(Utilities, "convertPathSeparator").returns("converted path");
            template = spySandbox.spy();
            spySandbox.stub(Handlebars, "compile").returns(template);
            // Simulate a barrel on disk.
            const files = {};
            files[path.join(__dirname, "builders/testBuilder.hbs")] = "template text";
            MockFs(files);
        });
        afterEach(() => {
            MockFs.restore();
            spySandbox.restore();
        });
        it("should create builder input using relevant modules", () => {
            Builder.buildBarrels(directories, options);
            directories.forEach((directory) => {
                Sinon.assert.calledWith(Modules.loadDirectoryModules, directory, options);
                Sinon.assert.calledWith(BuilderInput.createBuilderInput, directory, "loaded modules", options);
            });
        });
        it("should load the template using the structure option", () => {
            Builder.buildBarrels(directories, options);
            Sinon.assert.calledWith(Handlebars.compile, "template text");
        });
        it("should write templated content to the correct location", () => {
            Builder.buildBarrels(directories, options);
            [
                "windows/style/path/files.ts",
                "unix/style/path/files.ts",
            ].forEach((address) => {
                chai_1.assert.equal(fs.readFileSync(address, "utf8"), "flatContent");
            });
        });
        it("should update the directory tree model with the new barrel", () => {
            directories.forEach((directory) => {
                chai_1.assert.exists(directory.barrel);
                chai_1.assert.includeMembers(directory.files, [directory.barrel]);
                chai_1.assert.equal(directory.barrel && directory.barrel.name, "files.ts");
                chai_1.assert.equal(directory.barrel && directory.barrel.path, "path");
            });
        });
        it("should log useful information to the logger", () => {
            [
                "Building barrel @ windows\\style\\path",
                "Building barrel @ unix/style/path",
                "Updating model barrel @ ${convertedPath}",
            ].forEach((message, index) => {
                logger.getCall(index).calledWith(message);
            });
        });
    });
});
//# sourceMappingURL=builder.test.js.map