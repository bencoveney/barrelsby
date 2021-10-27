import { Signale } from "signale";
export declare type Logger = Signale;
export declare function getLogger({ isVerbose }?: {
    isVerbose: boolean;
}): Logger;
