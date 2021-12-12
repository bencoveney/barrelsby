import { Signale } from 'signale';

export type Logger = Signale;

let logger: Logger;

export function getLogger({ isVerbose }: { isVerbose: boolean } = { isVerbose: false }): Logger {
  if (!logger) {
    logger = new Signale({
      disabled: false,
      interactive: false,
      logLevel: isVerbose ? 'info' : 'error',
      stream: process.stdout,
    });
  }
  return logger;
}
