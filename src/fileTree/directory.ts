import { Location } from "./location";

/** A directory in the file tree. */
export interface Directory extends Location {
  /** The directories within the directory. */
  directories: Directory[];
  /** The files within the directory. */
  files: Location[];
  /** The barrel within the directory if one exists. */
  barrel?: Location;
}
