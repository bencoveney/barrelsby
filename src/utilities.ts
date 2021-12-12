/** Convert path separator from windows to unix */
export function convertPathSeparator(path: string): string {
  return path.replace(/\\+/g, '/');
}

export const isTypeScriptFile = /\.tsx?$/m;
export const nonAlphaNumeric = /\W+/g;
export const thisDirectory = /^\.[\\\/]/g;
export const indentation = '  ';
