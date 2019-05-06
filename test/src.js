"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dir_compare_1 = __importDefault(require("dir-compare"));
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const yargs_1 = __importDefault(require("yargs"));
const bin_1 = __importDefault(require("../bin"));
const args_1 = require("../bin/args");
// tslint:disable-next-line:no-var-requires
const console = require("better-console");
// tslint:disable:no-console
args_1.getArgs();
const location = path_1.join(__dirname, "./");
Promise.all(fs_1.readdirSync(location)
    .map(name => path_1.join(location, name))
    .filter(path => fs_1.lstatSync(path).isDirectory())
    .map(directory => {
    const args = yargs_1.default.parse(["--config", path_1.join(directory, "barrelsby.json")]);
    args.directory = path_1.join(directory, args.directory);
    return fs_extra_1.copy(path_1.join(directory, "input"), path_1.join(directory, "output")).then(() => {
        bin_1.default(args);
        console.log(`Running integration test in directory ${directory}`);
        const outputDirectory = path_1.join(directory, "output");
        const expectedDirectory = path_1.join(directory, "expected");
        console.log("Output directory:", outputDirectory);
        console.log("Expected directory:", expectedDirectory);
        const comparison = dir_compare_1.default.compareSync(outputDirectory, expectedDirectory, {
            compareContent: true,
            compareFileAsync: dir_compare_1.default.fileCompareHandlers.lineBasedFileCompare
                .compareAsync,
            compareFileSync: dir_compare_1.default.fileCompareHandlers.lineBasedFileCompare.compareSync,
            ignoreLineEnding: true
        });
        if (comparison.differences && comparison.diffSet) {
            comparison.diffSet
                .filter(diff => diff.state !== "equal")
                .map(diff => {
                const state = {
                    distinct: "<>",
                    equal: "==",
                    left: "->",
                    right: "<-"
                }[diff.state];
                const name1 = diff.name1 ? diff.name1 : "";
                const name2 = diff.name2 ? diff.name2 : "";
                console.error(`${name1} ${diff.type1} ${state} ${name2} ${diff.type2}`);
            });
        }
        if (comparison.differences && comparison.diffSet) {
            console.error(`Error: ${comparison.differences} differences found!`);
        }
        else {
            console.info(`No differences found in ${comparison.equalFiles}`);
        }
        console.log();
        return comparison.differences;
    });
})).then(differences => process.exit(differences.filter(differenceCount => differenceCount > 0).length));
