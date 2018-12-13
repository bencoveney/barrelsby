import fs from "fs";

import { Directory } from "../fileTree/directory";
import { Location } from "../fileTree/location";
import { walkTree } from "../fileTree/walkTree";
import { Logger } from "../options/logger";

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
