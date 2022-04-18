import { FileTreeLocation } from './location.interface.mjs';

export interface Directory extends FileTreeLocation {
  /** The directories within the directory. */
  directories: Directory[];
  /** The files within the directory. */
  files: FileTreeLocation[];
  /** The barrel within the directory if one exists. */
  barrel?: FileTreeLocation;
}