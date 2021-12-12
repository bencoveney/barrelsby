import { getArgs } from './args';
import Yargs from 'yargs';

describe('args module', () => {
  it('should load the get the configuration options from yargs', async () => {
    // Set up yargs.
    getArgs();

    const args = await Yargs.parse([
      '--delete',
      '--directory',
      './test',
      '--exclude',
      'zeta.ts$',
      '--include',
      'a.ts$',
      '--location',
      'top',
      '--local',
      '--name',
      'barrel',
      '--structure',
      'filesystem',
      '--verbose',
    ]);

    expect(args?.config).not.toBeDefined();
    expect(args?.delete).toEqual(true);
    expect(args.directory as string[]).toEqual(['./test']);
    expect(args.include as string[]).toEqual(['a.ts$']);
    expect(args.exclude as string[]).toEqual(['zeta.ts$']);
    expect(args.location).toEqual('top');
    expect(args.local).toEqual(true);
    expect(args.name).toEqual('barrel');
    expect(args.structure).toEqual('filesystem');
    expect(args.verbose).toEqual(true);
  });
  // TODO: Check things are defaulted correctly.
});

describe('args module', () => {
  it('should handle legacy directory configuration options from yargs', async () => {
    // Set up yargs.
    getArgs();

    const args = await Yargs.parse(['--config', './barrelsby-legacy-directory.json']);

    expect(args?.config).toBeDefined();
    expect(args?.directory).toEqual(['test']);
  });
});
