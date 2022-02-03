import fs from 'fs';
import Yargs from 'yargs';
import { Arguments, getOptionsConfig } from './options/options';

const configParser = (configPath: string): any => {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Backwards compatibility for directory string, as opposed to an array
  (Array.isArray(config) ? config : [config])
      .filter(c => !!c.directory && typeof c.directory === 'string')
      .forEach(conf => { conf.directory = [conf.directory]; });

  return config;
};

export function getArgs(loader=configParser): Yargs.Argv<Arguments> {
  // @ts-ignore Work around deep types.
  return Yargs.usage('Usage: barrelsby [options]')
    .example('barrelsby', 'Run barrelsby')
    .options(getOptionsConfig(loader))

    .version()
    .alias('v', 'version')
    .default('v', false)
    .help('h')
    .alias('h', 'help')
    .default('h', false);
}