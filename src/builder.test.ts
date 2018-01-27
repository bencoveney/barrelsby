import {assert} from "chai";
import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as MockFs from "mock-fs";
import * as path from "path";
import * as Sinon from "sinon";
import * as Builder from "./builder";
import * as BuilderInput from "./builderInput";
import * as Modules from "./modules";
import {Options} from "./options";
import * as Utilities from "./utilities";

describe("builder module has a", () => {
    describe("buildBarrels function that", () => {
        let logger: Sinon.SinonSpy;
        let template: Sinon.SinonSpy;
        let directories: Utilities.Directory[];
        let options: Options;
        let spySandbox: sinon.SinonSandbox;
        beforeEach(() => {
            spySandbox = Sinon.sandbox.create();

            logger = spySandbox.spy();
            options = {
                barrelName: "files.ts",
                logger,
                structure: "testBuilder",
            } as any;

            const existingBarrel: Utilities.Location = "existing barrel" as any;
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
            const files: MockFs.Config = {};
            files[path.join(__dirname, "builders/testBuilder.hbs")] = "template text";
            MockFs(files);
        });
        afterEach(() => {
            MockFs.restore();
            spySandbox.restore();
        });
        it("should create builder input using relevant modules", () => {
            Builder.buildBarrels(
                directories,
                options,
            );
            directories.forEach((directory) => {
                Sinon.assert.calledWith(
                    Modules.loadDirectoryModules as Sinon.SinonSpy,
                    directory,
                    options,
                );
                Sinon.assert.calledWith(
                    BuilderInput.createBuilderInput as Sinon.SinonSpy,
                    directory,
                    "loaded modules",
                    options,
                );
            });
        });
        it("should load the template using the structure option", () => {
            Builder.buildBarrels(
                directories,
                options,
            );
            Sinon.assert.calledWith(
                Handlebars.compile as Sinon.SinonSpy,
                "template text",
            );
        });
        it("should write templated content to the correct location", () => {
            Builder.buildBarrels(
                directories,
                options,
            );
            [
                "windows/style/path/files.ts",
                "unix/style/path/files.ts",
            ].forEach((address) => {
                assert.equal(
                    fs.readFileSync(
                        address,
                        "utf8",
                    ),
                    "flatContent",
                );
            });
        });
        it("should update the directory tree model with the new barrel", () => {
            directories.forEach((directory) => {
                assert.exists(directory.barrel);
                assert.includeMembers(directory.files, [directory.barrel]);
                assert.equal(
                    directory.barrel && directory.barrel.name,
                    "files.ts",
                );
                assert.equal(
                    directory.barrel && directory.barrel.path,
                    "path",
                );
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
