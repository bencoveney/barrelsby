import dirCompare from "dir-compare";
import { lstatSync, readdirSync } from "fs";
import { copy } from "fs-extra";
import { join } from "path";
import Yargs from "yargs";

import Barrelsby from "../bin";
import { getArgs } from "../bin/args";

// tslint:disable:no-console

getArgs();
const location = join(__dirname, "./");
Promise.all(
    readdirSync(location)
        .map((name) => join(location, name))
        .filter((path) => lstatSync(path).isDirectory())
        .map((directory) => {
            const args = Yargs.parse(["--config", join(directory, "barrelsby.json")]);
            args.directory = join(directory, args.directory);
            return copy(join(directory, "input"), join(directory, "output")).then(() => {
                Barrelsby(args as any);
                console.log(`Running integration test in directory ${directory}`);
                const comparison = dirCompare.compareSync(
                    join(directory, "output"),
                    join(directory, "expected"),
                );
                if (comparison.differences && comparison.diffSet) {
                    comparison.diffSet.filter((diff) => diff.state !== "equal").map((diff) => {
                        const state = ({
                            distinct : "<>",
                            equal : "==",
                            left : "->",
                            right : "<-",
                        } as any)[diff.state];
                        const name1 = diff.name1 ? diff.name1 : "";
                        const name2 = diff.name2 ? diff.name2 : "";
                        console.error(`${name1} ${diff.type1} ${state} ${name2} ${diff.type2}`);
                    });
                }
                if (comparison.differences && comparison.diffSet) {
                    console.error(`Error: ${comparison.differences} differences found!`);
                } else {
                    console.info(`No differences found`);
                }
                console.log();
                return comparison.differences;
            });
        })).then((differences) => process.exit(differences.filter((differenceCount) => differenceCount > 0).length));
