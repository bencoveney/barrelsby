import Sinon from 'sinon';

import * as TestUtilities from '../testUtilities';
import * as Flat from './flat';
import { Signale } from 'signale';
import { Directory } from '../interfaces/directory.interface';

describe('builder/flat module has a', () => {
  describe('buildFlatBarrel function that', () => {
    describe('when using the default settings', () => {
      let output: string;
      let spySandbox: sinon.SinonSandbox;
      const signale = new Signale();
      let logger: Sinon.SinonSpy;
      beforeEach(() => {
        const directory = TestUtilities.mockDirectoryTree();
        spySandbox = Sinon.createSandbox();
        logger = spySandbox.spy(signale, 'debug');
        output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          '"',
          ';',
          signale,
          undefined,
          false,
          false
        );
      });
      afterEach(() => {
        spySandbox.restore();
      });
      it('should produce the correct output', () => {
        TestUtilities.assertMultiLine(
          output,
          `export * from "./barrel";
export * from "./index";
export * from "./directory2/script";
export * from "./directory2/directory4/deeplyNested";
export * from "./directory3/program";
`
        );
      });
      it('should log useful information to the logger', () => {
        const messages = [
          'Including path ./barrel',
          'Including path ./index',
          'Including path ./directory2/script',
          'Including path ./directory2/directory4/deeplyNested',
          'Including path ./directory3/program',
        ];
        expect(logger.callCount).toEqual(messages.length);
        messages.forEach((message: string, index: number) => {
          expect(logger.getCall(index).args[0]).toEqual(message);
        });
      });
      it('should produce output compatible with the recommended tslint ruleset', () => {
        TestUtilities.tslint(output, '"');
      });
    });

    describe('when using single quotes', () => {
      let output: string;
      let spySandbox: sinon.SinonSandbox;
      let logger: Sinon.SinonSpy;
      const signale = new Signale();
      beforeEach(() => {
        const directory = TestUtilities.mockDirectoryTree();
        spySandbox = Sinon.createSandbox();
        logger = spySandbox.spy(signale, 'debug');
        output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          "'",
          ';',
          signale,
          undefined,
          false,
          false
        );
      });
      afterEach(() => {
        spySandbox.restore();
      });
      it('should produce the correct output', () => {
        TestUtilities.assertMultiLine(
          output,
          `export * from './barrel';
export * from './index';
export * from './directory2/script';
export * from './directory2/directory4/deeplyNested';
export * from './directory3/program';
`
        );
      });
      it('should log useful information to the logger', () => {
        const messages = [
          'Including path ./barrel',
          'Including path ./index',
          'Including path ./directory2/script',
          'Including path ./directory2/directory4/deeplyNested',
          'Including path ./directory3/program',
        ];
        expect(logger.callCount).toEqual(messages.length);
        messages.forEach((message: string, index: number) => {
          expect(logger.getCall(index).args[0]).toEqual(message);
        });
      });
      it('should produce output compatible with the recommended tslint ruleset', () => {
        TestUtilities.tslint(output, "'");
      });
    });

    describe('when using no semicolon', () => {
      let output: string;
      let spySandbox: sinon.SinonSandbox;
      let logger: Sinon.SinonSpy;
      const signale = new Signale();
      beforeEach(() => {
        const directory = TestUtilities.mockDirectoryTree();
        spySandbox = Sinon.createSandbox();
        logger = spySandbox.spy(signale, 'debug');
        output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          '"',
          '',
          signale,
          undefined,
          false,
          false
        );
      });
      afterEach(() => {
        spySandbox.restore();
      });
      it('should produce the correct output', () => {
        TestUtilities.assertMultiLine(
          output,
          `export * from "./barrel"
export * from "./index"
export * from "./directory2/script"
export * from "./directory2/directory4/deeplyNested"
export * from "./directory3/program"
`
        );
      });
      it('should log useful information to the logger', () => {
        const messages = [
          'Including path ./barrel',
          'Including path ./index',
          'Including path ./directory2/script',
          'Including path ./directory2/directory4/deeplyNested',
          'Including path ./directory3/program',
        ];
        expect(logger.callCount).toEqual(messages.length);
        messages.forEach((message: string, index: number) => {
          expect(logger.getCall(index).args[0]).toEqual(message);
        });
      });
    });

    describe('when using the exportDefault setting', () => {
      let output: string;
      let spySandbox: sinon.SinonSandbox;
      const signale = new Signale();
      beforeEach(() => {
        const directory = TestUtilities.mockDirectoryTree();
        spySandbox = Sinon.createSandbox();
        output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          '"',
          ';',
          signale,
          undefined,
          true,
          false
        );
      });
      afterEach(() => {
        spySandbox.restore();
      });
      it('should produce the correct output', () => {
        TestUtilities.assertMultiLine(
          output,
          `export { default as barrel } from "./barrel";
export * from "./barrel";
export { default as index } from "./index";
export * from "./index";
export { default as script } from "./directory2/script";
export * from "./directory2/script";
export { default as deeplyNested } from "./directory2/directory4/deeplyNested";
export * from "./directory2/directory4/deeplyNested";
export { default as program } from "./directory3/program";
export * from "./directory3/program";
`
        );
      });

      it('should produce the correct output when a part of the filename starts with a number', () => {
        const directory: Directory = {
          directories: [],
          files: [
            {
              name: 'file-with-number-1.ts',
              path: 'directory1/file-with-number-1.ts',
            },
          ],
          name: 'directory1',
          path: './directory1',
        };

        const output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          '"',
          ';',
          signale,
          undefined,
          true,
          false
        );

        TestUtilities.assertMultiLine(
          output,
          `export { default as fileWithNumber1 } from "./file-with-number-1";
export * from "./file-with-number-1";
`
        );
      });

      it('should produce output compatible with the recommended tslint ruleset', () => {
        TestUtilities.tslint(output, '"');
      });
    });

    describe('when using the exportDefault and fullPathname setting', () => {
      let output: string;
      let spySandbox: sinon.SinonSandbox;
      const signale = new Signale();
      beforeEach(() => {
        const directory = TestUtilities.mockDirectoryTree();
        spySandbox = Sinon.createSandbox();
        output = Flat.buildFlatBarrel(
          directory,
          TestUtilities.mockModules(directory),
          '"',
          ';',
          signale,
          undefined,
          true,
          true
        );
      });
      afterEach(() => {
        spySandbox.restore();
      });
      it('should produce the correct output', () => {
        TestUtilities.assertMultiLine(
          output,
          `export { default as barrel } from "./barrel";
export * from "./barrel";
export { default as index } from "./index";
export * from "./index";
export { default as directory2Script } from "./directory2/script";
export * from "./directory2/script";
export { default as directory2Directory4DeeplyNested } from "./directory2/directory4/deeplyNested";
export * from "./directory2/directory4/deeplyNested";
export { default as directory3Program } from "./directory3/program";
export * from "./directory3/program";
`
        );
      });
      it('should produce output compatible with the recommended tslint ruleset', () => {
        TestUtilities.tslint(output, '"');
      });
    });
  });
});
