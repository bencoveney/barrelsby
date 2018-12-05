import fs from "fs";

import { walkTree } from "./fileTree";
import { Options } from "./options/options";
import { Directory, Location } from "./utilities";

export function purge(
  rootTree: Directory,
  options: Options,
  barrelName: string
) {
  // Delete any existing barrels.
  if (options.delete) {
    walkTree(rootTree, (directory: Directory) => {
      directory.files
        .filter((file: Location) => {
          return file.name === barrelName;
        })
        .forEach((file: Location) => {
          options.logger(`Deleting existing barrel @ ${file.path}`);
          // Delete barrel file and clean up tree model.
          fs.unlinkSync(file.path);
          directory.files.splice(directory.files.indexOf(file), 1);
          directory.barrel = undefined;
        });
    });
  }
}
