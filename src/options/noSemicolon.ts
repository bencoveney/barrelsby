export type SemicolonCharacter = ';' | '';

export function getSemicolonCharacter(omitSemicolon: boolean): SemicolonCharacter {
  return omitSemicolon ? '' : ';';
}
