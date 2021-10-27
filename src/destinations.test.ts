import * as Destinations from "./destinations";
import { Logger } from "./options/logger";
import { LocationOption } from "./options/options";
import * as TestUtilities from "./testUtilities";
import { Directory } from "./utilities";
import { Signale } from "signale";

describe("destinations module has a", () => {
  describe("getDestinations function that", () => {
    let directory: Directory;
    let destinations: Directory[];
    const barrelName = "barrel.ts";
    const testMode = (
      mode: LocationOption,
      getExpectedDestinations: () => Directory[],
      expectedLogs: string[]
    ) => {
      describe(`when in '${mode}' mode`, () => {
        let logged: string[];
        let logger: Logger = new Signale();
        beforeEach(() => {
          logged = [];
          logger = TestUtilities.mockLogger(logged);
          destinations = Destinations.getDestinations(
            directory,
            mode,
            barrelName,
            logger
          );
        });
        it("should select the correct destinations", () => {
          expect(destinations).toEqual(getExpectedDestinations());
        });
        it("should log useful information to the logger", () => {
          expect(logged).toEqual(expectedLogs);
        });
      });
    };
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
    });
    testMode("top", () => [directory], ["Destinations:", "./directory1"]);
    testMode("below", () => directory.directories, [
      "Destinations:",
      "directory1/directory2",
      "directory1/directory3",
    ]);
    testMode(
      "all",
      () => [
        directory.directories[0].directories[0],
        directory.directories[0],
        directory.directories[1],
        directory,
      ],
      [
        "Destinations:",
        "directory1/directory2/directory4",
        "directory1/directory2",
        "directory1/directory3",
        "./directory1",
      ]
    );
    testMode("replace", () => [directory], ["Destinations:", "./directory1"]);
    testMode("branch", () => [directory.directories[0], directory], [
      "Destinations:",
      "directory1/directory2",
      "./directory1",
    ]);
  });
});
