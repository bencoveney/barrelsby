export type Logger = (logged: string) => void;

export function getLogger(isVerbose: boolean): Logger {
  // tslint:disable-next-line:no-console
  return isVerbose ? console.log : () => void 0;
}
