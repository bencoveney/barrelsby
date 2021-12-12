import * as Utilities from './utilities';

describe('utilities module has a', () => {
  describe('isTypeScriptFile regular expression that', () => {
    it('should match a typescript file', () => {
      expect('instructions.ts'.search(Utilities.isTypeScriptFile)).not.toEqual(-1);
    });
    it('should match a typescript file in a directory', () => {
      expect('src/code/scripts/instructions.ts'.search(Utilities.isTypeScriptFile)).not.toEqual(-1);
    });
    it('should match a typescript definition file', () => {
      expect('definitions.d.ts'.search(Utilities.isTypeScriptFile)).not.toEqual(-1);
    });
    it('should match a typescript jsx (.tsx) file', () => {
      expect('other.tsx'.search(Utilities.isTypeScriptFile)).not.toEqual(-1);
    });
    it('should not match a non-typescript file', () => {
      expect('other.cs'.search(Utilities.isTypeScriptFile)).toEqual(-1);
    });
  });
  describe('nonAlphaNumeric regular expression that', () => {
    it('should match any non-alpha-numeric characters', () => {
      const input = 'aA1!bB2"cC3£dD4$';
      const output = input.replace(Utilities.nonAlphaNumeric, '');
      expect(output).toEqual('aA1bB2cC3dD4');
    });
  });
  describe('indentation constant that', () => {
    it('is only whitespace', () => {
      expect(Utilities.indentation.trim()).toEqual('');
    });
  });
  describe('convertPathSeparator function that', () => {
    it('should window path seperators with unix ones', () => {
      const result = Utilities.convertPathSeparator('my\\long/path');
      expect(result).toEqual('my/long/path');
    });
  });
});
