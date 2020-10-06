import Command, { flags } from '@oclif/command';
import { readFileSync, writeFileSync } from 'fs';
import { readConfig } from '../helpers/config';
import inquirer from 'inquirer';
import { target_languages } from './init';
import { loadLockFile } from '../helpers/lock';
import {
  replaceVariablesInPath,
  getHashFromPath,
  getFilePaths,
} from '../helpers/translation';

/**
 * Locks the translations of the configured target languages
 * The locked translations will not be changed afterwards
 */
export class LockCommand extends Command {
  static description = 'Lock the current translation values';

  static flags = {
    config: flags.string({
      default: './simpleen.config.json',
      description: 'Defines where the config is located',
    }),
    lockFile: flags.string({
      default: './simpleen.lock.json',
      description: 'Defines where the lock file will be created',
    }),
  };

  async run() {
    const { flags } = this.parse(LockCommand);
    const config = readConfig(flags.config);

    const target_languages_choices = target_languages.filter((l) =>
      config.target_languages.includes(l.value),
    );

    // Let the user select the target language to lock
    let response = await inquirer.prompt([
      {
        name: 'language',
        message: 'Select the target language you want to lock',
        type: 'list',
        choices: [
          { name: 'All', value: 'all' },
          ...target_languages_choices,
        ],
      },
    ]);

    const readTranslation = (path: string) => {
      try {
        const data = readFileSync(path, 'utf-8');
        return JSON.parse(data);
      } catch (err) {
        this.log(`Info: Translation file not found: ${path}`);
        return null;
      }
    };

    let translations: object;

    const files = await getFilePaths(config.input_path);

    files.forEach((file) => {
      if (response.language === 'all') {
        // Read all existing language files
        translations = config.target_languages.reduce(
          (translations: any, lang) => {
            const path = replaceVariablesInPath(
              file,
              config.output_path,
              lang,
            );
            const hashedPath = getHashFromPath(path);

            let result = readTranslation(path);

            return {
              ...translations,
              [hashedPath]: {
                ...translations[hashedPath],
                [lang]: result,
              },
            };
          },
          {},
        );
      } else {
        // Read lockfile
        const lockData = loadLockFile(flags.lockFile);

        const lang = response.language;
        const path = replaceVariablesInPath(
          file,
          config.output_path,
          lang,
        );
        const hashedPath = getHashFromPath(path);

        // Merge lock file with selected language
        translations = {
          ...lockData,
          [hashedPath]: {
            ...lockData[hashedPath],
            [lang]: readTranslation(path),
          },
        };
      }

      // Save lock file to further use in translate command
      writeFileSync(flags.lockFile, JSON.stringify(translations), {
        encoding: 'utf-8',
      });
    });
  }
}
