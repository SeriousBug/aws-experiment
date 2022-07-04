import * as path from "path";
import { readdirSync, statSync } from "fs";

/** Returns all files recursively, starting at the given path. */
export function getFiles(path_: string): string[] {
  if (statSync(path_).isFile()) {
    return [path_];
  }
  return readdirSync(path_).flatMap((entry) => {
    return getFiles(path.join(path_, entry));
  });
}
