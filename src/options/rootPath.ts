import path from "path";

export function resolveRootPath(directory: string): string {
  // tslint:disable-next-line:no-console
  console.log("dir: ", directory);
  const resolved = path.resolve(directory);
  // tslint:disable-next-line:no-console
  console.log("resolved ", resolved);
  return resolved;
}
