import { readFileSync } from 'fs';
import { CLIError } from '@oclif/errors';

/**
 * Loads a lockfile if exists. Otherwise an empty object
 * @param file where the lockfile is located incl. filename
 */
export function loadLockFile(file: string) {
  try {
    const data = readFileSync(file, 'utf-8');
    try {
      const result = JSON.parse(data);
      return result;
    } catch (error) {
      // Invalid lock file
      throw new CLIError('Invalid lock file (JSON)');
    }
  } catch (e) {
    // Expected that there is no lockfile file
    return {};
  }
}
