import fs from "fs";

import { walkTree } from "./fileTree";
import { Logger } from "./options/logger";
import { Directory, Location } from "./utilities";

export function purge(
  rootTree: Directory,
  shouldPurge: boolean,
  barrelName: string,
  logger: Logger
) {
  // Delete any existing barrels.
  if (shouldPurge) {
    walkTree(rootTree, (directory: Directory) => {
      directory.files
        .filter((file: Location) => {
          return file.name === barrelName;
        })
        .forEach((file: Location) => {
          logger(`Deleting existing barrel @ ${file.path}`);
          // Delete barrel file and clean up tree model.
          fs.unlinkSync(file.path);
          directory.files.splice(directory.files.indexOf(file), 1);
          directory.barrel = undefined;
        });
    });
  }
}
