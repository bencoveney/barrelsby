import {assert} from "chai";
import * as Sinon from "sinon";

import * as TestUtilities from "../testUtilities";
import {Directory, Location} from "../utilities";
import * as Flat from "./flat";

describe("builder/flat module has a", () => {
    describe("buildFlatBarrel function that", () => {
        let output: string;
        let spySandbox: sinon.SinonSandbox;
        let logger: Sinon.SinonSpy;
        beforeEach(() => {
            const directory = TestUtilities.mockDirectoryTree().directories[0];
            const modules = directory.directories.reduce(
                (previous: Location[], current: Directory) => previous.concat(current.files),
                directory.files,
            );
            spySandbox = Sinon.sandbox.create();
            logger = spySandbox.spy();
            const options = {
                barrelName: "barrel.ts",
                logger,
                rootPath: ".",
            };
            output = Flat.buildFlatBarrel(directory, modules, options);
        });
        afterEach(() => {
            spySandbox.restore();
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(
                output,
                `export * from "./script";
export * from "./directory4/deeplyNested";
`);
        });
        it("should log useful information to the logger", () => {
            const messages = [
                "Including path ./script",
                "Including path ./directory4/deeplyNested",
            ];
            assert.equal(logger.callCount, messages.length);
            messages.forEach((message: string, index: number) => {
                assert.equal(logger.getCall(index).args[0], message);
            });
        });
        it("should produce output compatible with the recommended tslint ruleset", () => {
            TestUtilities.tslint(output);
        });
    });
});
