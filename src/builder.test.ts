import { assert } from "chai";
import fs from "fs";
import MockFs from "mock-fs";
import Sinon from "sinon";

import * as Builder from "./builder";
import * as FileSystem from "./builders/fileSystem";
import * as Flat from "./builders/flat";
import * as Header from "./builders/header";
import * as Modules from "./modules";
import { StructureOption } from "./options/options";
import * as TestUtilities from "./testUtilities";
import { Directory, Location } from "./utilities";

// Gets a location from a list by name.
function getLocationByName(locations: Location[], name: string): Location {
  return locations.filter(location => location.name === name)[0];
}

describe("builder/builder module has a", () => {
  describe("buildBarrels function that", () => {
    let directory: Directory;
    let spySandbox: sinon.SinonSandbox;
    let logger: Sinon.SinonSpy;
    const runBuilder = (structure: StructureOption | undefined) => {
      logger = spySandbox.spy();
      Builder.buildBarrels(
        directory.directories,
        '"',
        ";",
        "barrel.ts",
        logger,
        undefined,
        false,
        structure,
        false,
        [],
        []
      );
    };
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      spySandbox = Sinon.createSandbox();
      spySandbox
        .stub(FileSystem, "buildFileSystemBarrel")
        .returns("fileSystemContent");
      spySandbox.stub(Flat, "buildFlatBarrel").returns("flatContent");
      spySandbox.stub(Modules, "loadDirectoryModules").returns([]);
      spySandbox
        .stub(Header, "addHeaderPrefix")
        .callsFake((content: string) => `header: ${content}`);
    });
    afterEach(() => {
      MockFs.restore();
      spySandbox.restore();
    });
    describe("uses the structure option and", () => {
      const testStructure = (
        structure: StructureOption | undefined,
        isFlat: boolean
      ) => {
        runBuilder(structure);
        // TODO: Test arguments for barrel builder & loadDirectoryModules
        if (isFlat) {
          Sinon.assert.calledTwice(Flat.buildFlatBarrel as Sinon.SinonSpy);
          Sinon.assert.notCalled(
            FileSystem.buildFileSystemBarrel as Sinon.SinonSpy
          );
        } else {
          Sinon.assert.notCalled(Flat.buildFlatBarrel as Sinon.SinonSpy);
          Sinon.assert.calledTwice(
            FileSystem.buildFileSystemBarrel as Sinon.SinonSpy
          );
        }
      };
      it("should use the flat builder if in flat mode", () => {
        testStructure("flat", true);
      });
      it("should use the filesystem builder if in filesystem mode", () => {
        testStructure("filesystem", false);
      });
      it("should use the flat builder if no mode is specified", () => {
        testStructure(undefined, true);
      });
    });
    it("should write each barrel's header and content to disk", () => {
      runBuilder("flat");
      const checkContent = (address: string) => {
        const result = fs.readFileSync(address, "utf8");
        assert.equal(result, "header: flatContent");
      };
      checkContent("directory1/directory2/barrel.ts");
      checkContent("directory1/directory3/barrel.ts");
    });
    it("should update the directory structure with the new barrel", () => {
      runBuilder("flat");
      directory.directories.forEach((subDirectory: Directory) => {
        assert.equal((subDirectory.barrel as Location).name, "barrel.ts");
      });
    });
    it("should log useful information to the logger", () => {
      runBuilder("flat");
      const messages = [
        "Building barrel @ directory1/directory2",
        "Updating model barrel @ directory1/directory2/barrel.ts",
        "Building barrel @ directory1/directory3",
        "Updating model barrel @ directory1/directory3/barrel.ts"
      ];
      assert.equal(logger.callCount, messages.length);
      messages.forEach((message: string, barrel: number) => {
        assert.equal(logger.getCall(barrel).args[0], message);
      });
    });
  });
  describe("buildBarrels function with empty barrel content that", () => {
    let directory: Directory;
    let spySandbox: sinon.SinonSandbox;
    let logger: Sinon.SinonSpy;
    const runBuilder = () => {
      logger = spySandbox.spy();
      Builder.buildBarrels(
        directory.directories,
        '"',
        ";",
        "barrel.ts",
        logger,
        undefined,
        false,
        "flat",
        false,
        [],
        []
      );
    };
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      spySandbox = Sinon.createSandbox();
      spySandbox.stub(Flat, "buildFlatBarrel").returns("");
      spySandbox.stub(Modules, "loadDirectoryModules").returns([]);
    });
    afterEach(() => {
      MockFs.restore();
      spySandbox.restore();
    });
    it("does not create an empty barrel", () => {
      runBuilder();
      const checkDoesNotExist = (address: string) => {
        assert.isFalse(fs.existsSync(address));
      };
      checkDoesNotExist("directory1/directory2/barrel.ts");
      checkDoesNotExist("directory1/directory3/barrel.ts");
    });
  });
  describe("buildImportPath function that", () => {
    let directory: Directory;
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
    });
    it("should correctly build a path to a file in the same directory", () => {
      const target = getLocationByName(directory.files, "index.ts");
      const result = Builder.buildImportPath(directory, target, undefined);
      assert.equal(result, "./index");
    });
    it("should correctly build a path to a file in a child directory", () => {
      const childDirectory = getLocationByName(
        directory.directories,
        "directory2"
      ) as Directory;
      const target = getLocationByName(childDirectory.files, "script.ts");
      const result = Builder.buildImportPath(directory, target, undefined);
      assert.equal(result, "./directory2/script");
    });
  });
  describe("getBasename function that", () => {
    it("should correctly strip .ts from the filename", () => {
      const fileName = "./random/path/file.ts";
      const result = Builder.getBasename(fileName);
      assert.equal(result, "file");
    });
    it("should correctly strip .d.ts from the filename", () => {
      const fileName = "./random/path/file.d.ts";
      const result = Builder.getBasename(fileName);
      assert.equal(result, "file");
    });
    it("should correctly strip .tsx from the filename", () => {
      const fileName = "./random/path/file.tsx";
      const result = Builder.getBasename(fileName);
      assert.equal(result, "file");
    });
    it("should not strip extensions from non-typescript filenames", () => {
      const fileName = "./random/path/file.cs";
      const result = Builder.getBasename(fileName);
      assert.equal(result, "file.cs");
    });
  });
});
