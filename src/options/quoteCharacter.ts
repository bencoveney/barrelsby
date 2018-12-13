export type QuoteCharacter = '"' | "'";

export function getQuoteCharacter(isSingleQuotes: boolean): QuoteCharacter {
  return isSingleQuotes ? "'" : '"';
}
