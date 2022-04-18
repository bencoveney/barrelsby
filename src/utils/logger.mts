import { Signale } from 'signale';

let logger: Signale

export function getLogger({ isVerbose }: { isVerbose: boolean } = { isVerbose: false }) {
  if (!logger) {
    logger = new Signale({
      disabled: false,
      interactive: false,
      logLevel: isVerbose ? 'info' : 'error',
      stream: process.stdout,
    })
  }
  return logger
}