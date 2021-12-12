import { getQuoteCharacter } from './quoteCharacter';

describe('options/quoteCharacter module has a', () => {
  describe('getQuoteCharacter function that', () => {
    it('should correctly return the singlequote', () => {
      expect(getQuoteCharacter(true)).toEqual("'");
    });
    it('should correctly return the doublequote', () => {
      expect(getQuoteCharacter(false)).toEqual('"');
    });
  });
});
