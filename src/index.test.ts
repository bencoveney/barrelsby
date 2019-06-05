import { assert } from "chai";
import Sinon from "sinon";

import * as Builder from "./builder";
import * as Destinations from "./destinations";
import * as FileTree from "./fileTree";
import Main from "./index";
import * as BarrelName from "./options/barrelName";
import * as BaseUrl from "./options/baseUrl";
import * as Logger from "./options/logger";
import * as NoSemicolon from "./options/noSemicolon";
import * as QuoteCharacter from "./options/quoteCharacter";
import * as RootPath from "./options/rootPath";
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
    const args: any = {
      baseUrl: "https://base-url.com",
      delete: true,
      directory: "testRootPath",
      exclude: ["directory4"],
      exportDefault: false,
      include: ["directory2"],
      local: true,
      location: "top",
      name: "inputBarrelName",
      noSemicolon: true,
      singleQuotes: true,
      structure: "flat",
      verbose: true
    };

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

    const semicolonCharacter = ";";
    const getSemicolonCharacterSpy = spySandbox
      .stub(NoSemicolon, "getSemicolonCharacter")
      .returns(semicolonCharacter);

    const logger = spySandbox.spy();
    const getLoggerSpy = spySandbox.stub(Logger, "getLogger").returns(logger);

    const barrelName = "barrel.ts";
    const getBarrelNameSpy = spySandbox
      .stub(BarrelName, "getBarrelName")
      .returns(barrelName);

    const rootPath = "./directory";
    const resolveRootPathSpy = spySandbox
      .stub(RootPath, "resolveRootPath")
      .returns(rootPath);

    const baseUrl = "https://base-url.com/src/directory";
    const getCombinedBaseUrlSpy = spySandbox
      .stub(BaseUrl, "getCombinedBaseUrl")
      .returns(baseUrl);

    Main(args);

    assert(getQuoteCharacterSpy.calledOnceWithExactly(true));
    assert(getSemicolonCharacterSpy.calledOnceWithExactly(true));
    assert(getLoggerSpy.calledOnceWithExactly(true));
    assert(getBarrelNameSpy.calledOnceWithExactly(args.name, logger));
    assert(resolveRootPathSpy.calledWithExactly(args.directory));
    assert(getCombinedBaseUrlSpy.calledOnceWithExactly(rootPath, args.baseUrl));
    assert(buildTreeSpy.calledOnceWithExactly(rootPath, barrelName, logger));
    assert(
      getDestinationsSpy.calledOnceWithExactly(
        builtTree,
        args.location,
        barrelName,
        logger
      )
    );
    assert(
      purgeSpy.calledOnceWithExactly(builtTree, args.delete, barrelName, logger)
    );
    assert(
      buildBarrelsSpy.calledOnceWithExactly(
        destinations,
        quoteCharacter,
        semicolonCharacter,
        barrelName,
        logger,
        baseUrl,
        args.exportDefault,
        args.structure,
        args.local,
        args.include,
        args.exclude
      )
    );
  });
});
