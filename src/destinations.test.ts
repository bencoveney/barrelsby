import { assert } from "chai";

import * as Destinations from "./destinations";
import { Logger } from "./options/logger";
import { LocationOption, Options } from "./options/options";
import * as TestUtilities from "./testUtilities";
import { Directory } from "./utilities";

describe("destinations module has a", () => {
  describe("getDestinations function that", () => {
    let directory: Directory;
    let destinations: Directory[];
    let options: Options;
    const barrelName = "barrel.ts";
    const testMode = (
      mode: LocationOption,
      getExpectedDestinations: () => Directory[],
      expectedLogs: string[]
    ) => {
      describe(`when in '${mode}' mode`, () => {
        let logged: string[];
        let logger: Logger = () => void 0;
        beforeEach(() => {
          options.location = mode;
          logged = [];
          logger = TestUtilities.mockLogger(logged);
          destinations = Destinations.getDestinations(
            directory,
            options,
            barrelName,
            logger
          );
        });
        it("should select the correct destinations", () => {
          assert.deepEqual(destinations, getExpectedDestinations());
        });
        it("should log useful information to the logger", () => {
          assert.deepEqual(logged, expectedLogs);
        });
      });
    };
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
      options = {};
    });
    testMode("top", () => [directory], ["Destinations:", "./directory1"]);
    testMode("below", () => directory.directories, [
      "Destinations:",
      "directory1/directory2",
      "directory1/directory3"
    ]);
    testMode(
      "all",
      () => [
        directory.directories[0].directories[0],
        directory.directories[0],
        directory.directories[1],
        directory
      ],
      [
        "Destinations:",
        "directory1/directory2/directory4",
        "directory1/directory2",
        "directory1/directory3",
        "./directory1"
      ]
    );
    testMode("replace", () => [directory], ["Destinations:", "./directory1"]);
    testMode("branch", () => [directory.directories[0], directory], [
      "Destinations:",
      "directory1/directory2",
      "./directory1"
    ]);
  });
});
