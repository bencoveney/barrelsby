import { getSemicolonCharacter } from './noSemicolon';

describe('options/noSemicolon module has a', () => {
  describe('getSemicolonCharacter function that', () => {
    it('should correctly return the semicolon', () => {
      expect(getSemicolonCharacter(false)).toEqual(';');
    });
    it('should correctly return the empty string', () => {
      expect(getSemicolonCharacter(true)).toEqual('');
    });
  });
});
