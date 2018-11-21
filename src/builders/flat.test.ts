import {assert} from "chai";
import Sinon from "sinon";

import {Options} from "../options";
import * as TestUtilities from "../testUtilities";
import * as Flat from "./flat";

describe("builder/flat module has a", () => {
    describe("buildFlatBarrel function that", () => {
        describe("when using double quotes", () => {
            let output: string;
            let spySandbox: sinon.SinonSandbox;
            let logger: Sinon.SinonSpy;
            let options: Options;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = Sinon.createSandbox();
                logger = spySandbox.spy();
                options = {
                    barrelName: "barrel.ts",
                    logger,
                    quoteCharacter: "\"",
                    rootPath: ".",
                };
                output = Flat.buildFlatBarrel(
                    directory,
                    TestUtilities.mockModules(directory),
                    options,
                );
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(
                    output,
                    `export * from "./barrel";
export * from "./index";
export * from "./directory2/script";
export * from "./directory2/directory4/deeplyNested";
export * from "./directory3/program";
`);
            });
            it("should log useful information to the logger", () => {
                const messages = [
                    "Including path ./barrel",
                    "Including path ./index",
                    "Including path ./directory2/script",
                    "Including path ./directory2/directory4/deeplyNested",
                    "Including path ./directory3/program",
                ];
                assert.equal(logger.callCount, messages.length);
                messages.forEach((message: string, index: number) => {
                    assert.equal(logger.getCall(index).args[0], message);
                });
            });
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, options);
            });
        });

        describe("when using single quotes", () => {
            let output: string;
            let spySandbox: sinon.SinonSandbox;
            let logger: Sinon.SinonSpy;
            let options: Options;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = Sinon.createSandbox();
                logger = spySandbox.spy();
                options = {
                    barrelName: "barrel.ts",
                    logger,
                    quoteCharacter: "'",
                    rootPath: ".",
                };
                output = Flat.buildFlatBarrel(
                    directory,
                    TestUtilities.mockModules(directory),
                    options,
                );
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(
                    output,
                    `export * from './barrel';
export * from './index';
export * from './directory2/script';
export * from './directory2/directory4/deeplyNested';
export * from './directory3/program';
`);
            });
            it("should log useful information to the logger", () => {
                const messages = [
                    "Including path ./barrel",
                    "Including path ./index",
                    "Including path ./directory2/script",
                    "Including path ./directory2/directory4/deeplyNested",
                    "Including path ./directory3/program",
                ];
                assert.equal(logger.callCount, messages.length);
                messages.forEach((message: string, index: number) => {
                    assert.equal(logger.getCall(index).args[0], message);
                });
            });
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, options);
            });
        });
    });
});
