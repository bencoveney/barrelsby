declare module 'dir-compare' {
    export interface Options {
        compareSize: boolean;
        compareDate: boolean;
        dateTolerance: number;
        compareContent: boolean;
        skipSubdirs: boolean;
        skipSymlinks: boolean;
        ignoreCase: boolean;
        noDiffSet: boolean;
        includeFilter: boolean;
        excludeFilter: boolean;
        resultBuilder: Function;
    }

    export interface Results {
        distinct: number;
        equal: number;
        left: number;
        right: number;
        differences: number;
        distinctFiles: number;
        equalFiles: number;
        leftFiles: number;
        rightFiles: number;
        differencesFiles: number;
        distinctDirs: number;
        equalDirs: number;
        leftDirs: number;
        rightDirs: number;
        differencesDirs: number;
        same: boolean;
        diffSet?: Array<Difference>;
    }

    export interface Difference {
        state: "equal" | "left" | "right" | "distinct";
        path1: string;
        path2: string;
        relativePath: string;
        name1: string;
        name2: string;
        type1: "missing" | "file" | "directory";
        type2: "missing" | "file" | "directory";
        size1: number;
        size2: number;
        date1: number;
        date2: number;
        level: number;
    }

    export function compareSync(path1: string, path2: string, options?: Partial<Options>): Results;
    export function compare(path1: string, path2: string, options?: Partial<Options>): Promise<Results>;
}