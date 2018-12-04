import { Options } from "./options";
import { Directory, Location } from "./utilities";
export declare function mockFsConfiguration(): {
    "code.ts": string;
    directory1: {
        "barrel.ts": string;
        directory2: {
            directory4: {
                "deeplyNested.ts": string;
            };
            "script.ts": string;
        };
        directory3: {
            "program.ts": string;
        };
        "ignore.txt": string;
        "index.ts": string;
    };
};
export declare function mockDirectoryTree(): Directory;
export declare function mockModules(rootDirectory: Directory): Location[];
export declare function mockOptions(loggerTarget: string[]): Options;
export declare function assertMultiLine(actual: string, expected: string): void;
export declare function tslint(content: string, options: Options): void;
