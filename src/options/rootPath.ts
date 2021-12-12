import path from 'path';

export function resolveRootPath(directory: string): string {
  return path.resolve(directory);
}
