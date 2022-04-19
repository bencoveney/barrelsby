import { default as signale } from 'signale';

let logger: signale.Signale

export function getLogger({ isVerbose }: { isVerbose: boolean } = { isVerbose: false }) {
  if (!logger) {
    logger = new signale.Signale({
      disabled: false,
      interactive: false,
      logLevel: isVerbose ? 'info' : 'error',
      stream: process.stdout,
    })
  }
  return logger
}