import { readFileSync } from "fs";
import { CLIError } from "@oclif/errors";
import { TranslationData } from "./translation";
import { writeFileSync } from "fs";

export type LockData = {
  [pathHash: string]: {
    [languageCode: string]: TranslationData;
  };
};

/**
 * Loads a lockfile if exists. Otherwise an empty object
 * @param file where the lockfile is located incl. filename
 */
export function loadLockFile(file: string): LockData {
  try {
    const data = readFileSync(file, "utf-8");
    try {
      const result = JSON.parse(data);
      return result;
    } catch (error) {
      // Invalid lock file
      throw new CLIError("Invalid lock file (JSON)");
    }
  } catch (e) {
    // Expected that there is no lockfile file
    return {};
  }
}
/**
 * Save lock file to exclude corresponding/adapted keys in translate command
 * @param data that can be stringified
 * @param file path where lock file should be saved
 */
export function saveLockFile(data: LockData, file: string): void {
  try {
    writeFileSync(file, JSON.stringify(data), {
      encoding: "utf-8",
    });
  } catch (e) {
    throw new CLIError("Could not save lock file " + e.message);
  }
}

export default {
  loadLockFile,
  saveLockFile,
};
