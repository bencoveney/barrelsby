"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Path = require("path");
const filters_1 = require("./filters");
const TestUtilities = require("./testUtilities");
const tests = [
    {
        excludes: [],
        includes: [],
        name: "no patterns",
        specs: {
            "directory1/barrel.ts": true,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": true,
            "directory1/index.ts": true,
        },
    },
    {
        excludes: [],
        includes: ["directory2"],
        name: "one include pattern",
        specs: {
            "directory1/barrel.ts": false,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": false,
            "directory1/index.ts": false,
        },
    },
    {
        excludes: [],
        includes: ["directory2", "deeplyNested.ts"],
        name: "two overlapping include patterns",
        specs: {
            "directory1/barrel.ts": false,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": false,
            "directory1/index.ts": false,
        },
    },
    {
        excludes: [],
        includes: ["directory2", "barrel.ts"],
        name: "two distinct include patterns",
        specs: {
            "directory1/barrel.ts": true,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": false,
            "directory1/index.ts": false,
        },
    },
    {
        excludes: ["directory2"],
        includes: [],
        name: "one exclude pattern",
        specs: {
            "directory1/barrel.ts": true,
            "directory1/directory2/directory4/deeplyNested.ts": false,
            "directory1/directory2/script.ts": false,
            "directory1/directory3/program.ts": true,
            "directory1/index.ts": true,
        },
    },
    {
        excludes: ["directory2", "deeplyNested.ts"],
        includes: [],
        name: "two overlapping exclude patterns",
        specs: {
            "directory1/barrel.ts": true,
            "directory1/directory2/directory4/deeplyNested.ts": false,
            "directory1/directory2/script.ts": false,
            "directory1/directory3/program.ts": true,
            "directory1/index.ts": true,
        },
    },
    {
        excludes: ["directory2", "barrel.ts"],
        includes: [],
        name: "two distinct exclude patterns",
        specs: {
            "directory1/barrel.ts": false,
            "directory1/directory2/directory4/deeplyNested.ts": false,
            "directory1/directory2/script.ts": false,
            "directory1/directory3/program.ts": true,
            "directory1/index.ts": true,
        },
    },
    {
        excludes: ["deeplyNested.ts"],
        includes: ["directory2"],
        name: "overlapping include and exclude patterns",
        specs: {
            "directory1/barrel.ts": false,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": false,
            "directory1/index.ts": false,
        },
    },
    {
        excludes: ["barrel.ts"],
        includes: ["directory2"],
        name: "distinct include and exclude patterns",
        specs: {
            "directory1/barrel.ts": false,
            "directory1/directory2/directory4/deeplyNested.ts": true,
            "directory1/directory2/script.ts": true,
            "directory1/directory3/program.ts": false,
            "directory1/index.ts": false,
        },
    },
];
describe("filter module has a", () => {
    describe("createLocationTest function that", () => {
        tests.forEach((test) => {
            describe(`returns a tester when given ${test.name} that`, () => {
                const logged = [];
                const options = TestUtilities.mockOptions(logged);
                const locationTest = filters_1.createLocationTest(test.includes, test.excludes, options.logger);
                for (const path of Object.keys(test.specs)) {
                    const expected = test.specs[path];
                    it(`should return ${expected} for ${path}`, () => {
                        chai_1.assert.equal(locationTest({ name: Path.basename(path), path }), expected);
                    });
                }
            });
        });
    });
});
//# sourceMappingURL=filters.test.js.map