import { isTypeScriptFile } from '../utilities';
import { Logger } from './logger';

export function getBarrelName(name: string, logger: Logger): string {
  // Resolve barrel name.
  const nameArgument: string = name;
  const barrelName = nameArgument.match(isTypeScriptFile) ? nameArgument : `${nameArgument}.ts`;

  logger.debug(`Using name ${barrelName}`);

  return barrelName;
}
