"use strict";
var chai_1 = require("chai");
var Destinations = require("./destinations");
var TestUtilities = require("./test/utilities");
// tslint:disable:no-empty
describe("destinations module has a", function () {
    describe("getDestinations function that", function () {
        var directory;
        var destinations;
        var options;
        var logged;
        var testMode = function (mode, getExpectedDestinations, expectedLogs) {
            describe("when in '" + mode + "' mode", function () {
                beforeEach(function () {
                    options.location = mode;
                    destinations = Destinations.getDestinations(directory, options);
                });
                it("should select the correct destinations", function () {
                    chai_1.assert.deepEqual(destinations, getExpectedDestinations());
                });
                it("should log useful information to the logger", function () {
                    chai_1.assert.deepEqual(logged, expectedLogs);
                });
            });
        };
        beforeEach(function () {
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        testMode("top", function () { return [directory]; }, [
            "Destinations:",
            "./directory1",
        ]);
        testMode("below", function () { return directory.directories; }, [
            "Destinations:",
            "directory1/directory2",
            "directory1/directory3",
        ]);
        testMode("all", function () { return [
            directory.directories[0].directories[0],
            directory.directories[0],
            directory.directories[1],
            directory,
        ]; }, [
            "Destinations:",
            "directory1/directory2/directory4",
            "directory1/directory2",
            "directory1/directory3",
            "./directory1",
        ]);
        testMode("replace", function () { return [directory]; }, [
            "Destinations:",
            "./directory1",
        ]);
        testMode("branch", function () { return [directory.directories[0], directory]; }, [
            "Destinations:",
            "directory1/directory2",
            "./directory1",
        ]);
    });
});
//# sourceMappingURL=destinations.test.js.map