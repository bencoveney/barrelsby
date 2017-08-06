"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Destinations = require("./destinations");
const TestUtilities = require("./testUtilities");
describe("destinations module has a", () => {
    describe("getDestinations function that", () => {
        let directory;
        let destinations;
        let options;
        let logged;
        const testMode = (mode, getExpectedDestinations, expectedLogs) => {
            describe(`when in '${mode}' mode`, () => {
                beforeEach(() => {
                    options.location = mode;
                    destinations = Destinations.getDestinations(directory, options);
                });
                it("should select the correct destinations", () => {
                    chai_1.assert.deepEqual(destinations, getExpectedDestinations());
                });
                it("should log useful information to the logger", () => {
                    chai_1.assert.deepEqual(logged, expectedLogs);
                });
            });
        };
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        testMode("top", () => [directory], [
            "Destinations:",
            "./directory1",
        ]);
        testMode("below", () => directory.directories, [
            "Destinations:",
            "directory1/directory2",
            "directory1/directory3",
        ]);
        testMode("all", () => [
            directory.directories[0].directories[0],
            directory.directories[0],
            directory.directories[1],
            directory,
        ], [
            "Destinations:",
            "directory1/directory2/directory4",
            "directory1/directory2",
            "directory1/directory3",
            "./directory1",
        ]);
        testMode("replace", () => [directory], [
            "Destinations:",
            "./directory1",
        ]);
        testMode("branch", () => [directory.directories[0], directory], [
            "Destinations:",
            "directory1/directory2",
            "./directory1",
        ]);
    });
});
//# sourceMappingURL=destinations.test.js.map