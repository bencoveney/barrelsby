import { compareSync, fileCompareHandlers } from 'dir-compare';
import { lstatSync, readdirSync } from 'fs';
import { copy } from 'fs-extra';
import { join } from 'path';
import Yargs from 'yargs';
import rimraf from 'rimraf';

import { Barrelsby } from '../src';
import { getArgs } from '../src/args';
import { Arguments } from '../src/options/options';
import { promisify } from 'util';
import { getRootConfigKeys } from "../src/builder";

// tslint:disable-next-line:no-var-requires
const console = require('better-console');

const rimrafP = promisify(rimraf);

// tslint:disable:no-console
getArgs();
const location = join(__dirname, './');
Promise.all(
  readdirSync(location)
    .map(name => join(location, name))
    .filter(path => lstatSync(path).isDirectory())
    .map(async directory => {
      const formatDirectory = (d: string|string[]|undefined) => Array.isArray(d)
        ? d.map((dir: string) => join(directory, dir))
        : join(directory, d as string);

      const args: Arguments = await Yargs.parse(['--config', join(directory, 'barrelsby.json')]);


      const cfgKeys = getRootConfigKeys(args);
      if(cfgKeys.length) cfgKeys.forEach((key: any) => (args as any)[key].directory = formatDirectory((args as any)[key].directory))
      else args.directory = formatDirectory(args.directory)

      args.verbose = true;
      await rimrafP(join(directory, 'output'));
      return copy(join(directory, 'input'), join(directory, 'output')).then(() => {
        console.log('args', args);
        Barrelsby(args as any);
        console.log(`Running integration test in directory ${directory}`);
        const outputDirectory = join(directory, 'output');
        const expectedDirectory = join(directory, 'expected');
        console.log('Output directory:', outputDirectory);
        console.log('Expected directory:', expectedDirectory);
        const comparison = compareSync(outputDirectory, expectedDirectory, {
          compareContent: true,
          compareFileAsync: fileCompareHandlers.lineBasedFileCompare.compareAsync,
          compareFileSync: fileCompareHandlers.lineBasedFileCompare.compareSync,
          ignoreLineEnding: true,
        });
        if (comparison.differences && comparison.diffSet) {
          console.info(comparison.diffSet);
          comparison.diffSet
            .filter(diff => diff.state !== 'equal')
            .map(diff => {
              const state = (
                {
                  distinct: '<>',
                  equal: '==',
                  left: '->',
                  right: '<-',
                } as any
              )[diff.state];
              const name1 = diff.name1 ? diff.name1 : '';
              const name2 = diff.name2 ? diff.name2 : '';
              console.error(`${name1} ${diff.type1} ${state} ${name2} ${diff.type2}`);
            });
        }
        if (comparison.differences && comparison.diffSet) {
          console.error(`Error: ${comparison.differences} differences found!`);
        } else {
          console.info(`No differences found in ${comparison.equalFiles}`);
        }
        console.log();
        return comparison.differences;
      });
    })
).then(differences => process.exit(differences.filter(differenceCount => differenceCount > 0).length));

