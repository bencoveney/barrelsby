import {assert} from "chai";
import Sinon from "sinon";

import * as Builder from "./builder";
import * as Destinations from "./destinations";
import * as FileTree from "./fileTree";
import Main from "./index";
import * as Options from "./options";
import * as Purge from "./purge";

describe("main module", () => {
    let spySandbox: Sinon.SinonSandbox;
    beforeEach(() => {
        spySandbox = Sinon.createSandbox();
    });
    afterEach(() => {
        spySandbox.restore();
    });
    it("should co-ordinate the main stages of the application", () => {
        const processedOptions: any = {mock: "processedOptions", rootPath: "testRootPath"};
        const getOptionsSpy = spySandbox.stub(Options, "getOptions").returns(processedOptions);

        const builtTree: any = {mock: "built tree"};
        const buildTreeSpy = spySandbox.stub(FileTree, "buildTree").returns(builtTree);

        const destinations: any = {mock: "destinations"};
        const getDestinationsSpy = spySandbox.stub(Destinations, "getDestinations").returns(destinations);

        const purgeSpy = spySandbox.stub(Purge, "purge");

        const buildBarrelsSpy = spySandbox.stub(Builder, "buildBarrels");

        const options: any = {mock: "Options"};
        Main(options);

        assert(getOptionsSpy.calledOnceWithExactly(options));
        assert(buildTreeSpy.calledOnceWithExactly("testRootPath", processedOptions));
        assert(getDestinationsSpy.calledOnceWithExactly(builtTree, processedOptions));
        assert(purgeSpy.calledOnceWithExactly(builtTree, processedOptions));
        assert(buildBarrelsSpy.calledOnceWithExactly(destinations, processedOptions));
    });
});
