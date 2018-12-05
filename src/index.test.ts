import { assert } from "chai";
import Sinon from "sinon";

import * as Builder from "./builder";
import * as Destinations from "./destinations";
import * as FileTree from "./fileTree";
import Main from "./index";
import * as BarrelName from "./options/barrelName";
import * as Options from "./options/options";
import * as QuoteCharacter from "./options/quoteCharacter";
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
    const processedOptions: any = {
      logger: () => void 0,
      mock: "processedOptions",
      name: "inputBarrelName",
      rootPath: "testRootPath"
    };
    const getOptionsSpy = spySandbox
      .stub(Options, "getOptions")
      .returns(processedOptions);

    const builtTree: any = { mock: "built tree" };
    const buildTreeSpy = spySandbox
      .stub(FileTree, "buildTree")
      .returns(builtTree);

    const destinations: any = { mock: "destinations" };
    const getDestinationsSpy = spySandbox
      .stub(Destinations, "getDestinations")
      .returns(destinations);

    const purgeSpy = spySandbox.stub(Purge, "purge");

    const buildBarrelsSpy = spySandbox.stub(Builder, "buildBarrels");

    const quoteCharacter = "'";
    const getQuoteCharacterSpy = spySandbox
      .stub(QuoteCharacter, "getQuoteCharacter")
      .returns(quoteCharacter);

    const barrelName = "barrel.ts";
    const getBarrelNameSpy = spySandbox
      .stub(BarrelName, "getBarrelName")
      .returns(barrelName);

    const options: any = { mock: "Options", singleQuotes: true };
    Main(options);

    assert(getOptionsSpy.calledOnceWithExactly(options));
    assert(getQuoteCharacterSpy.calledOnceWithExactly(true));
    assert(
      getBarrelNameSpy.calledOnceWithExactly(
        processedOptions.name,
        processedOptions.logger
      )
    );
    assert(
      buildTreeSpy.calledOnceWithExactly(
        "testRootPath",
        processedOptions,
        barrelName
      )
    );
    assert(
      getDestinationsSpy.calledOnceWithExactly(
        builtTree,
        processedOptions,
        barrelName
      )
    );
    assert(
      purgeSpy.calledOnceWithExactly(builtTree, processedOptions, barrelName)
    );
    assert(
      buildBarrelsSpy.calledOnceWithExactly(
        destinations,
        processedOptions,
        quoteCharacter,
        barrelName
      )
    );
  });
});
