import {assert} from "chai";
import * as Path from "path";

import { createLocationTest } from "./filters";
import {Options} from "./options";
import * as TestUtilities from "./testUtilities";

interface Test {
  excludes: string[];
  includes: string[];
  name: string;
  specs: { [key: string]: boolean };
}

const tests: Test[] = [
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

describe(
  "filter module has a",
  () => {
    describe(
      "createLocationTest function that",
      () => {
        tests.forEach(
          (test) => {
            describe(
              `returns a tester when given ${test.name} that`,
              () => {
                const logged: string[] = [];
                const options: Options = TestUtilities.mockOptions(logged);
                const locationTest = createLocationTest(test.includes, test.excludes, options.logger);

                for (const path of Object.keys(test.specs)) {
                  const expected = test.specs[path];
                  it(
                    `should return ${expected} for ${path}`,
                    () => {
                      assert.equal(
                        locationTest({ name: Path.basename(path), path }),
                        expected,
                      );
                    },
                  );
                }
              },
            );
          },
        );
      },
    );
  },
);
