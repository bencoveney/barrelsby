import fs from 'fs';
import Yargs from 'yargs';
import { Arguments, getOptionsConfig } from './options/options';

const configParser = (configPath: string): any => {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Backwards compatibility for directory string, as opposed to an array
  if (config.directory && typeof config.directory === 'string') {
    config.directory = [config.directory];
  }

  return config;
};

export function getArgs(): Yargs.Argv<Arguments> {
  // @ts-ignore Work around deep types.
  return Yargs.usage('Usage: barrelsby [options]')
    .example('barrelsby', 'Run barrelsby')

    .options(getOptionsConfig(configParser))

    .version()
    .alias('v', 'version')
    .default('v', false)
    .help('h')
    .alias('h', 'help')
    .default('h', false);
}
