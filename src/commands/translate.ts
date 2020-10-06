import Command, { flags } from '@oclif/command';
import { CLIError } from '@oclif/errors';
import { writeFileSync, readFileSync } from 'fs';
import flatten from 'flat';
import omit from 'lodash.omit';
import Listr, { ListrTask } from 'listr';
import { readConfig, SimpleenConfig } from '../helpers/config';
import { loadLockFile } from '../helpers/lock';
import {
  replaceVariablesInPath,
  getFilePaths,
  getHashFromPath,
  translateIntoLanguage,
} from '../helpers/translation';

/**
 * Translates project to the configured target languages
 * considers the lock file to exclude allready translated/verfied translations
 */
export class TranslateCommand extends Command {
  static description = 'Translate project';

  static flags = {
    config: flags.string({
      default: './simpleen.config.json',
      description: 'Defines where you config file is located',
    }),
    lockFile: flags.string({
      default: './simpleen.lock.json',
      description: 'Defines where your lock file is located',
    }),
  };

  async run() {
    const { flags } = this.parse(TranslateCommand);

    let config = readConfig(flags.config);

    const translationTasks: ListrTask[] = [];

    // Read lock file
    const lockData = loadLockFile(flags.lockFile);

    // Read all source files to translate
    const files = await getFilePaths(config.input_path);

    // Read each file and translate it
    files.forEach((file) => {
      try {
        const data = readFileSync(file, 'utf-8');
        const translationData = JSON.parse(data);

        config.target_languages.forEach((language: string) => {
          // Target file
          const targetFile = replaceVariablesInPath(
            file,
            config.output_path,
            language,
          );
          const targetHash = getHashFromPath(targetFile);

          const translatedData = lockData?.[targetHash]?.[language]
            ? lockData[targetHash][language]
            : {};

          // Omit keys from lock file
          const omitKeys = Object.keys(flatten(translatedData));

          const toBeTranslated = omit(translationData, omitKeys);

          const total = Object.keys(flatten(translationData)).length;
          const totalTranslate = Object.keys(toBeTranslated).length;

          // Add to tasks
          translationTasks.push({
            title: `Translate ${totalTranslate}/${total} ${config.source_language} => ${language}`,
            task: async () => {
              const result = await translateIntoLanguage(
                config,
                translatedData,
                toBeTranslated,
                language,
              );

              writeFileSync(
                targetFile,
                JSON.stringify(result, null, 2),
              );
            },
            skip: () => {
              if (total === 0) {
                return 'No data found to translate';
              }
              if (totalTranslate === 0) {
                return `All keys are locked (${omitKeys.length} of ${total})`;
              }
              return false;
            },
          });
        });
      } catch (e) {
        throw new CLIError(e);
      }
    });

    // Run tasks
    const tasks = new Listr(translationTasks);

    tasks.run().catch((err) => {
      this.error(err);
    });
  }
}
